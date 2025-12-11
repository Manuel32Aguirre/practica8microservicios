from abc import ABC, abstractmethod

class UsuarioServicio(ABC):
    """Interfaz del servicio de aplicación para usuarios."""

    @abstractmethod
    def listar_clasificaciones(self):
        """Obtiene la lista de usuarios ordenados por puntuación."""
        pass

    @abstractmethod
    def obtener_por_id(self, id: int):
        """Obtiene un usuario por su ID."""
        pass

    @abstractmethod
    def obtener_por_usuario(self, usuario: str):
        """Obtiene un usuario por su nombre de usuario."""
        pass

    @abstractmethod
    def registrar(self, usuario_data: dict):
        """Registra un nuevo usuario."""
        pass

    @abstractmethod
    def login(self, usuario: str, contrasena: str):
        """Valida las credenciales de un usuario."""
        pass

    @abstractmethod
    def actualizar_puntuacion(self, id: int, puntuacion: int):
        """Actualiza la puntuación de un usuario si es mayor."""
        pass
