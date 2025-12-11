const API_BASE_URL = 'https://YOUR_AZURE_FUNCTION_URL.azurewebsites.net/api';

const currentUser = localStorage.getItem('usuario');

window.addEventListener('DOMContentLoaded', () => {
    loadRankings();
});

async function loadRankings() {
    try {
        const response = await fetch(`${API_BASE_URL}/clasificaciones`);
        
        if (!response.ok) {
            throw new Error('Error al cargar clasificaciones');
        }

        const data = await response.json();
        
        document.getElementById('loadingContainer').style.display = 'none';

        if (data.length === 0) {
            document.getElementById('noDataContainer').style.display = 'block';
            return;
        }

        displayRankings(data);
        document.getElementById('rankingsTable').style.display = 'table';

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingContainer').style.display = 'none';
        showError('No se pudieron cargar las clasificaciones. Verifica que el servidor esté funcionando.');
    }
}

function displayRankings(rankings) {
    const tbody = document.getElementById('rankingsBody');
    tbody.innerHTML = '';

    rankings.forEach((player, index) => {
        const row = document.createElement('tr');
        const position = index + 1;
        
        // Marcar si es el usuario actual
        if (player.usuario === currentUser) {
            row.classList.add('current-user');
        }

        // Celda de posición con medalla
        const rankCell = document.createElement('td');
        rankCell.className = 'rank-cell';
        let rankClass = 'rank-other';
        let medal = '';
        
        if (position === 1) {
            rankClass = 'rank-1';
            medal = '<span class="medal">🥇</span>';
        } else if (position === 2) {
            rankClass = 'rank-2';
            medal = '<span class="medal">🥈</span>';
        } else if (position === 3) {
            rankClass = 'rank-3';
            medal = '<span class="medal">🥉</span>';
        }
        
        rankCell.className = `rank-cell ${rankClass}`;
        rankCell.innerHTML = `${medal}${position}`;
        row.appendChild(rankCell);

        // Celda de usuario
        const usernameCell = document.createElement('td');
        usernameCell.className = 'username-cell';
        usernameCell.textContent = player.usuario;
        if (player.usuario === currentUser) {
            usernameCell.textContent += ' (Tú)';
        }
        row.appendChild(usernameCell);

        // Celda de puntuación
        const scoreCell = document.createElement('td');
        scoreCell.className = 'score-cell';
        scoreCell.textContent = player.puntuacion;
        row.appendChild(scoreCell);

        tbody.appendChild(row);
    });
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
}
