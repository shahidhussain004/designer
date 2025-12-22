# Designer Marketplace - Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the Designer Marketplace platform.

## Directory Structure

```
k8s/
├── namespace.yaml          # Namespace definition
├── configmap.yaml          # Configuration settings
├── secrets.yaml            # Sensitive credentials (use sealed-secrets in prod)
├── databases.yaml          # PostgreSQL, MongoDB, Redis StatefulSets
├── marketplace-service.yaml # Main Java/Spring Boot service
├── lms-service.yaml        # .NET 8 LMS service
├── messaging-service.yaml  # Go messaging service
├── ingress.yaml            # Ingress with TLS
├── hpa.yaml                # Horizontal Pod Autoscalers
└── README.md               # This file
```

## Prerequisites

- Kubernetes 1.28+
- kubectl configured
- NGINX Ingress Controller
- cert-manager (for TLS)
- Container registry access (GHCR)

## Quick Start

### 1. Create Image Pull Secret

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  --namespace=designer-marketplace
```

### 2. Update Secrets

Edit `secrets.yaml` with your production credentials:

```bash
# Never commit real secrets! Use sealed-secrets or external secrets manager
kubectl apply -f secrets.yaml
```

### 3. Deploy Everything

```bash
# Apply in order
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f databases.yaml
kubectl apply -f marketplace-service.yaml
kubectl apply -f lms-service.yaml
kubectl apply -f messaging-service.yaml
kubectl apply -f hpa.yaml
kubectl apply -f ingress.yaml
```

Or use kustomize:

```bash
kubectl apply -k .
```

### 4. Verify Deployment

```bash
# Check all pods
kubectl get pods -n designer-marketplace

# Check services
kubectl get svc -n designer-marketplace

# Check ingress
kubectl get ingress -n designer-marketplace

# View logs
kubectl logs -f deployment/marketplace-service -n designer-marketplace
```

## Production Considerations

### Secrets Management

**Do NOT** commit real secrets to git. Use one of:

- **Sealed Secrets**: Encrypt secrets for safe storage in git
- **External Secrets Operator**: Sync from AWS Secrets Manager, Azure Key Vault, etc.
- **Vault**: HashiCorp Vault for secrets management

```bash
# Install sealed-secrets
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
helm install sealed-secrets sealed-secrets/sealed-secrets
```

### Managed Databases

For production, use managed database services:

- **PostgreSQL**: AWS RDS, Azure Database, GCP Cloud SQL
- **MongoDB**: MongoDB Atlas
- **Redis**: AWS ElastiCache, Azure Cache for Redis

Update connection strings in `configmap.yaml` accordingly.

### Monitoring Stack

Deploy Prometheus and Grafana for monitoring:

```bash
# Install Prometheus Operator
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace
```

### GitOps with ArgoCD

For GitOps deployment:

```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Create Application
cat <<EOF | kubectl apply -f -
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: designer-marketplace
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/designer.git
    targetRevision: main
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: designer-marketplace
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
EOF
```

## Scaling

### Manual Scaling

```bash
kubectl scale deployment/marketplace-service --replicas=5 -n designer-marketplace
```

### HPA Configuration

HPAs are configured to scale based on CPU/memory:

- `marketplace-service`: 2-10 replicas
- `lms-service`: 2-6 replicas
- `messaging-service`: 2-8 replicas

## Troubleshooting

### Pod Not Starting

```bash
kubectl describe pod <pod-name> -n designer-marketplace
kubectl logs <pod-name> -n designer-marketplace
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
kubectl run -it --rm pg-test --image=postgres:15 --restart=Never \
  --namespace=designer-marketplace -- \
  psql -h postgres-service -U marketplace_user -d marketplace_db
```

### Check Events

```bash
kubectl get events -n designer-marketplace --sort-by='.lastTimestamp'
```

## Resource Requirements

| Service | Min CPU | Max CPU | Min Memory | Max Memory |
|---------|---------|---------|------------|------------|
| marketplace-service | 250m | 1000m | 512Mi | 1Gi |
| lms-service | 100m | 500m | 256Mi | 512Mi |
| messaging-service | 50m | 250m | 64Mi | 256Mi |
| PostgreSQL | 100m | 500m | 256Mi | 1Gi |
| MongoDB | 100m | 500m | 256Mi | 1Gi |
| Redis | 50m | 200m | 64Mi | 256Mi |

## Cleanup

```bash
kubectl delete namespace designer-marketplace
```
