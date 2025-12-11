const { app } = require('@azure/functions');
const db = require('../shared/database');

app.http('usuario', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'usuario/{userId}',
    handler: async (request, context) => {
        try {
            const userId = request.params.userId;

            if (!userId) {
                return {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'ID de usuario requerido' })
                };
            }

            const users = await db.query(
                'SELECT id, usuario, puntuacion, fecha_registro FROM usuarios WHERE id = ?',
                [userId]
            );

            if (users.length === 0) {
                return {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Usuario no encontrado' })
                };
            }

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(users[0])
            };

        } catch (error) {
            context.error('Error al obtener usuario:', error);
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error del servidor' })
            };
        }
    }
});
