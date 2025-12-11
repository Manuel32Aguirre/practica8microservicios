-- ============================================
-- Base de Datos: Simon Dice
-- Descripción: Schema para el juego de memoria
-- ============================================

-- Eliminar tabla si existe (para desarrollo)
DROP TABLE IF EXISTS usuarios;

-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    puntuacion INT DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_puntuacion (puntuacion DESC),
    INDEX idx_usuario (usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentarios de las columnas
ALTER TABLE usuarios 
    MODIFY COLUMN id INT AUTO_INCREMENT COMMENT 'ID único autoincremental del usuario',
    MODIFY COLUMN usuario VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre de usuario único',
    MODIFY COLUMN contrasena VARCHAR(255) NOT NULL COMMENT 'Contraseña hasheada del usuario',
    MODIFY COLUMN puntuacion INT DEFAULT 0 COMMENT 'Mejor puntuación del usuario',
    MODIFY COLUMN fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro del usuario',
    MODIFY COLUMN fecha_ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última vez que se actualizó el registro';

-- Insertar datos de ejemplo (CPU players)
INSERT INTO usuarios (usuario, contrasena, puntuacion) VALUES
('CPU-Master', '$2a$10$ejemplo.hash.contraseña.1', 50),
('CPU-Pro', '$2a$10$ejemplo.hash.contraseña.2', 35),
('CPU-Novato', '$2a$10$ejemplo.hash.contraseña.3', 20),
('CPU-Inicial', '$2a$10$ejemplo.hash.contraseña.4', 10);

-- ============================================
-- Consultas útiles de ejemplo
-- ============================================

-- Obtener clasificaciones (top 10)
-- SELECT id, usuario, puntuacion 
-- FROM usuarios 
-- ORDER BY puntuacion DESC 
-- LIMIT 10;

-- Obtener datos de un usuario específico
-- SELECT id, usuario, puntuacion, fecha_registro 
-- FROM usuarios 
-- WHERE id = ?;

-- Actualizar puntuación de usuario (solo si es mayor)
-- UPDATE usuarios 
-- SET puntuacion = ? 
-- WHERE id = ? AND puntuacion < ?;

-- Verificar si existe un usuario
-- SELECT COUNT(*) as existe 
-- FROM usuarios 
-- WHERE usuario = ?;


