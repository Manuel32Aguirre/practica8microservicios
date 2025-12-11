from application.UsuarioServicio import UsuarioServicio
from domain.entity.Usuario import Usuario
from infrastructure.database import SessionLocal
import bcrypt

class UsuarioServicioImpl(UsuarioServicio):
    """Implementación del servicio de usuarios."""

    def listar_clasificaciones(self):
        """Obtiene usuarios ordenados por puntuación descendente."""
        session = SessionLocal()
        try:
            return session.query(Usuario)\
                .filter(Usuario.puntuacion > 0)\
                .order_by(Usuario.puntuacion.desc())\
                .limit(50)\
                .all()
        finally:
            session.close()

    def obtener_por_id(self, id: int):
        """Obtiene un usuario por ID."""
        session = SessionLocal()
        try:
            return session.query(Usuario).filter(Usuario.id == id).first()
        finally:
            session.close()

    def obtener_por_usuario(self, usuario: str):
        """Obtiene un usuario por nombre de usuario."""
        session = SessionLocal()
        try:
            return session.query(Usuario).filter(Usuario.usuario == usuario).first()
        finally:
            session.close()

    def registrar(self, usuario_data: dict):
        """Registra un nuevo usuario con contraseña hasheada."""
        session = SessionLocal()
        try:
            # Verificar si el usuario ya existe
            usuario_existente = session.query(Usuario)\
                .filter(Usuario.usuario == usuario_data["usuario"])\
                .first()
            
            if usuario_existente:
                return None  # Usuario ya existe
            
            # Hashear la contraseña
            password_hash = bcrypt.hashpw(
                usuario_data["contrasena"].encode('utf-8'),
                bcrypt.gensalt()
            ).decode('utf-8')
            
            # Crear nuevo usuario
            nuevo_usuario = Usuario(
                usuario=usuario_data["usuario"],
                contrasena=password_hash,
                puntuacion=0
            )
            
            session.add(nuevo_usuario)
            session.commit()
            session.refresh(nuevo_usuario)
            return nuevo_usuario
        finally:
            session.close()

    def login(self, usuario: str, contrasena: str):
        """Valida las credenciales de un usuario."""
        session = SessionLocal()
        try:
            user = session.query(Usuario).filter(Usuario.usuario == usuario).first()
            
            if not user:
                return None
            
            # Verificar contraseña
            if bcrypt.checkpw(contrasena.encode('utf-8'), user.contrasena.encode('utf-8')):
                return user
            
            return None
        finally:
            session.close()

    def actualizar_puntuacion(self, id: int, puntuacion: int):
        """Actualiza la puntuación solo si es mayor a la actual."""
        session = SessionLocal()
        try:
            usuario = session.query(Usuario).filter(Usuario.id == id).first()
            
            if not usuario:
                return None
            
            # Solo actualizar si la nueva puntuación es mayor
            if puntuacion > usuario.puntuacion:
                usuario.puntuacion = puntuacion
                session.commit()
                session.refresh(usuario)
                return {"actualizado": True, "nueva_puntuacion": puntuacion}
            
            return {"actualizado": False, "puntuacion_actual": usuario.puntuacion}
        finally:
            session.close()
