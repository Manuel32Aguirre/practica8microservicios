# Simón Dice - Juego Web

Aplicación web del clásico juego "Simón Dice" con sistema de registro, autenticación y clasificaciones.

## Estructura del Proyecto

```
Practica8Microservicios/
├── inicio/                 # Página de inicio de sesión
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── index.html
├── registro/              # Página de registro
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── index.html
├── menu/                  # Menú principal
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── index.html
├── clasificaciones/       # Tabla de clasificaciones
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── index.html
├── juego/                 # Juego principal
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── index.html
└── database/              # Base de datos (schema de referencia)
    └── schema.sql
```

## 🎮 Características

- Sistema de registro e inicio de sesión con bcrypt
- Juego Simón Dice interactivo con sonidos
- Tabla de clasificaciones global
- Puntuación guardada automáticamente
- Backend Python + Flask + MySQL

## 📋 Prerrequisitos

- Python 3.8+
- MySQL 8.0+
- pip (gestor de paquetes de Python)

## 🚀 Instalación

### 1. Base de Datos

Crear la base de datos ejecutando el script SQL:

```bash
mysql -u root -p < database/schema.sql
```

O manualmente en MySQL:

```sql
CREATE DATABASE simon_dice;
USE simon_dice;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    puntuacion INT DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. API Backend

Instalar dependencias de Python:

```bash
cd api
pip install -r requirements.txt
```

Configurar variables de entorno (crear archivo `.env`):

```bash
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=3306
DB_NAME=simon_dice
```

Ejecutar el servidor Flask:

```bash
python main.py
```

El servidor estará disponible en `http://localhost:5000`

## 🔌 API Endpoints

### POST /api/register
Registrar nuevo usuario.

**Body:**
```json
{
  "usuario": "string",
  "contrasena": "string"
}
```

**Response:** `201 Created`
```json
{
  "message": "Usuario registrado exitosamente",
  "userId": 1,
  "usuario": "string"
}
```

### POST /api/login
Iniciar sesión.

**Body:**
```json
{
  "usuario": "string",
  "contrasena": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login exitoso",
  "userId": 1,
  "usuario": "string"
}
```

### GET /api/usuario/{id}
Obtener información de un usuario.

**Response:** `200 OK`
```json
{
  "id": 1,
  "usuario": "string",
  "puntuacion": 100,
  "fecha_registro": "2024-01-01T00:00:00",
  "fecha_ultima_actualizacion": "2024-01-02T00:00:00"
}
```

### GET /api/clasificaciones
Obtener top 10 jugadores.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "usuario": "string",
    "puntuacion": 100,
    "fecha_ultima_actualizacion": "2024-01-02T00:00:00"
  }
]
```

### POST /api/actualizar-puntuacion
Actualizar puntuación de un usuario (solo si es mayor).

**Body:**
```json
{
  "userId": 1,
  "puntuacion": 150
}
```

**Response:** `200 OK`
```json
{
  "message": "Puntuación actualizada",
  "puntuacion": 150
}
```

## 🎯 Uso

1. **Iniciar el servidor backend:**
   ```bash
   cd api
   python main.py
   ```

2. **Abrir la aplicación:**
   - Navegar a `http://localhost:5000/inicio/index.html`

3. **Registrarse:**
   - Crear una cuenta con usuario y contraseña
   - Contraseña debe tener al menos 4 caracteres

4. **Jugar:**
   - Iniciar sesión
   - Click en "Jugar" desde el menú
   - Repetir la secuencia de colores
   - La puntuación se guarda automáticamente

5. **Ver clasificaciones:**
   - Click en "Clasificaciones" desde el menú
   - Ver top 10 jugadores

## 🔒 Seguridad

- Las contraseñas se hashean con bcrypt (10 rounds)
- Validación de datos en frontend y backend
- Usuarios únicos (campo `usuario` con constraint UNIQUE)
- Puntuaciones solo se actualizan si son mayores

## 🌐 Deployment Azure (Opcional)

### Configurar Azure MySQL

1. Crear Azure Database for MySQL
2. Configurar firewall rules
3. Actualizar variables de entorno:

```bash
DB_HOST=tu-servidor.mysql.database.azure.com
DB_USER=tu-usuario@tu-servidor
DB_PASSWORD=tu-contraseña
DB_NAME=simon_dice
```

### Deploy Flask App

```bash
az webapp up --name simon-dice-app --resource-group tu-grupo
```

## 🛠️ Tecnologías

**Frontend:**
- HTML5
- CSS3
- JavaScript Vanilla
- Web Audio API

**Backend:**
- Python 3.x
- Flask 3.0.0
- SQLAlchemy 2.0.23
- PyMySQL 1.1.0
- bcrypt 4.1.2
- Flask-CORS 4.0.0

**Base de Datos:**
- MySQL 8.0+

## 📝 Arquitectura

Arquitectura de tres capas (Domain-Driven Design):

1. **Domain Layer**: Entidades y repositorios abstractos
2. **Application Layer**: Lógica de negocio (servicios)
3. **Infrastructure Layer**: Controllers (Flask) y Database (SQLAlchemy)

## 👤 Autor

Víctor - Práctica 8 Microservicios
