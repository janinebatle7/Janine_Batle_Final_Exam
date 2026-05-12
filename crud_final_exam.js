require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle form submissions
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection Logic using a single URL (Best for Render + Aiven)
const db = mysql.createPool(process.env.DATABASE_URL || "");

// Test the connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
    } else {
        console.log('Connected to Aiven MySQL successfully.');
        connection.release();
    }
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

// 2. CREATE: Show registration form
app.get('/add', (req, res) => {
    res.render('add');
});

// Handle registration submission
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

// 3. UPDATE: Show the edit form with existing data
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

// Handle the update
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
