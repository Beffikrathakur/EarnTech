/* ==========================================================================
   EarnTech Backend Server Architecture - Node.js + Express + SQLite3
   ========================================================================== */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 1. Enable Middleware components to process network incoming streams
app.use(cors()); // Prevents blocks from cross-origin front-end hits
app.use(express.json()); // Parses automatic JSON body payloads
app.use(express.urlencoded({ extended: true }));

// 2. Initialize and open connection to SQLite Relational database file path
const dbPath = path.join(__dirname, '../database/earntech.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Successfully connected to SQLite database layer.');
        // Establish the user data persistence table layout if not existing yet
        db.run(`CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            city TEXT,
            profession TEXT,
            message TEXT,
            service TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// 3. Setup POST submission processing network route endpoint
app.post('/submit', (req, requireVal) => {
    // Distribute local request payloads mapping variables explicitly
    const { name, email, phone, city, profession, message, service } = req.body;

    const query = `INSERT INTO clients (name, email, phone, city, profession, message, service) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
                   
    const params = [name, email, phone, city, profession, message, service];

    db.run(query, params, function(err) {
        if (err) {
            console.error('Data recording error:', err.message);
            return requireVal.status(500).json({ error: 'Failed to write dataset entry.' });
        }
        console.log(`Row successfully committed to data table with record identity: ${this.lastID}`);
        return requireVal.status(200).json({ status: 'Data successfully recorded.' });
    });
});

// 4. Start listening for server connections
app.listen(PORT, () => {
    console.log(`EarnTech active platform server operating securely on http://localhost:${PORT}`);
});
