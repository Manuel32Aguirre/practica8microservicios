const API_BASE_URL = 'https://YOUR_AZURE_FUNCTION_URL.azurewebsites.net/api';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validación básica
    if (!username || !password) {
        showError('Por favor completa todos los campos');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar información del usuario
            localStorage.setItem('usuario', username);
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
