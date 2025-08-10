# Ingress Labs - Complete ALB Examples

This directory contains comprehensive ingress examples for AWS Load Balancer Controller (ALB).

## 📚 Lab Overview

### 01. Basic Path Routing
- **File**: `01-basic-path-routing.yaml`
- **Purpose**: Learn fundamental path-based routing
- **Routes**: `/hello` → hello-service, `/info` → info-service
- **Test**: `kubectl apply -f 01-basic-path-routing.yaml`

### 02. Host-Based Routing
- **File**: `02-host-based-routing.yaml`
- **Purpose**: Route traffic based on hostname
- **Hosts**: `hello.local`, `info.local`, `hello-api.local`, `info-api.local`
- **Setup**: Add entries to `/etc/hosts` or use DNS

### 03. TLS/SSL Ingress
- **File**: `03-tls-ssl-ingress.yaml`
- **Purpose**: HTTPS termination with ACM certificates
- **Features**: SSL redirect, certificate management
- **Note**: Update certificate ARN before applying

### 04. Advanced Annotations
- **File**: `04-advanced-annotations.yaml`
- **Purpose**: Advanced ALB features and security
- **Features**: Stickiness, security groups, WAF, custom headers
- **Note**: Update security group and WAF ARNs

### 05. Canary Deployment
- **File**: `05-canary-deployment.yaml`
- **Purpose**: Traffic splitting for gradual rollouts
- **Features**: Header-based routing, weighted traffic
- **Test**: Use `X-Canary: true` header

### 06. Weighted Routing
- **File**: `06-weighted-routing.yaml`
- **Purpose**: Percentage-based traffic distribution
- **Split**: 70% to v1, 30% to v2
- **Use Case**: A/B testing, gradual migrations

### 07. Path Rewriting
- **File**: `07-path-rewriting.yaml`
- **Purpose**: URL redirects and path transformations
- **Example**: `/api/v1/hello` → `/hello`
- **Method**: HTTP 301 redirects

### 08. Custom Responses
- **File**: `08-custom-responses.yaml`
- **Purpose**: Fixed responses without backend services
- **Features**: Custom 404, maintenance mode, health checks
- **Use Case**: Service unavailable scenarios

## 🚀 Quick Start

```bash
# Deploy services first
kubectl apply -f ../k8s/

# Try each ingress lab
kubectl apply -f 01-basic-path-routing.yaml

# Get ALB URL
kubectl get ingress

# Test endpoints
curl http://ALB_URL/hello
curl http://ALB_URL/info
```

## 🧪 Testing Each Lab

### Basic Testing
```bash
ALB_URL=$(kubectl get ingress INGRESS_NAME -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
curl http://$ALB_URL/hello
curl http://$ALB_URL/info
```

### Host-Based Testing
```bash
# Add to /etc/hosts
echo "ALB_IP hello.local info.local" >> /etc/hosts
curl http://hello.local/
curl http://info.local/
```

### Canary Testing
```bash
# Normal request
curl http://$ALB_URL/hello

# Canary request
curl -H "X-Canary: true" http://$ALB_URL/hello
```

## 📝 Notes

- Only one ingress should be active at a time
- Update ARNs and IDs in advanced examples
- Services must be deployed before applying ingress
- ALB takes 2-3 minutes to provision
- Check target group health in AWS console

## 🔧 Troubleshooting

```bash
# Check ingress status
kubectl describe ingress INGRESS_NAME

# Check ALB controller logs
kubectl logs -n kube-system deployment/aws-load-balancer-controller

# Check service endpoints
kubectl get endpoints

# Check target group health in AWS console
```