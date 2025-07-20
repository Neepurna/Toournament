#!/bin/bash
# Deploy the latest Docker image to AKS
# Run this script after the Azure DevOps pipeline completes

set -e

# Variables (update these as needed)
DOCKER_IMAGE="neepurna/tournament-frontend:latest"
NAMESPACE="tournament-app"
DEPLOYMENT_NAME="tournament-frontend"

echo "=========================================="
echo "🚀 Deploying Tournament Frontend"
echo "=========================================="
echo "Docker Image: $DOCKER_IMAGE"
echo "Namespace: $NAMESPACE"
echo "Deployment: $DEPLOYMENT_NAME"
echo "=========================================="

# Check if kubectl is configured
echo "Checking kubectl configuration..."
kubectl config current-context

# Check if namespace exists, create if not
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
    echo "Creating namespace: $NAMESPACE"
    kubectl create namespace $NAMESPACE
fi

# Update the deployment with new image
echo "Updating deployment with new image..."
kubectl set image deployment/$DEPLOYMENT_NAME tournament-frontend=$DOCKER_IMAGE -n $NAMESPACE

# Wait for rollout to complete
echo "Waiting for deployment to complete..."
kubectl rollout status deployment/$DEPLOYMENT_NAME -n $NAMESPACE

# Show pod status
echo "=========================================="
echo "📋 Current Pod Status:"
echo "=========================================="
kubectl get pods -n $NAMESPACE -l app=tournament-frontend

# Show service status
echo "=========================================="
echo "🌐 Service Status:"
echo "=========================================="
kubectl get service -n $NAMESPACE tournament-frontend-service

echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo "To access the application:"
echo "kubectl port-forward -n $NAMESPACE service/tournament-frontend-service 8080:80"
echo "Then open: http://localhost:8080"
echo "=========================================="
