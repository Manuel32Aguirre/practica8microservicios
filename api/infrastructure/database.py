from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import logging

# Configuración básica
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Credenciales de la base de datos
DB_USER = "manuel"
DB_PASSWORD = "1234"
DB_HOST = "127.0.0.1"
DB_PORT = 3309
DB_NAME = "simondice"

# Construimos la URL de MySQL
MYSQL_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

logger.info(f"Intentando conectar a: {DB_HOST}:{DB_PORT}/{DB_NAME}...")

# Agregamos ssl_args para Azure (a veces es estricto con SSL)
connect_args = {}
if "azure" in DB_HOST:
    connect_args = {"ssl": {"fake_flag_to_enable": True}} 

engine = create_engine(
    MYSQL_URL, 
    echo=True, 
    pool_recycle=3600,
    connect_args=connect_args
)

SessionLocal = sessionmaker(bind=engine)

__all__ = ["engine", "SessionLocal"]
