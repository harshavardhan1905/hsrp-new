const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Async function to connect to MySQL database
async function initializeDB() {
    try {
        const db = await mysql.createConnection({
            host: process.env.MYSQL_ADDON_HOST,
            user: process.env.MYSQL_ADDON_USER,
            password: process.env.MYSQL_ADDON_PASSWORD,
            database: process.env.MYSQL_ADDON_DB,
            waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS === 'true',
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || 10, 10),
            queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || 0, 10),
            port: process.env.MYSQL_ADDON_PORT,
        });
        console.log('Database connected successfully');
        return db;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit if the database connection fails
    }
}

// Initialize the database connection
let db;
initializeDB()
    .then((connection) => {
        db = connection; // Store the db connection globally
    })
    .catch(() => {
        console.error('Database initialization failed');
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
        await db.execute(query, [state, wheeler_reg_no, chassis_no, engine_no]);
        res.status(201).send({ message: 'Booking details saved' });
    } catch (error) {
        console.error('Error inserting booking details:', error);
        res.status(500).send({ error: 'Error inserting booking details' });
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
        await db.execute(query, [wheeler_reg, name, email, phone, address]);
        res.status(201).send({ message: 'User details saved' });
    } catch (error) {
        console.error('Error inserting user details:', error);
        res.status(500).send({ error: 'Error inserting user details' });
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
        const [results] = await db.execute(query, [id]);
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.status(404).send({ error: 'No details found for the given ID' });
        }
    } catch (error) {
        console.error('Error retrieving details:', error);
        res.status(500).send({ error: 'Error retrieving details' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
