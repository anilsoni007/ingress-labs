#!/bin/bash

echo "🔧 Setting up hosts for host-based routing..."

# Get Ingress IP
INGRESS_IP=$(kubectl get ingress basic-path-routing -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

if [ -z "$INGRESS_IP" ]; then
    INGRESS_IP="127.0.0.1"
    echo "Using localhost IP. For cloud deployments, update with actual LoadBalancer IP."
fi

echo "Adding entries to /etc/hosts..."
echo "# Ingress Lab entries" | sudo tee -a /etc/hosts
echo "$INGRESS_IP frontend.local" | sudo tee -a /etc/hosts
echo "$INGRESS_IP api.local" | sudo tee -a /etc/hosts
echo "$INGRESS_IP users.local" | sudo tee -a /etc/hosts
echo "$INGRESS_IP products.local" | sudo tee -a /etc/hosts
echo "$INGRESS_IP secure.local" | sudo tee -a /etc/hosts
echo "$INGRESS_IP api-secure.local" | sudo tee -a /etc/hosts

echo "✅ Hosts configured!"
echo ""
echo "You can now access:"
echo "- http://frontend.local"
echo "- http://api.local"
echo "- http://users.local"
echo "- http://products.local"