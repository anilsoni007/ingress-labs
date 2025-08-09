#!/bin/bash

echo "🚀 Building all Ingress Lab services..."

# Build frontend
echo "Building frontend service..."
cd services/frontend
docker build -t ingress-lab/frontend:latest .
cd ../..

# Build API gateway
echo "Building API gateway service..."
cd services/api-gateway
docker build -t ingress-lab/api-gateway:latest .
cd ../..

# Build user service
echo "Building user service..."
cd services/user-service
docker build -t ingress-lab/user-service:latest .
cd ../..

# Build product service
echo "Building product service..."
cd services/product-service
docker build -t ingress-lab/product-service:latest .
cd ../..

# Build WebSocket service
echo "Building WebSocket service..."
cd services/websocket-service
docker build -t ingress-lab/websocket-service:latest .
cd ../..

# Build admin service
echo "Building admin service..."
cd services/admin-service
docker build -t ingress-lab/admin-service:latest .
cd ../..

# Build static assets service
echo "Building static assets service..."
cd services/static-assets
docker build -t ingress-lab/static-assets:latest .
cd ../..

echo "✅ All services built successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy to Kubernetes: kubectl apply -f k8s/"
echo "2. Setup Ingress: kubectl apply -f ingress/"
echo "3. Add hosts to /etc/hosts for host-based routing"