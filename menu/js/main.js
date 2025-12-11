// Verificar si hay sesión activa
window.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem('usuario');
    const userId = localStorage.getItem('userId');

    if (!usuario || !userId) {
        // Si no hay sesión, redirigir al login
        window.location.href = '../inicio/index.html';
        return;
    }

    // Mostrar nombre de usuario
    document.getElementById('username').textContent = usuario;

    // Cargar puntuación del usuario
    loadUserScore(userId);
});

function loadUserScore(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id == userId);
    
    if (user) {
        document.getElementById('bestScore').textContent = user.puntuacion || 0;
    }
}

function goToGame() {
    window.location.href = '../juego/index.html';
}

function goToRankings() {
    window.location.href = '../clasificaciones/index.html';
}

function logout() {
    // Limpiar sesión
    localStorage.removeItem('usuario');
    localStorage.removeItem('userId');
    
    // Redirigir al login
    window.location.href = '../inicio/index.html';
}
