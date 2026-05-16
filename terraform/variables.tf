variable "app_name" {
  description = "Name of the Azure App Service"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "eastus"
}

variable "node_version" {
  description = "Node.js runtime version for the App Service"
  type        = string
  default     = "20-lts"
}
