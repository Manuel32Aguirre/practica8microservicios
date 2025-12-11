// Configuración global de la API
// Actualiza esta URL cuando despliegues a Azure
const API_BASE_URL = 'http://localhost:7071/api';

// Para producción, cambia a:
// const API_BASE_URL = 'https://TU_APP_NAME.azurewebsites.net/api';

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL };
}
