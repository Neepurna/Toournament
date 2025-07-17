# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating CI/CD processes for the Toournament project.

## Workflows

### Frontend CI/CD (`frontend-ci-cd.yml`)
- Triggers on push and pull requests to main branch that modify frontend code
- Builds the frontend application
- Creates a Docker image
- Deploys to production (on push to main only)

### Frontend Tests (`frontend-tests.yml`)
- Triggers on push and pull requests to main branch that modify frontend code
- Runs tests for the frontend application

### Smart Contracts CI (`contracts-ci.yml`)
- Triggers on push and pull requests to main branch that modify contract code
- Compiles the smart contracts
- Runs tests for the smart contracts
- Generates coverage reports (if configured)

### Smart Contracts Security Scan (`contracts-security.yml`)
- Triggers on push and pull requests to main branch that modify contract code
- Also runs on a schedule (every Monday)
- Runs Slither analyzer on the smart contracts
- Uploads a security report as an artifact

### Linting (`lint.yml`)
- Triggers on all push and pull requests to main branch
- Runs ESLint on JavaScript/TypeScript files
- Runs Solhint on Solidity files

### Azure Deploy (`azure-deploy.yml`)
- Deploys the application to Azure
- Runs tests and builds the frontend

### Terraform Deploy (`terraform-deploy.yml`) 
- Deploys infrastructure using Terraform
- Requires Azure credentials

### Kubernetes Deploy (`kubernetes-deploy.yml`)
- Deploys the application to a Kubernetes cluster
- Requires Azure credentials

## Configuration

### Azure Authentication
To enable authentication with Azure, you have two options:

#### Option 1: Federated Credentials (Recommended - More Secure)

This approach uses OpenID Connect (OIDC) to establish trust between GitHub and Azure without storing secrets:

1. **Register an application in Azure AD**:
```bash
# Get subscription ID
az account show --query id -o tsv

# Create an app registration
az ad app create --display-name "GitHub-Toournament-Actions"
```

2. **Get the Application (Client) ID**:
```bash
# Note the appId from the output
APP_ID=$(az ad app list --display-name "GitHub-Toournament-Actions" --query "[].appId" -o tsv)
echo $APP_ID
```

3. **Create service principal for the app**:
```bash
az ad sp create --id $APP_ID
```

4. **Assign contributor role**:
```bash
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az role assignment create --role contributor --assignee $APP_ID --scope /subscriptions/$SUBSCRIPTION_ID
```

5. **Configure federated credentials in Azure portal**:
   - Go to Azure portal → Azure Active Directory → App registrations
   - Select your new app "GitHub-Toournament-Actions"
   - Go to "Certificates & secrets" → "Federated credentials"
   - Add credential: 
     - Scenario: GitHub Actions deploying Azure resources
     - Organization: your-github-org
     - Repository: Toournament
     - Entity type: Branch
     - Branch: main
     - Name: github-federated-identity

6. **Add the following secrets to your GitHub repository**:
   - `AZURE_CLIENT_ID`: The application (client) ID
   - `AZURE_TENANT_ID`: Your Azure tenant ID
   - `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID

#### Option 2: Service Principal with Secret

If you have proper permissions, you can create a service principal with a client secret:

1. **Ask your Azure administrator** to create a service principal and provide you with the credentials:
```bash
az ad sp create-for-rbac --name "GitHubActionSP" --role contributor \
                         --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group}
```

2. **Add the following secrets to your GitHub repository**:
   - `AZURE_CLIENT_ID`: The service principal client ID
   - `AZURE_TENANT_ID`: The tenant ID
   - `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID
   - `AZURE_CLIENT_SECRET`: The service principal client secret

### Docker Registry
To enable pushing Docker images to a registry:

1. Add the following secrets to your GitHub repository:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token
   - `DOCKER_USERNAME`: (Same as DOCKERHUB_USERNAME for backward compatibility)
   - `DOCKER_PASSWORD`: (Same as DOCKERHUB_TOKEN for backward compatibility)

2. Update the `frontend-ci-cd.yml` file to uncomment the Docker login step and update the image tags as needed.

### Deployment
To enable deployment to your production environment:

1. Update the deployment step in the `frontend-ci-cd.yml` file with your specific deployment commands.
2. Add any required secrets to your GitHub repository.

## Adding New Workflows

When adding new workflows, follow these guidelines:
- Name the workflow file descriptively (e.g., `backend-ci.yml`)
- Set appropriate triggers based on file paths
- Include comments to explain complex steps
- Use GitHub secrets for sensitive information
