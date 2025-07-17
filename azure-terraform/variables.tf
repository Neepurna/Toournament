variable "subscription_id" {
  description = "The Azure subscription ID"
  type        = string
  validation {
    condition     = can(regex("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", var.subscription_id))
    error_message = "Subscription ID must be a valid Azure subscription GUID."
  }
}

variable "location" {
  description = "The Azure region for resources"
  type        = string
  default     = "East US"
  validation {
    condition = contains([
      "East US", "East US 2", "West US", "West US 2", "Central US",
      "North Central US", "South Central US", "West Central US",
      "Canada Central", "Canada East", "UK South", "UK West",
      "West Europe", "North Europe", "France Central", "Germany West Central",
      "Switzerland North", "Norway East", "Sweden Central"
    ], var.location)
    error_message = "Location must be a valid Azure region."
  }
}

variable "node_count" {
  description = "Number of nodes in the AKS node pool"
  type        = number
  default     = 2
  validation {
    condition     = var.node_count >= 1 && var.node_count <= 10
    error_message = "Node count must be between 1 and 10."
  }
}

variable "db_password" {
  description = "Password for the PostgreSQL database"
  type        = string
  sensitive   = true
  validation {
    condition     = length(var.db_password) >= 8
    error_message = "Database password must be at least 8 characters long."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "quiz-royale-rg"
}

variable "cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
  default     = "quiz-royale-aks"
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "quiz_royale"
}

variable "allowed_ips" {
  description = "List of IP addresses allowed to access the database"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    project     = "quiz-royale"
    environment = "dev"
    managed-by  = "terraform"
  }
}
