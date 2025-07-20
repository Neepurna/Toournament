#!/bin/bash
# Setup Self-Hosted Azure DevOps Agent
# Run this script to set up a self-hosted agent on your machine

set -e

echo "=========================================="
echo "🤖 Azure DevOps Self-Hosted Agent Setup"
echo "=========================================="

# Variables - Update these with your Azure DevOps details
AZURE_DEVOPS_URL="https://dev.azure.com/baralne"
AZURE_DEVOPS_PROJECT="Toournament"
AGENT_POOL="Default"
AGENT_NAME="local-agent-$(hostname)"

# Create agent directory
AGENT_DIR="$HOME/azdo-agent"
mkdir -p $AGENT_DIR
cd $AGENT_DIR

echo "📁 Agent directory: $AGENT_DIR"

# Download the agent
echo "📥 Downloading Azure DevOps agent..."
if [ ! -f "vsts-agent-linux-x64-3.232.0.tar.gz" ]; then
    wget https://vstsagentpackage.azureedge.net/agent/3.232.0/vsts-agent-linux-x64-3.232.0.tar.gz
fi

# Extract if not already extracted
if [ ! -f "config.sh" ]; then
    echo "📦 Extracting agent..."
    tar zxvf vsts-agent-linux-x64-3.232.0.tar.gz
fi

echo "=========================================="
echo "🔧 Next Steps - Run these commands:"
echo "=========================================="
echo "1. Navigate to agent directory:"
echo "   cd $AGENT_DIR"
echo ""
echo "2. Configure the agent:"
echo "   ./config.sh"
echo ""
echo "   When prompted, enter:"
echo "   - Server URL: $AZURE_DEVOPS_URL"
echo "   - Authentication type: PAT"
echo "   - Personal Access Token: [Get from Azure DevOps Settings > Personal Access Tokens]"
echo "   - Agent pool: $AGENT_POOL"
echo "   - Agent name: $AGENT_NAME"
echo "   - Work folder: press Enter for default"
echo ""
echo "3. Start the agent:"
echo "   ./run.sh"
echo ""
echo "=========================================="
echo "📝 To get Personal Access Token (PAT):"
echo "=========================================="
echo "1. Go to: https://dev.azure.com/baralne/_usersSettings/tokens"
echo "2. Click '+ New Token'"
echo "3. Give it a name like 'Self-Hosted-Agent'"
echo "4. Set expiration (e.g., 90 days)"
echo "5. Scopes: Select 'Agent Pools (read, manage)'"
echo "6. Create and copy the token"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Installing Docker..."
    sudo apt update
    sudo apt install -y docker.io
    sudo usermod -aG docker $USER
    echo "📝 You may need to log out and back in for Docker permissions"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "✅ Prerequisites check complete!"
echo "Node.js version: $(node --version 2>/dev/null || echo 'Not installed')"
echo "Docker version: $(docker --version 2>/dev/null || echo 'Not installed')"
