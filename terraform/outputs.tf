output "app_service_url" {
  description = "Default hostname of the Azure App Service"
  value       = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "resource_group_id" {
  description = "ID of the Azure Resource Group"
  value       = azurerm_resource_group.main.id
}
