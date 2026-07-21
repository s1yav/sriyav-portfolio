#!/bin/bash
# Script to build and run sriyav-portfolio in a local Docker container
set -e

IMAGE_NAME="sriyav-portfolio-local"
CONTAINER_NAME="sriyav-portfolio-container"
PORT=${1:-3000}

# 1. Clean up any existing container with the same name
if [ "$(docker ps -aq -f name=^${CONTAINER_NAME}$)" ]; then
    echo "Stopping and removing existing container: ${CONTAINER_NAME}..."
    docker stop ${CONTAINER_NAME} >/dev/null 2>&1 || true
    docker rm ${CONTAINER_NAME} >/dev/null 2>&1 || true
fi

# 2. Build the Docker image utilizing BuildKit
echo "Building Docker image '${IMAGE_NAME}'..."
DOCKER_BUILDKIT=1 docker build -t ${IMAGE_NAME} .

# 3. Start the container in detached background mode
echo "Starting container on http://localhost:${PORT}..."
docker run -d -p ${PORT}:3000 --name ${CONTAINER_NAME} ${IMAGE_NAME}

# 4. Health check validation
echo "Waiting for server to bootstrap..."
sleep 3
if curl -s -I http://localhost:${PORT} | grep -q "HTTP/.* 200"; then
    echo "--------------------------------------------------------"
    echo "SUCCESS: Container is running and active!"
    echo "URL: http://localhost:${PORT}"
    echo "--------------------------------------------------------"
    echo "To stop the container, run: docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}"
else
    echo "--------------------------------------------------------"
    echo "WARNING: Container started but failed the health check."
    echo "Check container logs using: docker logs ${CONTAINER_NAME}"
    echo "--------------------------------------------------------"
fi
