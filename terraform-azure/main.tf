provider "azurerm" {
 features {}
 subscription_id = "cd431887-fdbe-4de1-9c26-221ab56d3f61"
}
resource "azurerm_resource_group" "aks_rg" {
 name = "aks-lab"
 location = "Canada Central"
}
resource "azurerm_kubernetes_cluster" "aks" {
 name = "aks-lab-cluster"
 location = azurerm_resource_group.aks_rg.location
 resource_group_name = azurerm_resource_group.aks_rg.name
 dns_prefix = "akslab"
 default_node_pool {
 name = "default"
 node_count = 1
 vm_size = "Standard_DS2_v2"
 }
 identity {
 type = "SystemAssigned"
 }
}