from flask import Flask, jsonify
import os
import socket
import psutil
from datetime import datetime

app = Flask(__name__)

# Health check endpoint for ALB
@app.route('/info/health')
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'info-service',
        'timestamp': datetime.now().isoformat()
    })

# Main info endpoint
@app.route('/info')
def info():
    return jsonify({
        'service': 'info-service',
        'hostname': socket.gethostname(),
        'python_version': os.sys.version,
        'timestamp': datetime.now().isoformat()
    })

# System stats endpoint
@app.route('/info/stats')
def stats():
    return jsonify({
        'service': 'info-service',
        'hostname': socket.gethostname(),
        'cpu_percent': psutil.cpu_percent(),
        'memory_percent': psutil.virtual_memory().percent,
        'disk_usage': psutil.disk_usage('/').percent,
        'timestamp': datetime.now().isoformat()
    })

# Environment variables
@app.route('/info/env')
def env():
    return jsonify({
        'service': 'info-service',
        'hostname': socket.gethostname(),
        'environment': dict(os.environ),
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)