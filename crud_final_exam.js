<<<<<<< HEAD
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

// Initialize dotenv to load variables from .env file
dotenv.config();

const app = express();

// Middleware to handle form submissions
app.use(express.urlencoded({ extended: false }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection Logic
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 12590, // Default Aiven MySQL port
    ssl: {
        // Change to false to avoid local CA certificate errors
        rejectUnauthorized: false 
    }
});

// Connect to the Database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to Aiven MySQL successfully.');
});

// --- ROUTES ---

// 1. READ: Display all student records
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving students');
        }
        res.render('index', { students: results });
    });
});

// 2. CREATE: Show registration form and handle submission
app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { student_id, full_name, course, year_level, email_address } = req.body;
    const sql = 'INSERT INTO students (student_id, full_name, course, year_level, email_address) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [student_id, full_name, course, year_level, email_address], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving student');
        }
        res.redirect('/');
    });
});

// 3. UPDATE: Show the edit form with existing data and handle the update
app.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching student');
        }
        res.render('edit', { student: result[0] });
    });
});

app.post('/update/:id', (req, res) => {
    const { student_id, full_name, course, year_level, email_address } = req.body;
    const sql = 'UPDATE students SET student_id=?, full_name=?, course=?, year_level=?, email_address=? WHERE id=?';
    
    db.query(sql, [student_id, full_name, course, year_level, email_address, req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating student');
        }
        res.redirect('/');
    });
});

// 4. DELETE: Remove student record from database
app.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting student');
        }
        res.redirect('/');
    });
});

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
=======
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

// Initialize dotenv to load variables from .env file
dotenv.config();

const app = express();

// Middleware to handle form submissions
app.use(express.urlencoded({ extended: false }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection Logic
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 16573, // Default Aiven MySQL port
    ssl: {
        // Change to false to avoid local CA certificate errors
        rejectUnauthorized: false 
    }
});

// Connect to the Database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to Aiven MySQL successfully.');
});

// --- ROUTES ---

// 1. READ: Display all student records
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving students');
        }
        res.render('index', { students: results });
    });
});

// 2. CREATE: Show registration form and handle submission
app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { student_id, full_name, course, year_level, email_address } = req.body;
    const sql = 'INSERT INTO students (student_id, full_name, course, year_level, email_address) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [student_id, full_name, course, year_level, email_address], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving student');
        }
        res.redirect('/');
    });
});

// 3. UPDATE: Show the edit form with existing data and handle the update
app.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching student');
        }
        res.render('edit', { student: result[0] });
    });
});

app.post('/update/:id', (req, res) => {
    const { student_id, full_name, course, year_level, email_address } = req.body;
    const sql = 'UPDATE students SET student_id=?, full_name=?, course=?, year_level=?, email_address=? WHERE id=?';
    
    db.query(sql, [student_id, full_name, course, year_level, email_address, req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating student');
        }
        res.redirect('/');
    });
});

// 4. DELETE: Remove student record from database
app.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting student');
        }
        res.redirect('/');
    });
});

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
>>>>>>> 35d8e04cff5270df38c2f709bcb30b38a99001dd
});
