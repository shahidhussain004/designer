# Production Deployment Guide

## 📋 Prerequisites

1. **Server Requirements**:
   - Ubuntu 22.04 LTS (recommended)
   - 4 CPU cores minimum
   - 8GB RAM minimum
   - 50GB SSD storage
   - Docker & Docker Compose installed

2. **Domain & DNS**:
   - Domain name configured
   - DNS A records pointing to server IP
   - SSL/TLS certificate (Let's Encrypt recommended)

3. **Accounts**:
   - Stripe account with API keys
   - SMTP provider for email (optional)
   - Monitoring tools configured

---

## 🚀 Step-by-Step Deployment

### Step 1: Clone Repository

```bash
git clone https://github.com/yourorg/designer-marketplace.git
cd designer-marketplace
```

### Step 2: Configure Environment Variables

```bash
# Copy template and edit with production values
cd config
cp env.production.template .env.production

# Edit with your production secrets
nano .env.production
```

**Critical values to change**:
- `DB_PASSWORD`: Strong database password
- `MONGO_PASSWORD`: Strong MongoDB password
- `JWT_SECRET`: Generate with `openssl rand -base64 64`
- `STRIPE_API_KEY`: From Stripe dashboard
- `STRIPE_WEBHOOK_SECRET`: From Stripe webhook configuration
- `GRAFANA_PASSWORD`: Strong admin password
- `DOMAIN`: Your actual domain name
- `EMAIL`: Your email for Let's Encrypt

### Step 3: SSL Certificate Setup

#### Option A: Let's Encrypt (Automated)

```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com \
    --email admin@yourdomain.com --agree-tos --no-eff-email

# Certificates will be in /etc/letsencrypt/live/yourdomain.com/
# Copy them to config/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem config/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem config/ssl/
```

#### Option B: Self-Signed (Development/Testing Only)

```bash
cd config/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout privkey.pem -out fullchain.pem
```

### Step 4: Configure Nginx

```bash
# Edit nginx.prod.conf with your domain
nano config/nginx.prod.conf

# Replace yourdomain.com with your actual domain
```

### Step 5: Build Application

```bash
cd ../services/marketplace-service

# Build JAR (requires Maven & JDK 21)
mvn clean package -DskipTests

# Or build Docker image directly (recommended)
docker build -t marketplace-api:latest .
```

### Step 6: Start Services

```bash
cd ../../config

# Load environment variables
export $(cat .env.production | xargs)

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Step 7: Database Initialization

```bash
# Flyway migrations run automatically on startup
# Check logs to ensure migrations succeeded
docker logs marketplace-api

# You should see:
# "Successfully applied X migrations"
```

### Step 8: Health Check

```bash
# Test health endpoint
curl https://yourdomain.com/actuator/health

# Expected response:
# {"status":"UP","components":{"db":{"status":"UP"},...}}
```

### Step 9: Monitoring Setup

Access Grafana:
```
https://yourdomain.com:3001
Username: admin
Password: <GRAFANA_PASSWORD from .env.production>
```

---

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Enable firewall (UFW recommended)
- [ ] Configure automatic security updates
- [ ] Set up backup strategy for databases
- [ ] Enable monitoring and alerting
- [ ] Review and update CORS allowed origins
- [ ] Set up log rotation
- [ ] Enable HTTPS-only (HSTS headers)
- [ ] Configure rate limiting
- [ ] Set up intrusion detection (fail2ban)

### Firewall Configuration

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3001/tcp  # Grafana (restrict to known IPs if possible)
sudo ufw enable
```

---

## 📊 Monitoring

### Prometheus Metrics

Available at: `http://yourdomain.com/actuator/prometheus`

Key metrics:
- `http_server_requests_seconds`: API response times
- `jvm_memory_used_bytes`: Memory usage
- `hikari_connections_active`: Database connection pool
- `system_cpu_usage`: CPU utilization

### Grafana Dashboards

Pre-configured dashboards:
1. **Application Overview**: API health, response times, error rates
2. **JVM Metrics**: Memory, GC, threads
3. **Database Metrics**: Connection pool, query performance
4. **System Metrics**: CPU, memory, disk

---

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Build with Maven
        run: mvn clean package -DskipTests
      
      - name: Build Docker image
        run: docker build -t marketplace-api:${{ github.sha }} services/marketplace-service
      
      - name: Push to registry
        run: |
          docker tag marketplace-api:${{ github.sha }} your-registry/marketplace-api:latest
          docker push your-registry/marketplace-api:latest
      
      - name: Deploy to server
        run: |
          ssh user@your-server "cd /opt/marketplace && docker-compose pull && docker-compose up -d"
```

---

## 🗄️ Backup Strategy

### Database Backups

```bash
# PostgreSQL backup
docker exec marketplace-postgres pg_dump -U marketplace_user marketplace_db > backup_$(date +%Y%m%d).sql

# MongoDB backup
docker exec marketplace-mongodb mongodump --uri="mongodb://mongo_user:password@localhost:27017/lms_db" --out=/backup

# Automated daily backups (cron)
0 2 * * * /opt/marketplace/scripts/backup.sh
```

### Restore from Backup

```bash
# PostgreSQL restore
docker exec -i marketplace-postgres psql -U marketplace_user marketplace_db < backup_20240101.sql

# MongoDB restore
docker exec marketplace-mongodb mongorestore --uri="mongodb://mongo_user:password@localhost:27017/lms_db" /backup/lms_db
```

---

## 🔧 Troubleshooting

### Application won't start

```bash
# Check logs
docker logs marketplace-api

# Common issues:
# - Database connection failed: Check DB_PASSWORD
# - Port already in use: Change SERVER_PORT
# - Out of memory: Increase container memory limits
```

### High memory usage

```bash
# Adjust JVM heap size in Dockerfile:
ENV JAVA_OPTS="-Xms512m -Xmx1024m ..."
```

### Slow database queries

```bash
# Check PostgreSQL logs
docker logs marketplace-postgres

# Add indexes if needed via Flyway migration
```

---

## 📈 Scaling

### Horizontal Scaling

```yaml
# docker-compose.prod.yml
marketplace-api:
  deploy:
    replicas: 3
```

### Load Balancer

Configure Nginx for load balancing:

```nginx
upstream marketplace_backend {
    server marketplace-api-1:8080;
    server marketplace-api-2:8080;
    server marketplace-api-3:8080;
}
```

---

## 📞 Support

For issues:
1. Check logs: `docker-compose logs -f marketplace-api`
2. Review health check: `/actuator/health`
3. Check metrics: Grafana dashboards
4. Contact: support@yourdomain.com
