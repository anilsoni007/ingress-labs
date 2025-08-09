from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
import os
from datetime import timedelta

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

CORS(app)
jwt = JWTManager(app)

# Mock user database
users_db = [
    {
        'id': 1,
        'name': 'John Doe',
        'email': 'john@example.com',
        'role': 'admin',
        'password': bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    },
    {
        'id': 2,
        'name': 'Jane Smith',
        'email': 'jane@example.com',
        'role': 'user',
        'password': bcrypt.hashpw('password456'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    },
    {
        'id': 3,
        'name': 'Bob Johnson',
        'email': 'bob@example.com',
        'role': 'moderator',
        'password': bcrypt.hashpw('password789'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    }
]

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'user-service',
        'version': '1.0.0'
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    # Return users without passwords
    safe_users = []
    for user in users_db:
        safe_user = {k: v for k, v in user.items() if k != 'password'}
        safe_users.append(safe_user)
    return jsonify(safe_users)

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = next((u for u in users_db if u['id'] == user_id), None)
    if user:
        safe_user = {k: v for k, v in user.items() if k != 'password'}
        return jsonify(safe_user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    user = next((u for u in users_db if u['email'] == email), None)
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        access_token = create_access_token(
            identity=user['id'],
            additional_claims={'role': user['role'], 'email': user['email']}
        )
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = next((u for u in users_db if u['id'] == user_id), None)
    if user:
        safe_user = {k: v for k, v in user.items() if k != 'password'}
        return jsonify(safe_user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/users', methods=['POST'])
@jwt_required()
def create_user():
    data = request.get_json()
    
    # Check if user already exists
    if any(u['email'] == data.get('email') for u in users_db):
        return jsonify({'error': 'User already exists'}), 409
    
    new_user = {
        'id': len(users_db) + 1,
        'name': data.get('name'),
        'email': data.get('email'),
        'role': data.get('role', 'user'),
        'password': bcrypt.hashpw(data.get('password').encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    }
    
    users_db.append(new_user)
    safe_user = {k: v for k, v in new_user.items() if k != 'password'}
    return jsonify(safe_user), 201

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        'total_users': len(users_db),
        'roles': {
            'admin': len([u for u in users_db if u['role'] == 'admin']),
            'user': len([u for u in users_db if u['role'] == 'user']),
            'moderator': len([u for u in users_db if u['role'] == 'moderator'])
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)