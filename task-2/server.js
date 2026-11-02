
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {
        error: '',
        formData: { name: '', email: '' }
    });
});

app.post('/register', (req, res) => {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email) {
        return res.status(400).render('index', {
            error: 'Please fill in all fields.',
            formData: { name, email }
        });
    }

    if (!emailPattern.test(email)) {
        return res.status(400).render('index', {
            error: 'Please enter a valid email address.',
            formData: { name, email }
        });
    }

    res.render('success', { name, email });
});

app.listen(PORT, () => {
    console.log(`Task 2 server running at http://localhost:${PORT}`);
});
