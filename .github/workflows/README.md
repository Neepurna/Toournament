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

## Configuration

### Docker Registry
To enable pushing Docker images to a registry:

1. Add the following secrets to your GitHub repository:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token

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
