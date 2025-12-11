const API_URL = 'http://localhost:8080/api';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;

    // Validación básica
    if (!usuario || !contrasena) {
        showError('Por favor completa todos los campos');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, contrasena })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar información del usuario
            localStorage.setItem('usuario', data.usuario);
            localStorage.setItem('userId', data.userId);
            
            // Redirigir al menú principal
            window.location.href = '../menu/index.html';
        } else {
            showError(data.error || 'Usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error al conectar con el servidor');
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}
