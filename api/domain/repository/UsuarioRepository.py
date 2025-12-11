from abc import ABC, abstractmethod

class UsuarioRepository(ABC):
    """Interfaz base para el repositorio de usuarios."""

    @abstractmethod
    def find_all(self):
        pass

    @abstractmethod
    def find_by_id(self, id: int):
        pass

    @abstractmethod
    def find_by_username(self, usuario: str):
        pass

    @abstractmethod
    def save(self, usuario):
        pass

    @abstractmethod
    def update_puntuacion(self, id: int, puntuacion: int):
        pass

    @abstractmethod
    def delete(self, id: int):
        pass
