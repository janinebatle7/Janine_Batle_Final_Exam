require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Database Connection using Environment Variable
const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect(err => {
    if (err) console.error("Database connection failed: " + err.stack);
    else console.log("Connected to Aiven MySQL.");
});

// CRUD Routes
app.get('/', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        res.render('index', { students: results });
    });
});

app.get('/add', (req, res) => res.render('add'));

app.post('/add', (req, res) => {
    const { student_id, full_name, course, year_level, email } = req.body;
    db.query('INSERT INTO students SET ?', { student_id, full_name, course, year_level, email }, () => {
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    db.query('SELECT * FROM students WHERE id = ?', [req.params.id], (err, result) => {
        res.render('edit', { student: result[0] });
    });
});

app.post('/update/:id', (req, res) => {
    db.query('UPDATE students SET ? WHERE id = ?', [req.body, req.params.id], () => {
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    db.query('DELETE FROM students WHERE id = ?', [req.params.id], () => {
        res.redirect('/');
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
