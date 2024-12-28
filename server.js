const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL password here
    database: 'HSRPBooking',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API Routes

// Add Booking Details
app.post('/api/booking-details', (req, res) => {
    const { state, wheeler_reg_no, chassis_no, engine_no } = req.body;

    const query = `INSERT INTO bookings (state, wheeler_reg_no, chassis_no, engine_no) VALUES (?, ?, ?, ?)`;
    db.query(query, [state, wheeler_reg_no, chassis_no, engine_no], (err, result) => {
        if (err) {
            res.status(500).send({ error: 'Error inserting booking details' });
            console.error(err);
            return;
        }
        res.send({ message: 'Booking details saved', bookingId: result.insertId });
    });
});

// Add User Details
app.post('/api/user-details', (req, res) => {
    const { booking_id, name, email, phone, address } = req.body;

    const query = `INSERT INTO users (booking_id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [booking_id, name, email, phone, address], (err) => {
        if (err) {
            res.status(500).send({ error: 'Error inserting user details' });
            console.error(err);
            return;
        }
        res.send({ message: 'User details saved' });
    });
});

// Get Details by Booking ID
app.get('/api/details/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT b.state, b.wheeler_reg_no, b.chassis_no, b.engine_no, u.name, u.email, u.phone, u.address
        FROM bookings b
        LEFT JOIN users u ON b.id = u.booking_id
        WHERE b.id = ?
    `;
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Error retrieving details' });
            console.error(err);
            return;
        }
        res.send(results[0]);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
