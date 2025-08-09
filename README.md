# Kubernetes Ingress Lab - Complete Use Cases

This lab provides hands-on experience with all major Kubernetes Ingress scenarios:

## 🎯 Ingress Use Cases Covered

### 1. Path-Based Routing
- `/` → Frontend App
- `/api/*` → API Gateway
- `/users/*` → User Service
- `/products/*` → Product Service
- `/admin/*` → Admin Service
- `/ws/*` → WebSocket Service
- `/static/*` → Static Assets

### 2. Host-Based Routing
- `frontend.local` → Frontend App
- `api.local` → API Gateway
- `admin.local` → Admin Service

### 3. TLS/SSL Termination
- HTTPS endpoints with certificates
- HTTP to HTTPS redirects

### 4. Load Balancing
- Multiple replicas with different algorithms
- Session affinity scenarios

### 5. Authentication & Authorization
- Basic auth, JWT tokens
- Rate limiting

### 6. Advanced Features
- WebSocket support
- Custom headers
- Rewrite rules
- CORS handling

## 🚀 Quick Start

```bash
# Build all services
./build-all.sh

# Deploy to Kubernetes
kubectl apply -f k8s/

# Setup Ingress
kubectl apply -f ingress/
```

## 📁 Project Structure

```
├── services/
│   ├── frontend/          # React frontend
│   ├── api-gateway/       # Node.js API gateway
│   ├── user-service/      # Python Flask auth service
│   ├── product-service/   # Go REST API
│   ├── admin-service/     # Java Spring Boot admin
│   ├── websocket-service/ # Node.js WebSocket
│   └── static-assets/     # Nginx static files
├── k8s/                   # Kubernetes manifests
├── ingress/               # Ingress configurations
└── scripts/               # Helper scripts
```

## 🧪 Lab Exercises

Each service demonstrates specific Ingress patterns you'll use in production environments.