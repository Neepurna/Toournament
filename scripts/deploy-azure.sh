#!/bin/bash
set -e

# Azure Quiz Royale Deployment Script

echo "🚀 Starting Azure Quiz Royale deployment..."

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Please run 'az login' first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install it first."
    exit 1
fi

# Navigate to terraform directory
cd terraform

echo "📋 Initializing Terraform..."
terraform init

echo "📋 Planning infrastructure deployment..."
terraform plan -var-file="azure-terraform.tfvars" -var="subscription_id=$(az account show --query id -o tsv)"

echo "🏗️  Deploying infrastructure..."
terraform apply -var-file="azure-terraform.tfvars" -var="subscription_id=$(az account show --query id -o tsv)" -auto-approve

echo "📝 Getting infrastructure outputs..."
RESOURCE_GROUP=$(terraform output -raw resource_group_name)
AKS_CLUSTER_NAME=$(terraform output -raw aks_cluster_name)
DATABASE_FQDN=$(terraform output -raw database_server_fqdn)
REDIS_HOSTNAME=$(terraform output -raw redis_hostname)
ACR_LOGIN_SERVER=$(terraform output -raw acr_login_server)
DATABASE_CONNECTION_STRING=$(terraform output -raw database_connection_string)
REDIS_CONNECTION_STRING=$(terraform output -raw redis_connection_string)

echo "🔑 Getting AKS credentials..."
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER_NAME --overwrite-existing

echo "📦 Building and pushing container images..."
# Build frontend
cd ../frontend
docker build -t $ACR_LOGIN_SERVER/quiz-royale-frontend:latest .

# Build backend (assuming you have a backend directory)
if [ -d "../backend" ]; then
    cd ../backend
    docker build -t $ACR_LOGIN_SERVER/quiz-royale-backend:latest .
fi

# Login to ACR
az acr login --name $(echo $ACR_LOGIN_SERVER | cut -d'.' -f1)

# Push images
docker push $ACR_LOGIN_SERVER/quiz-royale-frontend:latest
if [ -d "../backend" ]; then
    docker push $ACR_LOGIN_SERVER/quiz-royale-backend:latest
fi

echo "🔐 Updating Kubernetes secrets..."
cd ../k8s

# Create namespace if it doesn't exist
kubectl create namespace quiz-royale --dry-run=client -o yaml | kubectl apply -f -

# Update secrets with actual values
kubectl create secret generic quiz-royale-secrets \
    --from-literal=DATABASE_URL="$DATABASE_CONNECTION_STRING" \
    --from-literal=REDIS_URL="$REDIS_CONNECTION_STRING" \
    --from-literal=JWT_SECRET="$(openssl rand -base64 32)" \
    --namespace=quiz-royale \
    --dry-run=client -o yaml | kubectl apply -f -

echo "🚀 Deploying applications to Kubernetes..."
# Update image references in deployment files
sed -i "s|IMAGE_PLACEHOLDER|$ACR_LOGIN_SERVER/quiz-royale-frontend:latest|g" frontend-deployment.yaml
sed -i "s|IMAGE_PLACEHOLDER|$ACR_LOGIN_SERVER/quiz-royale-backend:latest|g" backend-deployment.yaml

# Apply Kubernetes manifests
kubectl apply -f namespace.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

echo "📊 Checking deployment status..."
kubectl get pods -n quiz-royale
kubectl get services -n quiz-royale

echo "✅ Deployment completed successfully!"
echo ""
echo "🔗 Access your application:"
echo "   Frontend: http://$(kubectl get service quiz-royale-frontend-service -n quiz-royale -o jsonpath='{.status.loadBalancer.ingress[0].ip}')"
echo ""
echo "📋 Useful commands:"
echo "   Check pods: kubectl get pods -n quiz-royale"
echo "   Check services: kubectl get services -n quiz-royale"
echo "   View logs: kubectl logs -f deployment/quiz-royale-frontend -n quiz-royale"
echo "   Get AKS credentials: az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER_NAME"
