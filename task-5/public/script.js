const API_URL = '/api/students';

// HTML elements
const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const studentId = document.getElementById('studentId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const totalStudents = document.getElementById('totalStudents');
const statusMessage = document.getElementById('status');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('search');

let students = [];

// Display notification
function showStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? '#dc2626' : '#16a34a';
}

// Fetch all students
async function loadStudents() {
    try {
        studentList.innerHTML =
            '<tr><td colspan="4">Loading records...</td></tr>';

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Unable to load student records.');
        }

        students = await response.json();

        totalStudents.textContent = students.length;

        displayStudents(students);

    } catch (error) {
        showStatus(error.message, true);
        studentList.innerHTML =
            '<tr><td colspan="4">Failed to load records.</td></tr>';
    }
}

// Display student records
function displayStudents(data) {
    studentList.innerHTML = '';

    if (data.length === 0) {
        studentList.innerHTML =
            '<tr><td colspan="4">No students found.</td></tr>';
        return;
    }

    data.forEach(student => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = student.id;

        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;

        const emailCell = document.createElement('td');
        emailCell.textContent = student.email;

        const actionCell = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.onclick = () => editStudent(student);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => deleteStudent(student.id);

        actionCell.append(editButton, deleteButton);

        row.append(idCell, nameCell, emailCell, actionCell);
        studentList.appendChild(row);
    });
}

// Add or update student
studentForm.addEventListener('submit', async event => {
    event.preventDefault();

    const id = studentId.value;

    const student = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim()
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        submitBtn.disabled = true;

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Operation failed.');
        }

        showStatus(result.message);

        studentForm.reset();
        resetForm();

        await loadStudents();

    } catch (error) {
        showStatus(error.message, true);

    } finally {
        submitBtn.disabled = false;
    }
});

// Edit student
function editStudent(student) {
    studentId.value = student.id;
    nameInput.value = student.name;
    emailInput.value = student.email;

    formTitle.textContent = 'Update Student';
    submitBtn.textContent = 'Update Student';
    cancelBtn.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Delete student
async function deleteStudent(id) {
    const confirmDelete = confirm(
        'Are you sure you want to delete this student?'
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Delete failed.');
        }

        showStatus(result.message);
        await loadStudents();

    } catch (error) {
        showStatus(error.message, true);
    }
}

// Reset form
function resetForm() {
    studentId.value = '';
    formTitle.textContent = 'Add New Student';
    submitBtn.textContent = 'Add Student';
    cancelBtn.hidden = true;
}

// Cancel editing
cancelBtn.addEventListener('click', () => {
    studentForm.reset();
    resetForm();
    showStatus('');
});

// Refresh records
refreshBtn.addEventListener('click', loadStudents);

// Search students
searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchValue) ||
        student.email.toLowerCase().includes(searchValue)
    );

    displayStudents(filteredStudents);
});

// Load records when page opens
loadStudents();