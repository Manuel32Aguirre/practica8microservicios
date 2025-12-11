from flask import Blueprint, jsonify, request
from application.impl.UsuarioServicioImpl import UsuarioServicioImpl

usuario_controller = Blueprint("usuario_controller", __name__)
service = UsuarioServicioImpl()

@usuario_controller.route("/api/clasificaciones", methods=["GET"])
def listar_clasificaciones():
    """Obtiene las clasificaciones (top 50)."""
    usuarios = service.listar_clasificaciones()
    return jsonify([
        {
            "id": u.id,
            "usuario": u.usuario,
            "puntuacion": u.puntuacion
        }
        for u in usuarios
    ])

@usuario_controller.route("/api/usuario/<int:id>", methods=["GET"])
def obtener_usuario(id):
    """Obtiene un usuario por ID."""
    usuario = service.obtener_por_id(id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    return jsonify({
        "id": usuario.id,
        "usuario": usuario.usuario,
        "puntuacion": usuario.puntuacion,
        "fecha_registro": usuario.fecha_registro.isoformat() if usuario.fecha_registro else None
    })

@usuario_controller.route("/api/register", methods=["POST"])
def registrar_usuario():
    """Registra un nuevo usuario."""
    try:
        data = request.get_json()
        
        # Validaciones
        if not data or not data.get("usuario") or not data.get("contrasena"):
            return jsonify({"error": "Usuario y contraseña son requeridos"}), 400
        
        if len(data["usuario"]) < 3:
            return jsonify({"error": "El usuario debe tener al menos 3 caracteres"}), 400
        
        if len(data["contrasena"]) < 4:
            return jsonify({"error": "La contraseña debe tener al menos 4 caracteres"}), 400
        
        nuevo_usuario = service.registrar(data)
        
        if not nuevo_usuario:
            return jsonify({"error": "El usuario ya existe"}), 409
        
        return jsonify({
            "message": "Usuario registrado exitosamente",
            "userId": nuevo_usuario.id,
            "usuario": nuevo_usuario.usuario
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@usuario_controller.route("/api/login", methods=["POST"])
def login_usuario():
    """Inicia sesión de un usuario."""
    try:
        data = request.get_json()
        
        if not data or not data.get("usuario") or not data.get("contrasena"):
            return jsonify({"error": "Usuario y contraseña son requeridos"}), 400
        
        usuario = service.login(data["usuario"], data["contrasena"])
        
        if not usuario:
            return jsonify({"error": "Usuario o contraseña incorrectos"}), 401
        
        return jsonify({
            "message": "Login exitoso",
            "userId": usuario.id,
            "usuario": usuario.usuario,
            "puntuacion": usuario.puntuacion
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@usuario_controller.route("/api/actualizar-puntuacion", methods=["POST"])
def actualizar_puntuacion():
    """Actualiza la puntuación de un usuario."""
    try:
        data = request.get_json()
        
        if not data or not data.get("userId") or "puntuacion" not in data:
            return jsonify({"error": "userId y puntuacion son requeridos"}), 400
        
        if not isinstance(data["puntuacion"], int) or data["puntuacion"] < 0:
            return jsonify({"error": "Puntuación inválida"}), 400
        
        resultado = service.actualizar_puntuacion(data["userId"], data["puntuacion"])
        
        if not resultado:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        if resultado["actualizado"]:
            return jsonify({
                "message": "Puntuación actualizada",
                "nuevaPuntuacion": resultado["nueva_puntuacion"],
                "esNuevoRecord": True
            })
        else:
            return jsonify({
                "message": "Puntuación no actualizada (no supera el récord actual)",
                "puntuacionActual": resultado["puntuacion_actual"],
                "esNuevoRecord": False
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
