
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3004;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {
        errors: {},
        formData: { name: '', email: '' }
    });
});

app.post('/register', (req, res) => {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim();
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || '';

    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 3) {
        errors.name = 'Name must contain at least 3 characters.';
    }

    if (!emailPattern.test(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (password.length < 8) {
        errors.password = 'Password must contain at least 8 characters.';
    }

    if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).render('index', {
            errors,
            formData: { name, email }
        });
    }

    res.render('success', { name, email });
});

app.listen(PORT, () => {
    console.log(`Task 4 running at http://localhost:${PORT}`);
});
