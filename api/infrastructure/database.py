from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import logging
import ssl

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CREDENCIALES CORRECTAS PARA AZURE MYSQL FLEXIBLE SERVER
DB_USER = "manuel"  # ← ESTA ES LA CLAVE
DB_PASSWORD = "Practica8"
DB_HOST = "practica8server.mysql.database.azure.com"
DB_PORT = 3306
DB_NAME = "simondice"

# URL con SSL habilitado
MYSQL_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}?ssl=true"
)

# Configuración SSL (necesaria)
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
