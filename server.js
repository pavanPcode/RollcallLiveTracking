const express = require('express');
const bodyParser = require('body-parser');
const { insertData,getData } = require('./dbutilitys.js'); // Import insertData function from the database module

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST API to insert data
app.post('/writeLiveTracking', (req, res) => {
    const data = req.body; // Read the JSON data from the request body

    // Call the insertData function
    insertData(data)
        .then(response => {
            res.status(200).json(response); // Send success response
        })
        .catch(error => {
            res.status(500).json(error); // Send error response
        });
});


// POST API to insert data
app.get('/getLiveTracking', (req, res) => {
    const date = req.query.date; // Read the JSON data from the request body
    const regid = req.query.regid

    // Call the insertData function
    getData(date,regid)
        .then(response => {
            res.status(200).json(response); // Send success response
        })
        .catch(error => {
            res.status(500).json(error); // Send error response
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
