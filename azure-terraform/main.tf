# Quiz Royale Infrastructure on Microsoft Azure
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

provider "kubernetes" {
  host                   = azurerm_kubernetes_cluster.quiz_royale_cluster.kube_config.0.host
  client_certificate     = base64decode(azurerm_kubernetes_cluster.quiz_royale_cluster.kube_config.0.client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.quiz_royale_cluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.quiz_royale_cluster.kube_config.0.cluster_ca_certificate)
}

# Resource Group for Quiz Royale
resource "azurerm_resource_group" "quiz_royale_rg" {
  name     = "quiz-royale-rg"
  location = var.location
  
  tags = {
    environment = var.environment
    project     = "quiz-royale"
  }
}

# Virtual Network for Quiz Royale
resource "azurerm_virtual_network" "quiz_royale_vnet" {
  name                = "quiz-royale-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.quiz_royale_rg.location
  resource_group_name = azurerm_resource_group.quiz_royale_rg.name

  tags = {
    environment = var.environment
    project     = "quiz-royale"
  }
}

resource "azurerm_subnet" "quiz_royale_subnet" {
  name                 = "quiz-royale-subnet"
  resource_group_name  = azurerm_resource_group.quiz_royale_rg.name
  virtual_network_name = azurerm_virtual_network.quiz_royale_vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# AKS Cluster for Quiz Royale
resource "azurerm_kubernetes_cluster" "quiz_royale_cluster" {
  name                = "quiz-royale-aks"
  location            = azurerm_resource_group.quiz_royale_rg.location
  resource_group_name = azurerm_resource_group.quiz_royale_rg.name
  dns_prefix          = "quiz-royale-aks"

  default_node_pool {
    name       = "default"
    node_count = var.node_count
    vm_size    = "Standard_D2_v2"
    
    vnet_subnet_id = azurerm_subnet.quiz_royale_subnet.id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    service_cidr   = "10.2.0.0/24"
    dns_service_ip = "10.2.0.10"
  }

  tags = {
    environment = var.environment
    project     = "quiz-royale"
  }
}

# Azure Database for PostgreSQL
resource "azurerm_postgresql_flexible_server" "quiz_royale_db" {
  name                   = "quiz-royale-db"
  resource_group_name    = azurerm_resource_group.quiz_royale_rg.name
  location               = azurerm_resource_group.quiz_royale_rg.location
  version                = "14"
  administrator_login    = "quiz_royale_admin"
  administrator_password = var.db_password
  zone                   = "1"

  storage_mb = 32768

  sku_name = "B_Standard_B1ms"

  tags = {
    environment = var.environment
    project     = "quiz-royale"
  }
}

resource "azurerm_postgresql_flexible_server_database" "quiz_royale_database" {
  name      = "quiz_royale"
  server_id = azurerm_postgresql_flexible_server.quiz_royale_db.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# Azure Cache for Redis
resource "azurerm_redis_cache" "quiz_royale_redis" {
  name                = "quiz-royale-redis"
  location            = azurerm_resource_group.quiz_royale_rg.location
  resource_group_name = azurerm_resource_group.quiz_royale_rg.name
  capacity            = 0
  family              = "C"
  sku_name            = "Basic"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"

  tags = {
    environment = var.environment
    project     = "quiz-royale"
  }
}

# Azure Container Registry
resource "azurerm_container_registry" "quiz_royale_acr" {
  name                = "quizroyaleacr${random_string.unique.result}"
  resource_group_name = azurerm_resource_group.quiz_royale_rg.name
  location            = azurerm_resource_group.quiz_royale_rg.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    environment = var.environment
    project     = "quiz-royale"
  }
}

# Random string for unique naming
resource "random_string" "unique" {
  length  = 8
  special = false
  upper   = false
}

# Key Vault for secrets
resource "azurerm_key_vault" "quiz_royale_kv" {
  name                        = "quiz-royale-kv-${random_string.unique.result}"
  location                    = azurerm_resource_group.quiz_royale_rg.location
  resource_group_name         = azurerm_resource_group.quiz_royale_rg.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false

  sku_name = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Get",
    ]

    secret_permissions = [
      "Get",
      "Set",
      "Delete",
    ]

    storage_permissions = [
      "Get",
    ]
  }

  tags = {
    environment = var.environment
    project     = "quiz-royale"
  }
}

# Store secrets in Key Vault
resource "azurerm_key_vault_secret" "db_password" {
  name         = "db-password"
  value        = var.db_password
  key_vault_id = azurerm_key_vault.quiz_royale_kv.id
}

resource "azurerm_key_vault_secret" "redis_password" {
  name         = "redis-password"
  value        = azurerm_redis_cache.quiz_royale_redis.primary_access_key
  key_vault_id = azurerm_key_vault.quiz_royale_kv.id
}

# Data source for current client configuration
data "azurerm_client_config" "current" {}

# Role assignment for AKS to access ACR
resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                = azurerm_container_registry.quiz_royale_acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.quiz_royale_cluster.kubelet_identity[0].object_id
}
