const API_URL = window.location.origin + '/api';

const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validación básica
    if (!usuario || !contrasena || !confirmPassword) {
        showError('Por favor completa todos los campos');
        return;
    }

    if (usuario.length < 3) {
        showError('El usuario debe tener al menos 3 caracteres');
        return;
    }

    if (contrasena.length < 4) {
        showError('La contraseña debe tener al menos 4 caracteres');
        return;
    }

    if (contrasena !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, contrasena })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess('Cuenta creada exitosamente. Redirigiendo...');
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = '../inicio/index.html';
            }, 2000);
        } else {
            showError(data.error || 'Error al crear la cuenta');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error al conectar con el servidor');
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    successMessage.classList.remove('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add('show');
    errorMessage.classList.remove('show');
}
