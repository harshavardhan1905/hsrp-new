const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// MySQL Database Connection (Async)
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const connectToDb = () => {
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(dbConfig);

        db.connect((err) => {
            if (err) {
                reject('Database connection failed: ' + err.message);
            } else {
                resolve(db);
                console.log('Connected to MySQL database');
            }
        });
    });
};

// Use async/await to handle the connection
const startServer = async () => {
    try {
        const db = await connectToDb();  // Wait for DB connection
        app.set('db', db);  // Save db connection in app object if needed

        // Serve HTML Pages
        app.get('https://hsrp-harshavardhan1905s-projects.vercel.app/', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
        });

        app.get('https://hsrp-harshavardhan1905s-projects.vercel.app/forms/user-form.html', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'public', 'user-form.html'));
        });

        app.get('https://hsrp-harshavardhan1905s-projects.vercel.app/forms/booking-form.html', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'public', 'booking-form.html'));
        });

        app.get('https://hsrp-harshavardhan1905s-projects.vercel.app/forms/payment-form.html', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'public', 'payment-form.html'));
        });

        app.get('https://hsrp-harshavardhan1905s-projects.vercel.app/forms/entered-form.html', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'public', 'entered-form.html'));
        });

        // API Routes

        // Add Booking Details
        app.post('https://hsrp-harshavardhan1905s-projects.vercel.app/api/booking-details', async (req, res) => {
            const { state, wheeler_reg_no, chassis_no, engine_no } = req.body;
            console.log({ state, wheeler_reg_no, chassis_no, engine_no });

            const query = `INSERT INTO bookings (state, wheeler_reg_no, chassis_no, engine_no) VALUES (?, ?, ?, ?)`;
            db.query(query, [state, wheeler_reg_no, chassis_no, engine_no], (err, result) => {
                if (err) {
                    res.status(500).send({ error: 'Error inserting booking details' });
                    console.error(err);
                    return;
                }
                // console.log('Booking ID inserted:', result.insertId);
                res.send({ message: 'Booking details saved' });
            });
        });

        // Add User Details
        app.post('https://hsrp-harshavardhan1905s-projects.vercel.app/api/user-details', async (req, res) => {
            const { wheeler_reg, name, email, phone, address } = req.body;
            console.log({ wheeler_reg, name, email, phone, address });

            const query = `INSERT INTO users (wheeler_reg, name, email, phone, address) VALUES (?, ?, ?, ?, ?)`;
            db.query(query, [wheeler_reg, name, email, phone, address], (err) => {
                if (err) {
                    res.status(500).send({ error: 'Error inserting user details' });
                    console.error(err);
                    return;
                }
                res.send({ message: 'User details saved' });
            });
        });

        // Get Details by Booking ID
        app.get('https://hsrp-harshavardhan1905s-projects.vercel.app/api/details/:id', async (req, res) => {
            const { id } = req.params;
            console.log(id);
            

            const query = `
                SELECT b.state, b.wheeler_reg_no, b.chassis_no, b.engine_no, u.name, u.email, u.phone, u.address
                FROM bookings b
                LEFT JOIN users u ON b.wheeler_reg_no= u.wheeler_reg
                WHERE b.wheeler_reg_no = ?
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
            console.log(`Server running on https://hsrp-harshavardhan1905s-projects.vercel.app`);
        });

    } catch (err) {
        console.error('Error starting the server:', err);
    }
};

// Start the server
startServer();
