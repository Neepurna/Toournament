output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.quiz_royale_rg.name
}

output "aks_cluster_name" {
  description = "Name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.quiz_royale_cluster.name
}

output "aks_cluster_fqdn" {
  description = "FQDN of the AKS cluster"
  value       = azurerm_kubernetes_cluster.quiz_royale_cluster.fqdn
}

output "database_server_name" {
  description = "Name of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.quiz_royale_db.name
}

output "database_server_fqdn" {
  description = "FQDN of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.quiz_royale_db.fqdn
}

output "database_name" {
  description = "Name of the PostgreSQL database"
  value       = azurerm_postgresql_flexible_server_database.quiz_royale_database.name
}

output "redis_hostname" {
  description = "Redis cache hostname"
  value       = azurerm_redis_cache.quiz_royale_redis.hostname
}

output "redis_port" {
  description = "Redis cache port"
  value       = azurerm_redis_cache.quiz_royale_redis.port
}

output "acr_login_server" {
  description = "Login server for the Container Registry"
  value       = azurerm_container_registry.quiz_royale_acr.login_server
}

output "acr_admin_username" {
  description = "Admin username for the Container Registry"
  value       = azurerm_container_registry.quiz_royale_acr.admin_username
  sensitive   = true
}

output "acr_admin_password" {
  description = "Admin password for the Container Registry"
  value       = azurerm_container_registry.quiz_royale_acr.admin_password
  sensitive   = true
}

output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = azurerm_key_vault.quiz_royale_kv.name
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.quiz_royale_kv.vault_uri
}

output "kube_config" {
  description = "Kubernetes configuration"
  value       = azurerm_kubernetes_cluster.quiz_royale_cluster.kube_config_raw
  sensitive   = true
}

# Connection strings and environment variables for applications
output "database_connection_string" {
  description = "Database connection string"
  value       = "postgresql://quiz_royale_admin:${var.db_password}@${azurerm_postgresql_flexible_server.quiz_royale_db.fqdn}:5432/${azurerm_postgresql_flexible_server_database.quiz_royale_database.name}"
  sensitive   = true
}

output "redis_connection_string" {
  description = "Redis connection string"
  value       = "redis://:${azurerm_redis_cache.quiz_royale_redis.primary_access_key}@${azurerm_redis_cache.quiz_royale_redis.hostname}:${azurerm_redis_cache.quiz_royale_redis.port}"
  sensitive   = true
}
