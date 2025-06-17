# backend/app/auth.py
import os
from supabase import create_client, Client
from functools import wraps
from flask import request, jsonify

# Initialize Supabase client
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_ANON_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

def get_authenticated_client(token):
    """Create a new Supabase client with the user's access token"""
    client = create_client(
        os.environ.get('SUPABASE_URL'),
        os.environ.get('SUPABASE_SERVICE_KEY')  # Use service key instead of anon key
    )
    try:
        client.auth.set_session(
            access_token=token,
            refresh_token=""
        )
        return client
    except Exception as e:
        print(f"Client authentication error: {str(e)}")
        return None

def get_user_from_token(token):
    """Get user from access token"""
    try:
        # Create client with service role for verification
        client = create_client(
            os.environ.get('SUPABASE_URL'),
            os.environ.get('SUPABASE_SERVICE_KEY')
        )
        response = client.auth.get_user(token)
        return response.user
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        return None

def auth_required(f):
    """Decorator to require authentication for routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized"}), 401
        
        token = auth_header.split(" ")[1]
        user = get_user_from_token(token)
        
        if not user:
            return jsonify({"error": "Unauthorized", "details": "Invalid token"}), 401
        
        # Add the user to the request context
        request.user = user
        return f(*args, **kwargs)
    
    return decorated