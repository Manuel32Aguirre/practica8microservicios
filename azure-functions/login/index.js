const { app } = require('@azure/functions');
const bcrypt = require('bcryptjs');
const db = require('../shared/database');

app.http('login', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const { username, password } = body;

            // Validaciones
            if (!username || !password) {
                return {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Usuario y contraseña son requeridos' })
                };
            }

            // Buscar usuario
            const users = await db.query(
                'SELECT id, usuario, contrasena FROM usuarios WHERE usuario = ?',
                [username]
            );

            if (users.length === 0) {
                return {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Usuario o contraseña incorrectos' })
                };
            }

            const user = users[0];

            // Verificar contraseña
            const validPassword = await bcrypt.compare(password, user.contrasena);

            if (!validPassword) {
                return {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Usuario o contraseña incorrectos' })
                };
            }

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'Login exitoso',
                    userId: user.id,
                    usuario: user.usuario
                })
            };

        } catch (error) {
            context.error('Error en login:', error);
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error del servidor' })
            };
        }
    }
});
