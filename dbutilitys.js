// require('dotenv').config(); // Load environment variables from .env
const mysql = require('mysql2');

// Function to create a new MySQL connection
const createConnection = () => {
    return mysql.createConnection({
        host: 'MYSQL5048.site4now.net',
        user: 'a50d85_payroll',
        password: 'p3r3nnial',
        database: 'db_a50d85_payroll',
    });
};

const insertData = (data) => {
    return new Promise((resolve, reject) => {
        const db = createConnection(); // Create a new connection
        db.connect(err => {
            if (err) {
                console.error('Error connecting to MySQL:', err.message);
                reject({ success: false, message: 'Database connection failed.' });
                return;
            }

            // Ensure regid is a valid integer
            const regid = parseInt(data.regid, 10);
            if (!Number.isInteger(regid)) {
                reject({ success: false, message: 'Invalid regid. Must be an integer.' });
                db.end();
                return;
            }

            const query = `INSERT INTO RollCallLiveTracking (superid, regid, dateoftransaction, latitude, longitude, address, isactive)
                           VALUES (?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                data.superid,
                regid, // Insert the single integer regid
                data.dateoftransaction,
                data.latitude || null, // Default to null if not provided
                data.longitude || null, // Default to null if not provided
                data.address || 'Unknown', // Default to 'Unknown' if not provided
                data.isactive || 0 // Default to 0 if not provided
            ];

            db.query(query, values, (err, results) => {
                if (err) {
                    console.error(`Insert failed for regid ${regid}:`, err.message);
                    reject({ success: false, message: `Failed to insert data for regid ${regid}`, error: err.message });
                } else {
                    db.end(); // Close the connection after the insert
                    resolve({ success: true, message: `Data inserted successfully for regid ${regid}`, id: results.insertId });
                }
            });
        });
    });
};

// Function to retrieve data from the database
const getData = (date,regid,superid,conditions = {}) => {
    return new Promise((resolve, reject) => {
        const db = createConnection(); // Create a new connection
        db.connect(err => {
            if (err) {
                console.error('Error connecting to MySQL:', err.message);
                reject({ success: false, message: 'Database connection failed.' });
                return;
            }

            let query = `SELECT id,superid, regid, dateoftransaction, latitude,longitude,address FROM  RollCallLiveTracking  
where dateoftransaction 
between '${date} 00:00:00' and '${date} 23:59:59' and regid = ${regid} and superid = ${superid}`;
            console.log(query)
            const conditionKeys = Object.keys(conditions);
            if (conditionKeys.length > 0) {
                const whereClause = conditionKeys
                    .map(key => `${key} = ?`)
                    .join(' AND ');
                query += ` WHERE ${whereClause}`;
            }

            db.query(query, Object.values(conditions), (err, results) => {
                db.end(); // Close the connection
                if (err) {
                    console.error('Retrieve data error:', err.message);
                    reject({ success: false, message: 'Failed to retrieve data.' });
                } else {
                    resolve({ success: true, data: results });
                }
            });
        });
    });
};

module.exports = { insertData, getData };
