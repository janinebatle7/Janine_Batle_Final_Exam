require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection using Environment Variable from Render/Aiven
// Use createPool for better stability in a cloud environment
const db = mysql.createPool(process.env.DATABASE_URL);

// Test Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed: " + err.message);
    } else {
        console.log("Connected to Aiven MySQL Cloud Database.");
        connection.release();
    }
});

// --- CRUD Routes ---

// 1. READ: Display all students on the homepage
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching students");
        }
        res.render('index', { students: results });
    });
});

// 2. CREATE: Show the registration form
app.get('/add', (req, res) => {
    res.render('add');
});

// 3. CREATE: Handle form submission
app.post('/add', (req, res) => {
    const { student_id, full_name, course, year_level, email } = req.body;
    const sql = 'INSERT INTO students (student_id, full_name, course, year_level, email) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [student_id, full_name, course, year_level, email], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error saving student");
        }
        res.redirect('/');
    });
});

// 4. UPDATE: Show the edit form with existing data
app.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching student details");
        }
        res.render('edit', { student: result[0] });
    });
});

// 5. UPDATE: Handle the update request
app.post('/update/:id', (req, res) => {
    const { student_id, full_name, course, year_level, email } = req.body;
    const sql = 'UPDATE students SET student_id=?, full_name=?, course=?, year_level=?, email=? WHERE id=?';
    
    db.query(sql, [student_id, full_name, course, year_level, email, req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error updating student");
        }
        res.redirect('/');
    });
});

// 6. DELETE: Remove a student record
app.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting student");
        }
        res.redirect('/');
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
