import os
from app import create_app

# Load environment variables from .env file
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
    print("Loaded .env file")
else:
    print(".env file not found, relying on system environment variables")


app = create_app()

if __name__ == '__main__':
    host = os.environ.get('FLASK_RUN_HOST', '127.0.0.1')
    port = int(os.environ.get('FLASK_RUN_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', '0') == '1'
    print(f"Starting Flask server on {host}:{port} with debug={debug}")
    app.run(host=host, port=port, debug=debug)