
const form = document.getElementById('registrationForm');

if (form) {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateName() {
        const error = document.getElementById('nameError');
        error.textContent = name.value.trim().length < 3
            ? 'Name must contain at least 3 characters.'
            : '';
        return error.textContent === '';
    }

    function validateEmail() {
        const error = document.getElementById('emailError');
        error.textContent = !emailPattern.test(email.value.trim())
            ? 'Please enter a valid email address.'
            : '';
        return error.textContent === '';
    }

    function validatePassword() {
        const error = document.getElementById('passwordError');
        const hint = document.getElementById('passwordHint');

        error.textContent = password.value.length < 8
            ? 'Password must contain at least 8 characters.'
            : '';

        hint.textContent = password.value.length >= 8
            ? 'Password length looks good.'
            : 'Use at least 8 characters.';

        return error.textContent === '';
    }

    function validateConfirmPassword() {
        const error = document.getElementById('confirmPasswordError');

        error.textContent = confirmPassword.value !== password.value
            ? 'Passwords do not match.'
            : '';

        if (!confirmPassword.value) {
            error.textContent = 'Please confirm your password.';
        }

        return error.textContent === '';
    }

    name.addEventListener('input', validateName);
    email.addEventListener('input', validateEmail);
    password.addEventListener('input', () => {
        validatePassword();
        if (confirmPassword.value) validateConfirmPassword();
    });
    confirmPassword.addEventListener('input', validateConfirmPassword);

    form.addEventListener('submit', function (event) {
        const valid = [
            validateName(),
            validateEmail(),
            validatePassword(),
            validateConfirmPassword()
        ].every(Boolean);

        if (!valid) {
            event.preventDefault();
        }
    });
}
