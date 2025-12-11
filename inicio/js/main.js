const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validación básica
    if (!username || !password) {
        showError('Por favor completa todos los campos');
        return;
    }

    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Buscar usuario
    const user = users.find(u => u.usuario === username && u.contrasena === password);

    if (user) {
        // Guardar información del usuario
        localStorage.setItem('usuario', username);
        localStorage.setItem('userId', user.id);
        
        // Redirigir al menú principal
        window.location.href = '../menu/index.html';
    } else {
        showError('Usuario o contraseña incorrectos');
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}
