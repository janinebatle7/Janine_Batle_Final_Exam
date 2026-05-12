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

// --- Database Connection Logic ---
const dbUrl = process.env.DATABASE_URL;

// Validation: If URL is missing or has placeholder text, stop the app immediately
if (!dbUrl || dbUrl.includes("CLICK_TO_REVEAL_PASSWORD") || dbUrl === "") {
    console.error("**************************************************");
    console.error("FATAL ERROR: DATABASE_URL is invalid or missing!");
    console.error("Make sure you revealed the password in Aiven before copying.");
    console.error("**************************************************");
    process.exit(1); 
}

// Initialize the Pool
const db = mysql.createPool(dbUrl); 

// Test Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed: " + err.message);
    } else {
        console.log("SUCCESS: Connected to Aiven MySQL Cloud Database.");
        connection.release();
    }
});

// --- CRUD Routes ---

app.get('/', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).send("Error fetching students");
        res.render('index', { students: results || [] });
    });
});

app.get('/add', (req, res) => res.render('add'));

app.post('/add', (req, res) => {
    const { student_id, full_name, course, year_level, email } = req.body;
    const sql = 'INSERT INTO students (student_id, full_name, course, year_level, email) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [student_id, full_name, course, year_level, email], (err) => {
        if (err) return res.status(500).send("Error saving student");
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    db.query('SELECT * FROM students WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).send("Error fetching student");
        res.render('edit', { student: result[0] });
    });
});

app.post('/update/:id', (req, res) => {
    const { student_id, full_name, course, year_level, email } = req.body;
    const sql = 'UPDATE students SET student_id=?, full_name=?, course=?, year_level=?, email=? WHERE id=?';
    db.query(sql, [student_id, full_name, course, year_level, email, req.params.id], (err) => {
        if (err) return res.status(500).send("Error updating student");
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    db.query('DELETE FROM students WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send("Error deleting student");
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
