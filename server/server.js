const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const app = express();

// Load environment variables
dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST || 'localhost',
    user: process.env.MYSQL_ADDON_USER || 'root',
    password: process.env.MYSQL_ADDON_PASSWORD || '',
    database: process.env.MYSQL_ADDON_DB || 'hsrp',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || 10, 10),
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || 0, 10),
    port: process.env.MYSQL_ADDON_PORT || 3306,
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve HTML Pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

['user-form', 'booking-form', 'payment-form', 'entered-form'].forEach((page) => {
    app.get(`/${page}.html`, (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', `${page}.html`));
    });
});

// API Routes

// Add Booking Details
app.post('/api/booking-details', async (req, res) => {
    const { state, wheeler_reg_no, chassis_no, engine_no } = req.body;
    const query = `
        INSERT INTO bookings (state, wheeler_reg_no, chassis_no, engine_no)
        VALUES (?, ?, ?, ?)
    `;
    try {
        await pool.execute(query, [state, wheeler_reg_no, chassis_no, engine_no]);
        res.status(201).send({ message: 'Booking details saved successfully' });
    } catch (error) {
        console.error('Error inserting booking details:', error);
        res.status(500).send({ error: 'Failed to save booking details' });
    }
});

// Add User Details
app.post('/api/user-details', async (req, res) => {
    const { wheeler_reg, name, email, phone, address } = req.body;
    const query = `
        INSERT INTO users (wheeler_reg, name, email, phone, address)
        VALUES (?, ?, ?, ?, ?)
    `;
    try {
        await pool.execute(query, [wheeler_reg, name, email, phone, address]);
        res.status(201).send({ message: 'User details saved successfully' });
    } catch (error) {
        console.error('Error inserting user details:', error);
        res.status(500).send({ error: 'Failed to save user details' });
    }
});

// Get Details by Booking ID
app.get('/api/details/:id', async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT b.state, b.wheeler_reg_no, b.chassis_no, b.engine_no, u.name, u.email, u.phone, u.address
        FROM bookings b
        LEFT JOIN users u ON b.wheeler_reg_no = u.wheeler_reg
        WHERE b.wheeler_reg_no = ?
    `;
    try {
        const [results] = await pool.execute(query, [id]);
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.status(404).send({ error: 'No details found for the given booking ID' });
        }
    } catch (error) {
        console.error('Error retrieving details:', error);
        res.status(500).send({ error: 'Failed to retrieve details' });
    }
});

// Admin: Fetch All Bookings
app.get('/api/admin', async (req, res) => {
    const query = `
        SELECT  b.state, b.wheeler_reg_no, b.chassis_no, b.engine_no,
               u.name, u.email, u.phone, u.address
        FROM bookings b
        LEFT JOIN users u ON b.wheeler_reg_no = u.wheeler_reg
    `;
    try {
        const [results] = await pool.execute(query);
        res.send(results);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).send({ error: 'Failed to fetch bookings' });
    }
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
