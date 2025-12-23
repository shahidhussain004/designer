# Cloud Infrastructure Configuration

> **Learning Purpose Only**: These configurations demonstrate cloud infrastructure patterns and are designed for educational purposes. Thoroughly review and adapt for production environments.

## Overview

This directory contains cloud infrastructure configuration files for deploying the Designer Marketplace platform across multiple cloud providers.

## Files Structure

```
config/cloud/
├── README.md           # This file
├── aws.env             # AWS environment configuration
├── azure.env           # Azure environment configuration
├── gcp.env             # Google Cloud Platform configuration
├── main.tf             # Terraform Infrastructure as Code
└── kubernetes.yaml     # Kubernetes deployment manifests
```

## Quick Start

### 1. Choose Your Cloud Provider

| Provider | Best For | Key Services |
|----------|----------|--------------|
| **AWS** | Enterprise workloads, mature ecosystem | ECS, RDS, ElastiCache, S3 |
| **Azure** | Microsoft integration, hybrid cloud | Container Apps, PostgreSQL, Redis Cache |
| **GCP** | ML/AI workloads, Kubernetes | Cloud Run, Cloud SQL, Memorystore |

### 2. Prerequisites

- **Terraform** >= 1.6.0 (for IaC deployments)
- **kubectl** >= 1.28 (for Kubernetes deployments)
- Cloud CLI tools:
  - AWS: `aws-cli`
  - Azure: `az`
  - GCP: `gcloud`

### 3. Configuration Steps

#### AWS Deployment

```bash
# Configure AWS credentials
aws configure

# Copy and customize environment file
cp aws.env .env.aws
# Edit .env.aws with your values

# Initialize Terraform
cd config/cloud
terraform init

# Plan deployment
terraform plan -var-file=terraform.tfvars

# Apply infrastructure
terraform apply -var-file=terraform.tfvars
```

#### Azure Deployment

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription <subscription-id>

# Create resource group
az group create --name rg-designer-marketplace --location eastus

# Deploy using Azure CLI or Terraform
```

#### GCP Deployment

```bash
# Authenticate with GCP
gcloud auth login
gcloud config set project designer-marketplace-dev

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  sql-component.googleapis.com \
  redis.googleapis.com \
  storage.googleapis.com

# Deploy using Cloud CLI or Terraform
```

## Architecture Patterns

### Microservices Architecture

```
                    ┌─────────────────┐
                    │   Load Balancer │
                    │   (ALB/Azure FD/│
                    │    Cloud LB)    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
    ┌─────────▼────┐  ┌──────▼──────┐  ┌────▼────────┐
    │  Marketplace │  │  Messaging  │  │   Frontend  │
    │   Service    │  │   Service   │  │   (Static)  │
    └──────┬───────┘  └──────┬──────┘  └─────────────┘
           │                 │
    ┌──────┴────────────────┴──────┐
    │         Shared Services       │
    │  ┌─────────┐  ┌─────────────┐ │
    │  │PostgreSQL│  │    Redis    │ │
    │  │   RDS   │  │ ElastiCache │ │
    │  └─────────┘  └─────────────┘ │
    └───────────────────────────────┘
```

### Security Layers

1. **Network Security**
   - VPC/VNet with private subnets
   - Security groups/NSGs
   - NAT gateways for outbound traffic

2. **Application Security**
   - WAF (AWS WAF / Azure WAF / Cloud Armor)
   - DDoS protection
   - Rate limiting

3. **Data Security**
   - Encryption at rest (AES-256)
   - Encryption in transit (TLS 1.3)
   - Secret management (AWS Secrets Manager / Key Vault / Secret Manager)

## Environment-Specific Configurations

### Development

| Resource | Configuration |
|----------|---------------|
| Database | Single instance, minimal storage |
| Cache | Single node, basic tier |
| Containers | 1-2 replicas, low resources |
| Monitoring | Basic metrics |

### Staging

| Resource | Configuration |
|----------|---------------|
| Database | Single instance, moderate storage |
| Cache | 2 nodes, standard tier |
| Containers | 2-3 replicas, moderate resources |
| Monitoring | Full metrics, basic alerting |

### Production

| Resource | Configuration |
|----------|---------------|
| Database | Multi-AZ, auto-scaling storage |
| Cache | Cluster mode, high availability |
| Containers | 3+ replicas, auto-scaling |
| Monitoring | Full observability stack |

## Cost Estimation

> Estimates based on us-east-1 / East US / us-central1 regions

### Development Environment (~$100-200/month)

| Service | AWS | Azure | GCP |
|---------|-----|-------|-----|
| Compute | ECS Fargate ($30) | Container Apps ($25) | Cloud Run ($20) |
| Database | RDS t3.micro ($15) | Flex Server B1ms ($15) | Cloud SQL ($15) |
| Cache | ElastiCache t3.micro ($12) | Redis Basic ($15) | Memorystore Basic ($15) |
| Storage | S3 ($5) | Blob Storage ($5) | Cloud Storage ($5) |

### Production Environment (~$500-1500/month)

Varies significantly based on:
- Traffic volume
- Data storage needs
- High availability requirements
- Compliance requirements

## Kubernetes Deployment

### Deploy to Kubernetes Cluster

```bash
# Create namespace
kubectl apply -f kubernetes.yaml

# Verify deployment
kubectl get pods -n designer-marketplace

# Check service status
kubectl get services -n designer-marketplace

# View logs
kubectl logs -f deployment/marketplace-service -n designer-marketplace
```

### Scaling

```bash
# Manual scaling
kubectl scale deployment marketplace-service --replicas=5 -n designer-marketplace

# HPA is configured for automatic scaling based on CPU/Memory
kubectl get hpa -n designer-marketplace
```

## Monitoring & Observability

### Metrics Collection

- **Prometheus**: Container and application metrics
- **Grafana**: Visualization dashboards
- **CloudWatch/Azure Monitor/Cloud Monitoring**: Cloud-native metrics

### Logging

- Centralized logging with log aggregation
- Structured JSON logs
- Log retention policies (30-90 days)

### Alerting

| Alert Type | Threshold | Severity |
|------------|-----------|----------|
| CPU > 80% | 5 minutes | Warning |
| Memory > 80% | 5 minutes | Warning |
| Error Rate > 5% | 1 minute | Critical |
| Response Time > 5s | 5 minutes | Warning |
| Pod Restart | Any | Warning |

## Security Best Practices

1. **Never commit secrets** - Use secret management services
2. **Use least privilege** - Minimal IAM/RBAC permissions
3. **Enable encryption** - At rest and in transit
4. **Regular updates** - Keep containers and dependencies updated
5. **Network isolation** - Use private subnets and security groups
6. **Audit logging** - Enable CloudTrail/Activity Log/Audit Logs

## Disaster Recovery

### Backup Strategy

| Component | Frequency | Retention |
|-----------|-----------|-----------|
| Database | Daily + Transaction logs | 7-30 days |
| Redis | Hourly snapshots | 24 hours |
| Config/Secrets | On change | Indefinite |
| Container Images | On build | 30 days |

### Recovery Time Objectives

| Environment | RTO | RPO |
|-------------|-----|-----|
| Development | 4 hours | 24 hours |
| Staging | 2 hours | 4 hours |
| Production | 15 minutes | 5 minutes |

## Additional Resources

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/)
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform Documentation](https://www.terraform.io/docs/)

## Support

For infrastructure questions or issues:
1. Check the documentation above
2. Review cloud provider documentation
3. Create an issue in the project repository
