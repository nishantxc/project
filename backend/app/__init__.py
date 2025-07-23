# backend/app/__init__.py
import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Enable CORS with proper configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "https://project-ten-flax-62.vercel.app"],  # Update with your frontend origin
            "allow_headers": ["Authorization", "Content-Type"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "supports_credentials": True
        }
    })
    
    # Import and register blueprints
    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    return app