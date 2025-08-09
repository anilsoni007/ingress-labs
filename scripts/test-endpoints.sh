#!/bin/bash

echo "🧪 Testing all Ingress endpoints..."

BASE_URL="http://localhost"

echo "Testing health endpoints..."
curl -s "$BASE_URL/health" && echo " ✅ Frontend health"
curl -s "$BASE_URL/api/health" && echo " ✅ API Gateway health"
curl -s "$BASE_URL/users/health" && echo " ✅ User Service health"
curl -s "$BASE_URL/products/health" && echo " ✅ Product Service health"
curl -s "$BASE_URL/ws/health" && echo " ✅ WebSocket Service health"
curl -s "$BASE_URL/static/health" && echo " ✅ Static Assets health"

echo ""
echo "Testing API endpoints..."
curl -s "$BASE_URL/api/status" | jq . && echo " ✅ API Gateway status"
curl -s "$BASE_URL/users/api/users" | jq . && echo " ✅ User Service API"
curl -s "$BASE_URL/products/api/products" | jq . && echo " ✅ Product Service API"

echo ""
echo "Testing authentication..."
curl -X POST -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"password"}' \
     "$BASE_URL/api/auth/login" | jq . && echo " ✅ API Gateway auth"

curl -X POST -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}' \
     "$BASE_URL/users/api/auth/login" | jq . && echo " ✅ User Service auth"

echo ""
echo "✅ All tests completed!"