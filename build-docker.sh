#!/bin/bash

# Exit on any error
set -e

# Define image names
CLIENT_IMAGE_NAME="myapp-client"
SERVER_IMAGE_NAME="myapp-server"

# Build the client Docker image
echo "Building client image..."
docker build -t $CLIENT_IMAGE_NAME ./client

# Build the server Docker image
echo "Building server image..."
docker build -t $SERVER_IMAGE_NAME ./server

echo "Docker images built successfully:"
echo "  Client: $CLIENT_IMAGE_NAME"
echo "  Server: $SERVER_IMAGE_NAME"
