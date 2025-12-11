# Sigue al Líder - Juego de Memoria

Juego web de memoria donde debes repetir secuencias de botones cada vez más largas.

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
├── database/              # Base de datos
│   └── schema.sql
└── azure-functions/       # API Backend
    ├── shared/
    ├── register/
    ├── login/
    ├── usuario/
    ├── clasificaciones/
    ├── actualizarPuntuacion/
    └── README.md
```

## Instalación y Configuración

### 1. Base de Datos

```bash
# Crear la base de datos
mysql -u root -p -e "CREATE DATABASE sigue_al_lider;"

# Importar el schema
mysql -u root -p sigue_al_lider < database/schema.sql
```

### 2. Azure Functions (Backend)

```bash
cd azure-functions
npm install
```

Configura `local.settings.json` con tus credenciales de base de datos.

```bash
# Ejecutar en modo desarrollo
npm start
```

### 3. Frontend

Las páginas son HTML estático. Puedes usar cualquier servidor web:

```bash
# Opción 1: Live Server en VS Code
# Abre inicio/index.html con Live Server

# Opción 2: http-server
npx http-server -p 8080

# Opción 3: Python
python -m http.server 8080
```

### 4. Configurar URL de API

En cada archivo `js/main.js`, actualiza la constante `API_BASE_URL`:

```javascript
const API_BASE_URL = 'http://localhost:7071/api';  // Local
// o
const API_BASE_URL = 'https://tu-app.azurewebsites.net/api';  // Producción
```

## Características

- Sistema de usuarios con registro e inicio de sesión
- Contraseñas hasheadas con bcrypt
- Juego de memoria con 8 botones de colores
- Sonidos únicos para cada botón
- Sistema de puntuación
- Clasificaciones globales
- Responsive design
- Sin emojis en los textos del juego

## Tecnologías

### Frontend
- HTML5
- CSS3 (Gradientes, animaciones)
- JavaScript Vanilla
- Web Audio API

### Backend
- Azure Functions (Node.js)
- MySQL
- bcryptjs

## Base de Datos

### Tabla: usuarios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT AUTO_INCREMENT | ID único del usuario |
| usuario | VARCHAR(50) | Nombre de usuario único |
| contrasena | VARCHAR(255) | Contraseña hasheada |
| puntuacion | INT | Mejor puntuación |
| fecha_registro | TIMESTAMP | Fecha de creación |
| fecha_ultima_actualizacion | TIMESTAMP | Última actualización |

## API Endpoints

- `POST /api/register` - Registrar usuario
- `POST /api/login` - Iniciar sesión
- `GET /api/usuario/{userId}` - Obtener datos de usuario
- `GET /api/clasificaciones` - Obtener clasificaciones
- `POST /api/actualizar-puntuacion` - Actualizar puntuación

## Flujo de la Aplicación

1. Usuario accede a `inicio/index.html`
2. Puede ir a `registro/index.html` para crear cuenta
3. Al iniciar sesión, se guarda en localStorage
4. Redirige a `menu/index.html`
5. Desde el menú puede:
   - Jugar (`juego/index.html`)
   - Ver clasificaciones (`clasificaciones/index.html`)
   - Cerrar sesión
6. Al terminar el juego, se guarda la puntuación si es récord

## Despliegue

### Frontend
Puede desplegarse en:
- Azure Static Web Apps
- GitHub Pages
- Netlify
- Vercel

### Backend
```bash
func azure functionapp publish nombre-de-tu-app
```

## Licencia

MIT
