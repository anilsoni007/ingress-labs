# Simple Ingress Lab - 2 Services

## Objective
Learn ALB ingress basics with 2 simple services that handle paths correctly.

## Services
1. **Hello Service** - Simple greeting API (handles /hello/* paths)
2. **Info Service** - System information API (handles /info/* paths)

## Lab Goals
- Understand path-based routing with ALB
- Learn health check configuration
- Practice ingress troubleshooting
- Build solid ingress foundation

## Quick Start
```bash
# Build services
docker build -t asoni007/hello-service ./hello-service
docker build -t asoni007/info-service ./info-service

# Deploy to Kubernetes
kubectl apply -f k8s/

# Create ingress
kubectl apply -f ingress.yaml

# Test endpoints
curl http://ALB_URL/hello
curl http://ALB_URL/info
```

## Expected Results
- `/hello` → Hello Service
- `/info` → Info Service
- Both services handle their paths correctly
- ALB health checks pass