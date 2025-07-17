# Azure Configuration for Quiz Royale
subscription_id = "d9cfeb3f-6eb4-44b0-a401-85eb32a9c475"  # Your Sheridan College subscription ID
location        = "East US"
environment     = "dev"

# Cluster Configuration
node_count   = 2
cluster_name = "quiz-royale-aks"

# Database Configuration
db_password = "QuizRoyale@2025!"  # Change this to a secure password
db_name     = "quiz_royale"

# Resource Group
resource_group_name = "quiz-royale-rg"

# Tags
tags = {
  project     = "quiz-royale"
  environment = "dev"
  managed-by  = "terraform"
  owner       = "quiz-royale-team"
}
