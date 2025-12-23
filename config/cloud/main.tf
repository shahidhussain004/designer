# Terraform Configuration for Designer Marketplace
# =================================================
# Multi-cloud infrastructure as code template for learning purposes.
# This file demonstrates common patterns and best practices.

# ==============================================================================
# TERRAFORM SETTINGS
# ==============================================================================

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # Backend Configuration (uncomment for production)
  # backend "s3" {
  #   bucket         = "designer-marketplace-terraform-state"
  #   key            = "infrastructure/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"
  # }
}

# ==============================================================================
# VARIABLES
# ==============================================================================

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "designer-marketplace"
}

variable "environment" {
  description = "Environment name (development, staging, production)"
  type        = string
  default     = "development"
}

variable "cloud_provider" {
  description = "Primary cloud provider (aws, azure, gcp)"
  type        = string
  default     = "aws"
}

variable "region" {
  description = "Primary region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "enable_high_availability" {
  description = "Enable high availability features"
  type        = bool
  default     = false
}

variable "database_password" {
  description = "Database admin password"
  type        = string
  sensitive   = true
}

# Common Tags
variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "designer-marketplace"
    Environment = "development"
    ManagedBy   = "terraform"
    Team        = "engineering"
  }
}

# ==============================================================================
# LOCAL VALUES
# ==============================================================================

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  
  container_configs = {
    marketplace_service = {
      name   = "marketplace-service"
      cpu    = 256
      memory = 512
      port   = 3000
    }
    messaging_service = {
      name   = "messaging-service"
      cpu    = 128
      memory = 256
      port   = 3001
    }
  }
}

# ==============================================================================
# AWS PROVIDER CONFIGURATION
# ==============================================================================

provider "aws" {
  region = var.region

  default_tags {
    tags = var.common_tags
  }
}

# ==============================================================================
# VPC MODULE (AWS)
# ==============================================================================

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
  count   = var.cloud_provider == "aws" ? 1 : 0

  name = "${local.name_prefix}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.region}a", "${var.region}b", "${var.region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = !var.enable_high_availability
  enable_dns_hostnames   = true
  enable_dns_support     = true

  tags = {
    Name = "${local.name_prefix}-vpc"
  }
}

# ==============================================================================
# ECS CLUSTER (AWS)
# ==============================================================================

resource "aws_ecs_cluster" "main" {
  count = var.cloud_provider == "aws" ? 1 : 0
  name  = "${local.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${local.name_prefix}-cluster"
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  count        = var.cloud_provider == "aws" ? 1 : 0
  cluster_name = aws_ecs_cluster.main[0].name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

# ==============================================================================
# RDS POSTGRESQL (AWS)
# ==============================================================================

resource "aws_db_subnet_group" "main" {
  count      = var.cloud_provider == "aws" ? 1 : 0
  name       = "${local.name_prefix}-db-subnet"
  subnet_ids = module.vpc[0].private_subnets

  tags = {
    Name = "${local.name_prefix}-db-subnet"
  }
}

resource "aws_db_instance" "main" {
  count = var.cloud_provider == "aws" ? 1 : 0

  identifier = "${local.name_prefix}-db"

  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = var.enable_high_availability ? "db.t3.medium" : "db.t3.micro"
  allocated_storage    = 20
  max_allocated_storage = 100
  storage_type         = "gp3"

  db_name  = "designer_marketplace"
  username = "dbadmin"
  password = var.database_password
  port     = 5432

  db_subnet_group_name   = aws_db_subnet_group.main[0].name
  vpc_security_group_ids = [aws_security_group.database[0].id]

  multi_az               = var.enable_high_availability
  publicly_accessible    = false
  deletion_protection    = var.environment == "production"
  skip_final_snapshot    = var.environment != "production"

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  performance_insights_enabled = true
  monitoring_interval         = 60

  tags = {
    Name = "${local.name_prefix}-db"
  }
}

# ==============================================================================
# ELASTICACHE REDIS (AWS)
# ==============================================================================

resource "aws_elasticache_subnet_group" "main" {
  count      = var.cloud_provider == "aws" ? 1 : 0
  name       = "${local.name_prefix}-redis-subnet"
  subnet_ids = module.vpc[0].private_subnets
}

resource "aws_elasticache_replication_group" "main" {
  count = var.cloud_provider == "aws" ? 1 : 0

  replication_group_id = "${local.name_prefix}-redis"
  description          = "Redis cluster for Designer Marketplace"

  node_type                  = "cache.t3.micro"
  num_cache_clusters        = var.enable_high_availability ? 2 : 1
  port                      = 6379
  parameter_group_name      = "default.redis7"
  engine_version            = "7.0"
  automatic_failover_enabled = var.enable_high_availability

  subnet_group_name  = aws_elasticache_subnet_group.main[0].name
  security_group_ids = [aws_security_group.redis[0].id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  tags = {
    Name = "${local.name_prefix}-redis"
  }
}

# ==============================================================================
# SECURITY GROUPS (AWS)
# ==============================================================================

resource "aws_security_group" "alb" {
  count  = var.cloud_provider == "aws" ? 1 : 0
  name   = "${local.name_prefix}-alb-sg"
  vpc_id = module.vpc[0].vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.name_prefix}-alb-sg"
  }
}

resource "aws_security_group" "ecs_tasks" {
  count  = var.cloud_provider == "aws" ? 1 : 0
  name   = "${local.name_prefix}-ecs-sg"
  vpc_id = module.vpc[0].vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb[0].id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.name_prefix}-ecs-sg"
  }
}

resource "aws_security_group" "database" {
  count  = var.cloud_provider == "aws" ? 1 : 0
  name   = "${local.name_prefix}-db-sg"
  vpc_id = module.vpc[0].vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks[0].id]
  }

  tags = {
    Name = "${local.name_prefix}-db-sg"
  }
}

resource "aws_security_group" "redis" {
  count  = var.cloud_provider == "aws" ? 1 : 0
  name   = "${local.name_prefix}-redis-sg"
  vpc_id = module.vpc[0].vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks[0].id]
  }

  tags = {
    Name = "${local.name_prefix}-redis-sg"
  }
}

# ==============================================================================
# S3 BUCKETS (AWS)
# ==============================================================================

resource "aws_s3_bucket" "assets" {
  count  = var.cloud_provider == "aws" ? 1 : 0
  bucket = "${local.name_prefix}-assets-${random_id.bucket_suffix[0].hex}"

  tags = {
    Name = "${local.name_prefix}-assets"
  }
}

resource "aws_s3_bucket_versioning" "assets" {
  count  = var.cloud_provider == "aws" ? 1 : 0
  bucket = aws_s3_bucket.assets[0].id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  count  = var.cloud_provider == "aws" ? 1 : 0
  bucket = aws_s3_bucket.assets[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "random_id" "bucket_suffix" {
  count       = var.cloud_provider == "aws" ? 1 : 0
  byte_length = 4
}

# ==============================================================================
# APPLICATION LOAD BALANCER (AWS)
# ==============================================================================

resource "aws_lb" "main" {
  count              = var.cloud_provider == "aws" ? 1 : 0
  name               = "${local.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb[0].id]
  subnets            = module.vpc[0].public_subnets

  enable_deletion_protection = var.environment == "production"

  tags = {
    Name = "${local.name_prefix}-alb"
  }
}

resource "aws_lb_target_group" "main" {
  count       = var.cloud_provider == "aws" ? 1 : 0
  name        = "${local.name_prefix}-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = module.vpc[0].vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    timeout             = 5
    unhealthy_threshold = 5
  }

  tags = {
    Name = "${local.name_prefix}-tg"
  }
}

# ==============================================================================
# OUTPUTS
# ==============================================================================

output "vpc_id" {
  description = "VPC ID"
  value       = var.cloud_provider == "aws" ? module.vpc[0].vpc_id : null
}

output "database_endpoint" {
  description = "Database endpoint"
  value       = var.cloud_provider == "aws" ? aws_db_instance.main[0].endpoint : null
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = var.cloud_provider == "aws" ? aws_elasticache_replication_group.main[0].primary_endpoint_address : null
  sensitive   = true
}

output "load_balancer_dns" {
  description = "Load balancer DNS name"
  value       = var.cloud_provider == "aws" ? aws_lb.main[0].dns_name : null
}

output "assets_bucket_name" {
  description = "S3 assets bucket name"
  value       = var.cloud_provider == "aws" ? aws_s3_bucket.assets[0].id : null
}
