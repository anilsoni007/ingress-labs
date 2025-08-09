# 🧪 Kubernetes Ingress Lab Exercises

## Prerequisites
- Kubernetes cluster (minikube, kind, or cloud)
- kubectl configured
- NGINX Ingress Controller installed
- Docker for building images

## Lab Exercise 1: Basic Path-Based Routing

**Objective**: Route traffic based on URL paths

### Steps:
1. Build and deploy all services:
   ```bash
   ./scripts/build-all.sh
   ./scripts/deploy.sh
   ```

2. Test path-based routing:
   ```bash
   curl http://localhost/
   curl http://localhost/api/health
   curl http://localhost/users/health
   curl http://localhost/products/health
   ```

3. **Exercise**: Modify the Ingress to add a new path `/admin` that routes to the user service

## Lab Exercise 2: Host-Based Routing

**Objective**: Route traffic based on hostnames

### Steps:
1. Deploy host-based Ingress:
   ```bash
   kubectl apply -f ingress/02-host-based-routing.yaml
   ```

2. Setup hosts file:
   ```bash
   ./scripts/setup-hosts.sh
   ```

3. Test different hosts:
   ```bash
   curl http://frontend.local
   curl http://api.local/health
   ```

4. **Exercise**: Add a new host `admin.local` that routes to the user service

## Lab Exercise 3: TLS/SSL Termination

**Objective**: Enable HTTPS with SSL certificates

### Steps:
1. Create self-signed certificate:
   ```bash
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout tls.key -out tls.crt -subj "/CN=secure.local"
   ```

2. Create TLS secret:
   ```bash
   kubectl create secret tls ingress-lab-tls --key tls.key --cert tls.crt
   ```

3. Deploy TLS Ingress:
   ```bash
   kubectl apply -f ingress/03-tls-ssl-ingress.yaml
   ```

4. **Exercise**: Test HTTPS access and HTTP to HTTPS redirect

## Lab Exercise 4: Advanced Annotations

**Objective**: Use advanced Ingress features

### Steps:
1. Create basic auth secret:
   ```bash
   htpasswd -c auth admin
   kubectl create secret generic basic-auth-secret --from-file=auth
   ```

2. Deploy advanced Ingress:
   ```bash
   kubectl apply -f ingress/04-advanced-annotations.yaml
   ```

3. **Exercise**: Test rate limiting, CORS, and basic authentication

## Lab Exercise 5: Load Balancing & Session Affinity

**Objective**: Configure load balancing strategies

### Steps:
1. Scale product service:
   ```bash
   kubectl scale deployment product-service-deployment --replicas=5
   ```

2. Test load balancing:
   ```bash
   for i in {1..10}; do curl http://localhost/products/health; done
   ```

3. **Exercise**: Enable session affinity and test sticky sessions

## Lab Exercise 6: Canary Deployments

**Objective**: Implement canary deployment strategy

### Steps:
1. Create v2 deployment:
   ```bash
   # Modify frontend image tag to v2
   kubectl apply -f k8s/frontend-deployment-v2.yaml
   ```

2. Deploy canary Ingress:
   ```bash
   kubectl apply -f ingress/05-canary-deployment.yaml
   ```

3. **Exercise**: Test traffic splitting with different weights

## Lab Exercise 7: WebSocket Support

**Objective**: Configure Ingress for WebSocket connections

### Steps:
1. Test WebSocket endpoint:
   ```bash
   curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
     http://localhost/ws/
   ```

2. **Exercise**: Create a simple WebSocket client to test real-time features

## Lab Exercise 8: Custom Error Pages

**Objective**: Configure custom error pages

### Steps:
1. Create custom error page service
2. Configure Ingress with custom error annotations
3. **Exercise**: Test 404 and 500 error scenarios

## Lab Exercise 9: Request/Response Modification

**Objective**: Modify headers and rewrite URLs

### Steps:
1. Add custom headers using annotations
2. Configure URL rewriting
3. **Exercise**: Add security headers and test API versioning

## Lab Exercise 10: Monitoring & Observability

**Objective**: Monitor Ingress traffic and performance

### Steps:
1. Enable Ingress metrics
2. Configure logging
3. **Exercise**: Set up Prometheus monitoring for Ingress

## Troubleshooting Guide

### Common Issues:
1. **503 Service Unavailable**: Check if services are running
2. **404 Not Found**: Verify Ingress path configuration
3. **SSL Certificate Issues**: Check TLS secret and certificate validity
4. **DNS Resolution**: Ensure hosts file is configured correctly

### Debugging Commands:
```bash
kubectl get ingress
kubectl describe ingress <ingress-name>
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
kubectl get events --sort-by=.metadata.creationTimestamp
```

## Advanced Scenarios

1. **Multi-cluster Ingress**: Route traffic across multiple clusters
2. **External DNS Integration**: Automatic DNS record management
3. **WAF Integration**: Web Application Firewall with Ingress
4. **Service Mesh Integration**: Istio/Linkerd with Ingress
5. **GitOps Deployment**: Automated Ingress configuration with ArgoCD