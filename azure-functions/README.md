# Azure Functions - Sigue al Líder API

API backend para el juego "Sigue al Líder" implementada con Azure Functions.

## Estructura del Proyecto

```
azure-functions/
├── shared/
│   └── database.js          # Módulo de conexión a la base de datos
├── register/
│   └── index.js            # Función para registro de usuarios
├── login/
│   └── index.js            # Función para inicio de sesión
├── usuario/
│   └── index.js            # Función para obtener datos de usuario
├── clasificaciones/
│   └── index.js            # Función para obtener clasificaciones
├── actualizarPuntuacion/
│   └── index.js            # Función para actualizar puntuación
├── package.json
├── host.json
└── local.settings.json
```

## Configuración

### 1. Instalar Dependencias

```bash
cd azure-functions
npm install
```

### 2. Configurar Variables de Entorno

Copia `.env.example` a `local.settings.json` y configura las variables:

```json
{
  "Values": {
    "DB_HOST": "tu-servidor-mysql",
    "DB_USER": "tu-usuario",
    "DB_PASSWORD": "tu-contraseña",
    "DB_NAME": "sigue_al_lider"
  }
}
```

### 3. Configurar Base de Datos

Ejecuta el archivo `../database/schema.sql` en tu servidor MySQL:

```bash
mysql -u root -p < ../database/schema.sql
```

## Ejecutar en Local

```bash
npm start
```

Las funciones estarán disponibles en: `http://localhost:7071/api/`

## Endpoints API

### POST /api/register
Registrar nuevo usuario
```json
{
  "username": "usuario123",
  "password": "contraseña"
}
```

### POST /api/login
Iniciar sesión
```json
{
  "username": "usuario123",
  "password": "contraseña"
}
```

### GET /api/usuario/{userId}
Obtener información de usuario

### GET /api/clasificaciones
Obtener top 50 clasificaciones

### POST /api/actualizar-puntuacion
Actualizar puntuación de usuario
```json
{
  "userId": 1,
  "puntuacion": 150
}
```

## Desplegar a Azure

### 1. Crear Function App en Azure

```bash
az functionapp create --resource-group tu-grupo --consumption-plan-location eastus --runtime node --runtime-version 18 --functions-version 4 --name tu-app-name --storage-account tu-storage
```

### 2. Configurar Variables de Entorno en Azure

```bash
az functionapp config appsettings set --name tu-app-name --resource-group tu-grupo --settings DB_HOST=tu-servidor DB_USER=tu-usuario DB_PASSWORD=tu-password DB_NAME=sigue_al_lider
```

### 3. Desplegar

```bash
func azure functionapp publish tu-app-name
```

## Seguridad

- Las contraseñas se hashean con bcrypt (10 rounds)
- Solo se actualizan puntuaciones si son mayores a la actual
- Validaciones en todos los endpoints
- CORS configurado para desarrollo (ajustar en producción)

## Dependencias

- `@azure/functions`: Runtime de Azure Functions
- `mysql2`: Cliente MySQL con soporte para promesas
- `bcryptjs`: Hashing de contraseñas
