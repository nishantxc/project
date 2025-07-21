# backend/app/routes.py
import os
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from supabase import create_client, Client
from app.auth import auth_required, get_authenticated_client

api = Blueprint('api', __name__)

# Initialize Supabase
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_ANON_KEY')

@api.route('/tasks', methods=['GET'])
@auth_required
def get_tasks():
    """Get all tasks for the authenticated user"""
    user_id = request.user.id
    
    try:
        # Add debug logging for the user context
        print(f"Fetching tasks for user: {user_id}")
        
        # Get authenticated client
        token = request.headers.get('Authorization').split(" ")[1]
        client = get_authenticated_client(token)
        
        # Execute query with error handling
        response = client.table('tasks').select('*').eq('user_id', user_id).execute()
        
        if not response.data:
            return jsonify({"error": "No tasks found"}), 404
            
        return jsonify({"tasks": response.data})
        
    except Exception as e:
        print(f"Task fetch error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@api.route('/tasks', methods=['POST'])
@auth_required
def create_task():
    """Create a new task for the authenticated user"""
    token = request.headers.get('Authorization').split(" ")[1]
    user_id = request.user.id
    
    client = get_authenticated_client(token)
    
    try:
        task_data = request.json
        print(f"Task data received: {task_data}")
        
        # Prepare task data
        task_with_user = {
            **task_data,
            'user_id': user_id,
            'created_at': datetime.now().isoformat()
        }
        
        # Insert task
        response = client.table('tasks').insert(task_with_user).execute()
        
        if len(response.data) > 0:
            task = response.data[0]
            return jsonify({"task": task}), 201
        else:
            return jsonify({"error": "Failed to create task"}), 400
    except Exception as e:
        print(f"Task creation error: {str(e)}")
        return jsonify({"error": "Invalid request body", "details": str(e)}), 400

@api.route('/tasks', methods=['PUT'])
@auth_required
def update_task():
    """Update an existing task"""
    token = request.headers.get('Authorization').split(" ")[1]
    user_id = request.user.id
    
    client = get_authenticated_client(token)
    
    try:
        body = request.json
        task_id = body.get('id')
        
        if not task_id:
            return jsonify({"error": "Task ID is required"}), 400
        
        # Remove id from update fields
        update_fields = {k: v for k, v in body.items() if k != 'id'}
        
        # Check if task belongs to user
        existing_task = client.table('tasks').select('id').eq('id', task_id).eq('user_id', user_id).execute()
        
        if not existing_task.data:
            return jsonify({"error": "Task not found or access denied"}), 404
        
        # Update task
        response = client.table('tasks').update(update_fields).eq('id', task_id).eq('user_id', user_id).execute()
        
        if len(response.data) > 0:
            updated_task = response.data[0]
            return jsonify({"task": updated_task})
        else:
            return jsonify({"error": "No task updated. Task may not exist or not belong to user."}), 404
            
    except Exception as e:
        print(f"Task update error: {str(e)}")
        return jsonify({"error": "Invalid request body", "details": str(e)}), 400


@api.route('/members', methods=['GET'])
@auth_required
def get_members():
    """Get all members for the authenticated user"""
    user_id = request.user.id

    try:
        # Add debug logging for the user context
        print(f"Fetching members for user: {user_id}")

        # Verify client connection
        client = get_authenticated_client(request.headers.get('Authorization').split(" ")[1])
        if not client:
            return jsonify({"error": "Client authentication failed"}), 401
        # Execute query with error handling
        response = client.table('members').select('*').eq('user_id', user_id).execute()
        if not response.data:
            return jsonify({"error": "No members found"}), 404
        return jsonify({"members": response.data})
    except Exception as e:
        print(f"Member fetch error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@api.route('/members', methods=['POST'])
@auth_required
@cross_origin(origins=["http://localhost:3000", "http://localhost:3000", "https://project-ten-flax-62.vercel.app"], supports_credentials=True, methods=["POST"], allow_headers=["Content-Type", "Authorization"])
def create_member():
    """Create a new member for the authenticated user"""
    token = request.headers.get('Authorization').split(" ")[1]
    user_id = request.user.id
    client = get_authenticated_client(token)

    try:
        member_data = request.get_json()
        if not member_data:
            return jsonify({"error": "Request body must be JSON"}), 400
            
        print(f"Member data received: {member_data}")
        
        # Validate required fields
        if not member_data.get('name') or not member_data.get('role'):
            return jsonify({"error": "Name and role are required"}), 400
            
        # Prepare member data
        member_with_user = {
            **member_data,
            'user_id': user_id,
            'created_at': datetime.now().isoformat()
        }
        
        # Insert member
        response = client.table('members').insert(member_with_user).execute()
        
        if len(response.data) > 0:
            member = response.data[0]
            return jsonify({"member": member}), 201
        else:
            print(f"Failed to create member: {response}")
            return jsonify({"error": "Failed to create member"}), 400
            
    except Exception as e:
        print(f"Member creation error: {str(e)}")
        return jsonify({
            "error": "Invalid request body", 
            "details": str(e)
        }), 400