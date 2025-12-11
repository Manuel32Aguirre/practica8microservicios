const { app } = require('@azure/functions');
const db = require('../shared/database');

app.http('actualizarPuntuacion', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'actualizar-puntuacion',
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const { userId, puntuacion } = body;

            // Validaciones
            if (!userId || puntuacion === undefined) {
                return {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'userId y puntuacion son requeridos' })
                };
            }

            if (typeof puntuacion !== 'number' || puntuacion < 0) {
                return {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Puntuación inválida' })
                };
            }

            // Obtener puntuación actual
            const users = await db.query(
                'SELECT puntuacion FROM usuarios WHERE id = ?',
                [userId]
            );

            if (users.length === 0) {
                return {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Usuario no encontrado' })
                };
            }

            const currentScore = users[0].puntuacion;

            // Solo actualizar si la nueva puntuación es mayor
            if (puntuacion > currentScore) {
                await db.query(
                    'UPDATE usuarios SET puntuacion = ? WHERE id = ?',
                    [puntuacion, userId]
                );

                return {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'Puntuación actualizada',
                        nuevaPuntuacion: puntuacion,
                        esNuevoRecord: true
                    })
                };
            } else {
                return {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: 'Puntuación no actualizada',
                        puntuacionActual: currentScore,
                        esNuevoRecord: false
                    })
                };
            }

        } catch (error) {
            context.error('Error al actualizar puntuación:', error);
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error del servidor' })
            };
        }
    }
});
