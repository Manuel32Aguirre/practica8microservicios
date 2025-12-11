# --- Bootstrap de imports desde la raíz del proyecto ---
import sys, os
ROOT = os.path.dirname(os.path.abspath(__file__))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
# -------------------------------------------------------

from flask import Flask, send_from_directory
from flask_cors import CORS
from infrastructure.controllers.UsuarioController import usuario_controller
from infrastructure.database import engine
from domain.entity.Usuario import Base
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Crear tablas sin romper el arranque
try:
    Base.metadata.create_all(engine)
except Exception as e:
    logger.error(f"Error creando tablas en Azure: {e}")

# Registrar el blueprint
app.register_blueprint(usuario_controller)


# --- HOME: sirve /inicio/index.html ---
@app.route("/")
def home():
    return send_from_directory("../inicio", "index.html")


# --- RUTAS PARA SERVIR TODAS LAS CARPETAS DEL FRONTEND ---
@app.route("/<path:path>")
def serve_static(path):
    """
    Sirve archivos desde las carpetas reales del proyecto:
    inicio/, registro/, menu/, juego/, clasificaciones/
    """

    # Listado de carpetas válidas del frontend
    allowed_folders = ["inicio", "registro", "menu", "juego", "clasificaciones"]

    for folder in allowed_folders:
        if path.startswith(folder + "/"):
            filepath = path[len(folder) + 1:]  # Ej: menu/archivo.css → archivo.css
            return send_from_directory(f"../{folder}", filepath)
    
    # Servir azure.png desde raíz
    if path == "azure.png":
        return send_from_directory("..", "azure.png")

    return "Not found", 404


# --- SERVER (PUERTO DINÁMICO DE AZURE) ---
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))  # ← OBLIGATORIO en Azure App Service
    app.run(host="0.0.0.0", port=port, debug=True)
