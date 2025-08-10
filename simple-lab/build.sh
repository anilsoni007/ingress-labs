#!/bin/bash

echo "Building Hello Service..."
cd hello-service
docker build -t asoni007/hello-service:latest .
docker push asoni007/hello-service:latest

echo "Building Info Service..."
cd ../info-service
docker build -t asoni007/info-service:latest .
docker push asoni007/info-service:latest

echo "Build complete!"