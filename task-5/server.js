const express = require('express');
const path = require('path');

const app = express();
const PORT = 3005;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sample student data
let students = [
    {
        id: 1,
        name: 'Srikanth',
        email: 'srikanth@example.com'
    },
    {
        id: 2,
        name: 'Rahul',
        email: 'rahul@example.com'
    }
];

let nextId = 3;

// Validate student details
function validateStudent(name, email) {
    return (
        typeof name === 'string' &&
        name.trim().length > 0 &&
        typeof email === 'string' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    );
}

// Home route - Display frontend dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET - Retrieve all students
app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});

// GET - Retrieve student by ID
app.get('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid student ID.'
        });
    }

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            error: 'Student not found.'
        });
    }

    res.status(200).json(student);
});

// POST - Create a new student
app.post('/api/students', (req, res) => {
    const { name, email } = req.body || {};

    if (!validateStudent(name, email)) {
        return res.status(400).json({
            error: 'Provide a valid name and email address.'
        });
    }

    const student = {
        id: nextId++,
        name: name.trim(),
        email: email.trim()
    };

    students.push(student);

    res.status(201).json({
        message: 'Student created successfully.',
        student
    });
});

// PUT - Update student details
app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid student ID.'
        });
    }

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            error: 'Student not found.'
        });
    }

    const { name, email } = req.body || {};

    if (!validateStudent(name, email)) {
        return res.status(400).json({
            error: 'Provide a valid name and email address.'
        });
    }

    student.name = name.trim();
    student.email = email.trim();

    res.status(200).json({
        message: 'Student updated successfully.',
        student
    });
});

// DELETE - Remove student
app.delete('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Invalid student ID.'
        });
    }

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: 'Student not found.'
        });
    }

    const deletedStudent = students.splice(index, 1)[0];

    res.status(200).json({
        message: 'Student deleted successfully.',
        student: deletedStudent
    });
});

// Handle unknown API routes
app.use('/api', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found.'
    });
});

// Handle invalid JSON and server errors
app.use((err, req, res, next) => {
    console.error(err.message);

    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            error: 'Invalid JSON request body.'
        });
    }

    res.status(500).json({
        error: 'Internal server error.'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Task 5 API running at http://localhost:${PORT}`);
});