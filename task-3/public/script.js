
const form = document.getElementById('registrationForm');

if (form) {
    form.addEventListener('submit', function (event) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');

        nameError.textContent = '';
        emailError.textContent = '';

        let valid = true;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            nameError.textContent = 'Name is required.';
            valid = false;
        }

        if (!email) {
            emailError.textContent = 'Email is required.';
            valid = false;
        } else if (!emailPattern.test(email)) {
            emailError.textContent = 'Enter a valid email address.';
            valid = false;
        }

        if (!valid) {
            event.preventDefault();
        }
    });
}
