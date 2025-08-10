from flask import Flask, jsonify
import os
import socket
from datetime import datetime

app = Flask(__name__)

# Health check endpoint for ALB
@app.route('/hello/health')
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'hello-service',
        'timestamp': datetime.now().isoformat()
    })

# Main hello endpoint
@app.route('/hello')
def hello():
    return jsonify({
        'message': 'Hello from Kubernetes!',
        'service': 'hello-service',
        'hostname': socket.gethostname(),
        'timestamp': datetime.now().isoformat()
    })

# Hello with name
@app.route('/hello/<name>')
def hello_name(name):
    return jsonify({
        'message': f'Hello {name} from Kubernetes!',
        'service': 'hello-service',
        'hostname': socket.gethostname(),
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)