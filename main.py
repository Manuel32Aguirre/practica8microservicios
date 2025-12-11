# ==============================================================
# BOOTSTRAP DE IMPORTS PARA AZURE (IMPRESCINDIBLE)
# ==============================================================

import sys, os
ROOT = os.path.dirname(os.path.abspath(__file__))

# Agregar raíz del proyecto al sys.path
if ROOT not in sys.path:
    sys.path.append(ROOT)

# Agregar subcarpetas importantes para permitir imports absolutos
for folder in ["infrastructure", "domain", "api", "database"]:
    full = os.path.join(ROOT, folder)
    if full not in sys.path:
        sys.path.append(full)

# ==============================================================

from flask import Flask, send_from_directory
from flask_cors import CORS
from infrastructure.controllers.UsuarioController import usuario_controller
from infrastructure.database import engine
from domain.entity.Usuario import Base
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Habilitar CORS
CORS(app)

# Crear tablas sin romper el arranque del servidor
try:
    Base.metadata.create_all(engine)
except Exception as e:
    logger.error(f"Error creando tablas en Azure: {e}")


# ==============================================================
# RUTAS DE FRONTEND (ADAPTADAS A TU ESTRUCTURA REAL)
# ==============================================================

@app.route("/")
def home():
    """Sirve el index.html dentro de /inicio"""
    return send_from_directory("inicio", "index.html")


@app.route("/<path:path>")
def serve_static(path):
    """
    Sirve archivos desde las carpetas reales del proyecto:
    inicio/, registro/, menu/, juego/, clasificaciones/
    """

    allowed_folders = ["inicio", "registro", "menu", "juego", "clasificaciones"]

    # Manejo de carpetas
    for folder in allowed_folders:
        if path.startswith(folder + "/"):
            filepath = path[len(folder) + 1:]  # quita "folder/"
            return send_from_directory(folder, filepath)

    # Servir azure.png desde raíz
    if path == "azure.png":
        return send_from_directory(".", "azure.png")

    return "Not found", 404


# Registrar controlador
app.register_blueprint(usuario_controller)


# ==============================================================
# SERVIDOR (PUERTO DINÁMICO DE AZURE)
# ==============================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Azure usa 8000 con Gunicorn
    app.run(host="0.0.0.0", port=port, debug=True)
