const { app } = require('@azure/functions');
const db = require('../shared/database');

app.http('clasificaciones', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const clasificaciones = await db.query(
                'SELECT id, usuario, puntuacion FROM usuarios ORDER BY puntuacion DESC LIMIT 50',
                []
            );

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clasificaciones)
            };

        } catch (error) {
            context.error('Error al obtener clasificaciones:', error);
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error del servidor' })
            };
        }
    }
});
