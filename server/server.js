const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@libsql/client');

const app = express();
const PORT = 5000;

const db = createClient({
    url: "libsql://hsrpbooking-hsrp.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzU0NDk3MjIsImlkIjoiYjc5YTE5ZDgtZGY2Yy00MjMzLWI1NTctOTkzNDNhZDE4ZTIyIn0.J2rSHYn_a4cMLq5ZOvybxY1quIGqgrv2WN7EZO3Esi-kCBKH1uvFPWUWScQQdUVn6Sg7bGObM3Us1Noo8g4cDQ"
});

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve HTML Pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/user-form.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'user-form.html'));
});

app.get('/booking-form.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'booking-form.html'));
});

app.get('/payment-form.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'payment-form.html'));
});

app.get('/entered-form.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'entered-form.html'));
});

// API Routes

// Add Booking Details
app.post('/api/booking-details', (req, res) => {
    const { state, wheeler_reg_no, chassis_no, engine_no } = req.body;
    const query = `
        INSERT INTO bookings (state, wheeler_reg_no, chassis_no, engine_no)
        VALUES (?, ?, ?, ?)
    `;
    db.execute(query, [state, wheeler_reg_no, chassis_no, engine_no])
        .then(() => {
            res.send({ message: 'Booking details saved' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send({ error: 'Error inserting booking details' });
        });
});


// Add User Details
app.post('/api/user-details', (req, res) => {
    const { wheeler_reg, name, email, phone, address } = req.body;
    const query = `
        INSERT INTO users (wheeler_reg, name, email, phone, address)
        VALUES (?, ?, ?, ?, ?) ;
    `;
    db.execute(query, [wheeler_reg, name, email, phone, address])
        .then(() => {
            res.send({ message: 'User details saved' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send({ error: 'Error inserting user details' });
        });
});

// Get Details by Booking ID
app.get('/api/details/:id', (req, res) => {
    
    const { id } = req.params;
    const query = `
        SELECT b.state, b.wheeler_reg_no, b.chassis_no, b.engine_no, u.name, u.email, u.phone, u.address
        FROM bookings b
        LEFT JOIN users u ON b.wheeler_reg_no = u.wheeler_reg
        WHERE b.wheeler_reg_no = ? ;
    `;
    db.execute(query, [id])
        .then((results) => {
            if (results.rows.length > 0) {
                res.send(results.rows[0]);
            } else {
                res.status(404).send({ error: 'No details found for the given ID' });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send({ error: 'Error retrieving details' });
        });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

