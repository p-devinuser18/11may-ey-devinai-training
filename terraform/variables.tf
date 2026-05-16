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
  description = "Node.js version for the App Service runtime"
  type        = string
  default     = "20-lts"
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, production)"
  type        = string
  default     = "dev"
}

variable "project" {
  description = "Project name for resource tagging"
  type        = string
  default     = "devinai-training"
}
