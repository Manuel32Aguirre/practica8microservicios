const API_URL = window.location.origin + '/api';

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

async function loadUserScore(userId) {
    try {
        const response = await fetch(`${API_URL}/usuario/${userId}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('bestScore').textContent = data.puntuacion || 0;
        }
    } catch (error) {
        console.error('Error al cargar puntuación:', error);
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
