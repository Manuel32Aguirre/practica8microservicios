from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import logging
import ssl  # <--- IMPORTANTE: Agrega esto

# Configuración básica
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Credenciales (Tal cual las tienes)
DB_USER = "manuel"
DB_PASSWORD = "Practica8" # Recuerda usar la real que pusiste en Azure
DB_HOST = "practica8server.mysql.database.azure.com"
DB_PORT = 3306
DB_NAME = "simondice"

# URL de conexión
MYSQL_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# --- CORRECCIÓN SSL PARA AZURE + PYMYSQL ---
# Creamos un contexto SSL que no verifique estrictamente el certificado (Ideal para desarrollo)
ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

# Le pasamos ese contexto a la conexión
connect_args = {
    "ssl": ssl_ctx
}

engine = create_engine(
    MYSQL_URL, 
    echo=True, 
    pool_recycle=3600,
    connect_args=connect_args
)

SessionLocal = sessionmaker(bind=engine)

__all__ = ["engine", "SessionLocal"]