import sys, os
import logging
import ssl
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# AHORA EL CÓDIGO BUSCA PRIMERO EN AZURE, SI NO ENCUENTRA NADA USA EL DEFAULT
DB_USER = os.getenv("DB_USER", "manuel")
DB_PASSWORD = os.getenv("DB_PASS", "Practica8")
DB_HOST = os.getenv("DB_HOST", "practica8db.mysql.database.azure.com") # <--- AQUÍ EL CAMBIO CLAVE
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "simondice")

# URL con SSL habilitado
MYSQL_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}?ssl=true"
)

# Configuración SSL (necesaria para Azure Flexible Server)
ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

connect_args = {"ssl": ssl_ctx}

engine = create_engine(
    MYSQL_URL,
    echo=True,
    pool_recycle=3600,
    connect_args=connect_args
)

SessionLocal = sessionmaker(bind=engine)

__all__ = ["engine", "SessionLocal"]
