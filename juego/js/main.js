const API_URL = window.location.origin + '/api';

// Variables del juego
let username = '';
let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let canPlay = false;
let isShowingSequence = false;

// Tabla de líderes inicial (CPU)
let leaderboard = [
    { player: 'CPU-Master', score: 50 },
    { player: 'CPU-Pro', score: 35 },
    { player: 'CPU-Novato', score: 20 },
    { player: 'CPU-Inicial', score: 10 }
];

// Frecuencias musicales para cada botón
const frequencies = [
    261.63, // C (Do)
    293.66, // D (Re)
    329.63, // E (Mi)
    349.23, // F (Fa)
    392.00, // G (Sol)
    440.00, // A (La)
    493.88, // B (Si)
    523.25  // C (Do octava alta)
];

// Web Audio API
let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(index, duration = 400) {
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencies[index];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playErrorSound() {
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 100;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Verificar sesión al cargar
window.addEventListener('DOMContentLoaded', () => {
    username = localStorage.getItem('usuario');
    const userId = localStorage.getItem('userId');
    
    if (!username || !userId) {
        // Si no hay sesión, redirigir al login
        window.location.href = '../inicio/index.html';
        return;
    }
    
    // Cargar puntuación actual del usuario
    loadUserScore(userId);
    
    // Iniciar el juego automáticamente
    startGame();
});

async function loadUserScore(userId) {
    try {
        const response = await fetch(`${API_URL}/usuario/${userId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.puntuacion) {
                leaderboard.push({ player: username, score: data.puntuacion });
            }
        }
    } catch (error) {
        console.error('Error al cargar puntuación:', error);
    }
}

// Función para iniciar el juego
function startGame() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    
    // Inicializar juego
    resetGame();
    setTimeout(() => nextRound(), 1000);
}

// Resetear variables del juego
function resetGame() {
    sequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    canPlay = false;
    updateDisplay();
}

// Actualizar display
function updateDisplay() {
    document.getElementById('level').textContent = level;
    document.getElementById('score').textContent = score;
}

// Siguiente ronda
function nextRound() {
    playerSequence = [];
    canPlay = false;
    
    // Agregar nuevo elemento a la secuencia
    const validIndices = [0, 1, 2, 3, 5, 6, 7, 8]; // Excluye el 4 (centro)
    const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
    sequence.push(randomIndex);
    
    document.getElementById('game-message').textContent = 'Observa la secuencia...';
    
    // Mostrar secuencia
    setTimeout(() => showSequence(), 500);
}

// Mostrar secuencia
async function showSequence() {
    isShowingSequence = true;
    canPlay = false;
    
    try {
        const buttons = document.querySelectorAll('.game-button');
        
        for (let i = 0; i < sequence.length; i++) {
            const index = sequence[i];
            await highlightButton(buttons[index], index);
            await sleep(200);
        }
    } catch (error) {
        console.error('Error mostrando secuencia:', error);
    } finally {
        // Asegurarse de que siempre se libere el bloqueo
        isShowingSequence = false;
        canPlay = true;
        document.getElementById('game-message').textContent = 'Tu turno - Repite la secuencia';
    }
}

// Iluminar botón
function highlightButton(button, dataIndex) {
    return new Promise((resolve) => {
        button.classList.add('active');
        playTone(dataIndex);
        
        setTimeout(() => {
            button.classList.remove('active');
            resolve();
        }, 400);
    });
}

// Sleep helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Manejar clic en botón del juego
document.getElementById('game-grid').addEventListener('click', async (e) => {
    // Validar que se puede jugar
    if (!canPlay || isShowingSequence) {
        console.log('No se puede jugar aún:', { canPlay, isShowingSequence });
        return;
    }
    
    const button = e.target.closest('.game-button');
    if (!button || button.dataset.index === '4') return;
    
    const index = parseInt(button.dataset.index);
    
    // Deshabilitar temporalmente para evitar clicks múltiples
    canPlay = false;
    
    // Iluminar botón clickeado
    button.classList.add('active');
    playTone(index);
    setTimeout(() => button.classList.remove('active'), 400);
    
    // Agregar a secuencia del jugador
    playerSequence.push(index);
    
    // Verificar si es correcto
    const currentStep = playerSequence.length - 1;
    
    if (playerSequence[currentStep] !== sequence[currentStep]) {
        // Error
        gameOver();
        return;
    }
    
    // Si completó la secuencia correctamente
    if (playerSequence.length === sequence.length) {
        score += level * 10;
        level++;
        updateDisplay();
        
        document.getElementById('game-message').textContent = '¡Correcto! - Siguiente nivel...';
        
        setTimeout(() => nextRound(), 1500);
    } else {
        // Habilitar de nuevo para el siguiente click
        canPlay = true;
    }
});

// Game Over
async function gameOver() {
    canPlay = false;
    playErrorSound();
    
    document.getElementById('game-message').textContent = 'Error - Fin del juego';
    
    // Guardar puntuación en el servidor
    await saveScore();
    
    setTimeout(() => {
        document.getElementById('game-section').style.display = 'none';
        showResults();
    }, 1500);
}

async function saveScore() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
        const response = await fetch(`${API_URL}/actualizar-puntuacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: parseInt(userId),
                puntuacion: score
            })
        });

        if (!response.ok) {
            console.error('Error al guardar puntuación');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Mostrar resultados
function showResults() {
    document.getElementById('final-score').textContent = score;
    
    // Agregar puntuación del jugador a la tabla
    leaderboard.push({ player: username, score: score, isPlayer: true });
    
    // Ordenar por puntuación
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Generar tabla
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';
    
    const topScores = leaderboard.slice(0, 10);
    const isNewRecord = topScores[0].isPlayer && topScores[0].score === score;
    
    topScores.forEach((entry, index) => {
        const row = document.createElement('tr');
        if (entry.isPlayer && entry.score === score) {
            row.classList.add('player-score');
            if (isNewRecord) {
                row.classList.add('new-record');
            }
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.player}${entry.isPlayer ? ' (Tú)' : ''}</td>
            <td>${entry.score}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('results-section').style.display = 'block';
}

// Reiniciar juego
function restartGame() {
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    
    resetGame();
    setTimeout(() => nextRound(), 1000);
}

// Volver al menú principal
function goToMenu() {
    window.location.href = '../menu/index.html';
}
