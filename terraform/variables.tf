variable "environment" {
  description = "Environment we're in. (Dev, Prod, Etc)"
  type        = string
  default     = "dev"
}

variable "azs" {
  description = "List of AZs for subnets to be placed in."
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet cidrs for VPC"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet cidrs for VPC"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "allowed_ips" {
  description = "Enable NAT gateway for VPC"
  type        = list(string)
  default     = ["noop"]
}

variable "app_name" {
  description = "Name of the Application"
  type        = string
  default     = "noop"
}

variable "app_name_hyphens" {
  description = "Should match the app name exactly, but convert underscores to hyphens. Used due to AWS constraints."
  type        = string
  default     = "noop"
}


variable "alb_tls_cert_arn" {
  description = "ARN for the HTTPS ACM Certification"
  type        = string
  default     = "noop"
}
