#!/bin/bash
# start-all-local-dev.sh
# Comprehensive script to start all Docker services and both frontend apps
# Usage: ./start-all-local-dev.sh

set -e

echo "🚀 Starting Full Stack Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONFIG_DIR="$SCRIPT_DIR/config"
FRONTEND_ADMIN="$SCRIPT_DIR/frontend/admin-dashboard"
FRONTEND_MARKETPLACE="$SCRIPT_DIR/frontend/marketplace-web"

# Step 1: Start Docker services
echo -e "${BLUE}[1/4] Starting Docker containers...${NC}"
cd "$CONFIG_DIR"

if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}docker-compose not found. Trying 'docker compose'...${NC}"
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

$COMPOSE_CMD down 2>/dev/null || true
echo "   Pulling latest images..."
$COMPOSE_CMD pull --quiet
echo "   Starting services..."
$COMPOSE_CMD up -d --build

echo -e "${GREEN}✓ Docker services started${NC}"
echo ""

# Step 2: Wait for services to be healthy
echo -e "${BLUE}[2/4] Waiting for services to be ready...${NC}"
max_attempts=60
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ API Gateway is healthy${NC}"
        break
    fi
    attempt=$((attempt + 1))
    echo "   Waiting for services... ($attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${YELLOW}⚠ Services might not be fully ready yet, but proceeding...${NC}"
else
    echo -e "${GREEN}✓ All services are ready${NC}"
fi
echo ""

# Step 3: Configure and start frontend apps
echo -e "${BLUE}[3/4] Setting up frontend applications...${NC}"

# Admin Dashboard
if [ ! -f "$FRONTEND_ADMIN/.env" ]; then
    echo "   Creating Admin Dashboard .env"
    cat > "$FRONTEND_ADMIN/.env" << 'EOF'
VITE_API_BASE_URL=http://localhost/api
VITE_MARKETPLACE_API=http://localhost:8080/api
VITE_CONTENT_API=http://localhost:8083/api
VITE_LMS_API=http://localhost:8082/api
VITE_MESSAGING_API=http://localhost:8081/api
VITE_KAFKA_UI_URL=http://localhost:8085
EOF
    echo -e "${GREEN}✓ Admin Dashboard .env created${NC}"
else
    echo "   Admin Dashboard .env already exists"
fi

# Marketplace Web
if [ ! -f "$FRONTEND_MARKETPLACE/.env" ]; then
    echo "   Creating Marketplace Web .env"
    cat > "$FRONTEND_MARKETPLACE/.env" << 'EOF'
VITE_API_BASE_URL=http://localhost/api
VITE_MARKETPLACE_API=http://localhost:8080/api
VITE_CONTENT_API=http://localhost:8083/api
VITE_LMS_API=http://localhost:8082/api
VITE_MESSAGING_API=http://localhost:8081/api
VITE_KAFKA_UI_URL=http://localhost:8085
EOF
    echo -e "${GREEN}✓ Marketplace Web .env created${NC}"
else
    echo "   Marketplace Web .env already exists"
fi

echo ""

# Step 4: Display startup instructions
echo -e "${BLUE}[4/4] Startup Instructions${NC}"
echo ""
echo -e "${GREEN}✓ Docker Backend Services are running!${NC}"
echo ""
echo "Next, start the frontend apps in separate terminals:"
echo ""
echo -e "${YELLOW}Terminal 2 - Admin Dashboard:${NC}"
echo "  cd $FRONTEND_ADMIN"
echo "  npm install  # if needed"
echo "  npm run dev"
echo "  → http://localhost:3000"
echo ""
echo -e "${YELLOW}Terminal 3 - Marketplace Web:${NC}"
echo "  cd $FRONTEND_MARKETPLACE"
echo "  npm install  # if needed"
echo "  npm run dev"
echo "  → http://localhost:3001"
echo ""

# Display service URLs
echo -e "${BLUE}Service URLs:${NC}"
echo "  API Gateway:        http://localhost    (port 80)"
echo "  Marketplace (Java):  http://localhost:8080"
echo "  Messaging (Go):      http://localhost:8081"
echo "  LMS (.NET):          http://localhost:8082"
echo "  Content (Node.js):   http://localhost:8083"
echo ""
echo -e "${BLUE}Tools & Monitoring:${NC}"
echo "  Kafka UI:            http://localhost:8085"
echo "  Prometheus:          http://localhost:9090"
echo "  PostgreSQL CLI:      docker-compose exec postgres psql -U marketplace_user -d marketplace_db"
echo "  MongoDB CLI:         docker-compose exec mongodb mongosh -u mongo_user -p mongo_pass_dev --authenticationDatabase admin"
echo "  Redis CLI:           docker-compose exec redis redis-cli"
echo ""

echo -e "${BLUE}Management Commands:${NC}"
echo "  View all logs:       cd $CONFIG_DIR && $COMPOSE_CMD logs -f"
echo "  View specific logs:  cd $CONFIG_DIR && $COMPOSE_CMD logs -f <service>"
echo "  Stop everything:     cd $CONFIG_DIR && $COMPOSE_CMD stop"
echo "  Restart services:    cd $CONFIG_DIR && $COMPOSE_CMD restart"
echo "  Clean up:            cd $CONFIG_DIR && $COMPOSE_CMD down"
echo ""

echo -e "${GREEN}🎉 Setup complete! Check the terminals for frontend apps.${NC}"
