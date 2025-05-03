import os
import json
from flask import Flask
from flask_cors import CORS

# Application Factory
def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    # --- Configuration ---
    app.config.from_pyfile('config.py', silent=True)
    if test_config is not None:
        app.config.update(test_config)

    # --- Extensions ---
    # Make CORS more explicit - Allow requests from your Vite dev server URL
    # Allow common headers AND Content-Type (important for uploads, though browser/axios often handle it)
    # supports_credentials=True might be needed depending on future auth needs
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, # Adjust port if needed
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"], # Ensure Content-Type is allowed
         supports_credentials=True,
         expose_headers=["Content-Disposition"]) # Expose headers if needed later

    # --- Storage Helpers ---
    # (Keep the load_jds and save_jds functions as they were)
    def load_jds():
        try:
            with open(app.config['JD_STORAGE_FILE'], 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def save_jds(jds_data):
        try:
            with open(app.config['JD_STORAGE_FILE'], 'w') as f:
                json.dump(jds_data, f, indent=4)
        except IOError as e:
            app.logger.error(f"Error saving JDs: {e}")

    app.load_jds = load_jds
    app.save_jds = save_jds

    # --- Blueprints ---
    from .routes import jd_routes, cv_routes
    app.register_blueprint(jd_routes.bp, url_prefix='/api/jds')
    app.register_blueprint(cv_routes.bp, url_prefix='/api')

    # --- Basic Routes ---
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    # --- Logging ---
    if not app.debug:
        pass
    else:
        app.logger.setLevel('DEBUG')
        app.logger.info("Flask App Created in DEBUG mode")

    app.logger.info(f"Using JD Storage: {app.config['JD_STORAGE_FILE']}")
    if not os.path.exists(app.config['JD_STORAGE_FILE']):
        save_jds([])
        app.logger.info(f"Created initial empty JD storage file.")

    return app