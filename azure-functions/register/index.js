const { app } = require('@azure/functions');
const bcrypt = require('bcryptjs');
const db = require('../shared/database');

app.http('register', {
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

            if (username.length < 3) {
                return {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'El usuario debe tener al menos 3 caracteres' })
                };
            }

            if (password.length < 4) {
                return {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'La contraseña debe tener al menos 4 caracteres' })
                };
            }

            // Verificar si el usuario ya existe
            const existingUser = await db.query(
                'SELECT id FROM usuarios WHERE usuario = ?',
                [username]
            );

            if (existingUser.length > 0) {
                return {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'El usuario ya existe' })
                };
            }

            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insertar usuario
            const result = await db.query(
                'INSERT INTO usuarios (usuario, contrasena, puntuacion) VALUES (?, ?, 0)',
                [username, hashedPassword]
            );

            return {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'Usuario registrado exitosamente',
                    userId: result.insertId
                })
            };

        } catch (error) {
            context.error('Error en registro:', error);
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error del servidor' })
            };
        }
    }
});
