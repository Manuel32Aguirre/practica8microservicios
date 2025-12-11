from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario = Column(String(50), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    puntuacion = Column(Integer, default=0)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    fecha_ultima_actualizacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, usuario, contrasena, puntuacion=0):
        self.usuario = usuario
        self.contrasena = contrasena
        self.puntuacion = puntuacion

    def __repr__(self):
        return f"<Usuario(id={self.id}, usuario='{self.usuario}', puntuacion={self.puntuacion})>"
