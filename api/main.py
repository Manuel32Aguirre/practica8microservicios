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

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Crear las tablas si no existen
Base.metadata.create_all(engine)

# Registrar el controlador
app.register_blueprint(usuario_controller)

# Ruta para servir el frontend
@app.route('/')
def home():
    return send_from_directory('../inicio', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Sirve archivos estáticos del frontend."""
    # Determinar la carpeta según la ruta
    if path.startswith('inicio/'):
        return send_from_directory('../inicio', path[7:])
    elif path.startswith('registro/'):
        return send_from_directory('../registro', path[9:])
    elif path.startswith('menu/'):
        return send_from_directory('../menu', path[5:])
    elif path.startswith('clasificaciones/'):
        return send_from_directory('../clasificaciones', path[16:])
    elif path.startswith('juego/'):
        return send_from_directory('../juego', path[6:])
    else:
        return "Not found", 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
