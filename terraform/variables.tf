variable "app_name" {
  description = "The name of the App Service"
  type        = string
}

variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
}

variable "location" {
  description = "The Azure region for all resources"
  type        = string
  default     = "eastus"
}

variable "node_version" {
  description = "The Node.js version for the App Service"
  type        = string
  default     = "20-lts"
}
