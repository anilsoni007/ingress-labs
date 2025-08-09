#!/bin/bash

echo "🚀 Deploying Ingress Lab to Kubernetes..."

# Deploy all services
echo "Deploying services..."
kubectl apply -f k8s/

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment
kubectl wait --for=condition=available --timeout=300s deployment/api-gateway-deployment
kubectl wait --for=condition=available --timeout=300s deployment/user-service-deployment
kubectl wait --for=condition=available --timeout=300s deployment/product-service-deployment
kubectl wait --for=condition=available --timeout=300s deployment/websocket-service-deployment
kubectl wait --for=condition=available --timeout=300s deployment/admin-service-deployment
kubectl wait --for=condition=available --timeout=300s deployment/static-assets-deployment

# Deploy basic Ingress
echo "Deploying basic path-based routing..."
kubectl apply -f ingress/01-basic-path-routing.yaml

echo "✅ Deployment complete!"
echo ""
echo "Services are available at:"
echo "- Frontend: http://localhost/"
echo "- API Gateway: http://localhost/api"
echo "- User Service: http://localhost/users"
echo "- Product Service: http://localhost/products"
echo "- WebSocket Service: http://localhost/ws"
echo "- Static Assets: http://localhost/static"
echo ""
echo "To test other Ingress scenarios:"
echo "kubectl apply -f ingress/02-host-based-routing.yaml"
echo "kubectl apply -f ingress/03-tls-ssl-ingress.yaml"
echo "kubectl apply -f ingress/04-advanced-annotations.yaml"