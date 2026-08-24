# Docker Deployment Guide - QRS Platform

**Version:** 1.0.0  
**Last Updated:** 2026-08-24  
**Target Audience:** DevOps Engineers, System Administrators, Developers

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Local Development](#local-development)
3. [Production Deployment](#production-deployment)
4. [Image Building](#image-building)
5. [Container Management](#container-management)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)
8. [Architecture](#architecture)

---

## Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Git
- 4GB RAM minimum (8GB recommended)
- PostgreSQL client (optional, for debugging)

### 30-Second Setup

```bash
# Clone repository
git clone <repo-url>
cd qrs-app

# Copy environment template
cp .env.example .env.local

# Start application with PostgreSQL
docker-compose -f compose.dev.yml up -d

# Wait for services to be healthy (20-40 seconds)
docker-compose -f compose.dev.yml logs -f app

# Application is ready when you see:
# [app] ready - started server on 0.0.0.0:3000
```

**Access Application:**
- Frontend: http://localhost:3000
- CMS Admin: http://localhost:3000/admin (if exposed)
- Database Admin: http://localhost:8080 (Adminer, optional)

---

## Local Development

### Development Workflow

#### 1. Start Services

```bash
# Start all services (postgres + app)
docker-compose -f compose.dev.yml up -d

# Check service status
docker-compose -f compose.dev.yml ps

# View real-time logs
docker-compose -f compose.dev.yml logs -f app

# View database logs
docker-compose -f compose.dev.yml logs -f postgres
```

#### 2. Rebuild After Code Changes

```bash
# Rebuild app image (source code changes)
docker-compose -f compose.dev.yml up -d --build

# Or rebuild without starting
docker build -t qrs-app:dev .

# Test the image locally
docker run -p 3000:3000 --env-file .env.local qrs-app:dev
```

#### 3. Access Database

**Option A: Using Adminer (UI)**
```bash
# Start with tools profile
docker-compose -f compose.dev.yml --profile tools up -d

# Access at: http://localhost:8080
# Server: postgres
# Username: qrsdev
# Password: qrsdev_password
# Database: qrs_dev
```

**Option B: Using psql (CLI)**
```bash
# Connect to database
docker-compose -f compose.dev.yml exec postgres psql -U qrsdev -d qrs_dev

# Common commands
\dt                           # List tables
\d table_name                 # Describe table
SELECT * FROM users LIMIT 5;  # Query data
```

#### 4. Seed Database

```bash
# Run seed script inside container
docker-compose -f compose.dev.yml exec app npm run seed

# Or run specific seeds
docker-compose -f compose.dev.yml exec app npm run seed:sections
docker-compose -f compose.dev.yml exec app npm run seed:users
```

#### 5. Stop Services

```bash
# Gracefully stop (preserves data)
docker-compose -f compose.dev.yml stop

# Stop and remove containers (preserves volumes)
docker-compose -f compose.dev.yml down

# Complete cleanup (removes everything including volumes)
docker-compose -f compose.dev.yml down -v

# Stop specific service
docker-compose -f compose.dev.yml stop app
docker-compose -f compose.dev.yml stop postgres
```

### Environment Configuration

#### Development `.env.local`

```bash
# Copy template
cp .env.example .env.local

# Edit for your setup
nano .env.local

# Key development values:
NODE_ENV=development
DATABASE_URL=postgresql://qrsdev:qrsdev_password@postgres:5432/qrs_dev
DATABASE_URL_UNPOOLED=postgresql://qrsdev:qrsdev_password@postgres:5432/qrs_dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYLOAD_SECRET=dev-secret-change-in-production
JWT_SECRET=dev-jwt-secret-change-in-production
SESSION_SECRET=dev-session-secret-change-in-production
```

### Volume Management

#### Media Files

```bash
# Media files are mounted from ./frontend/public/media/
# Changes on host are reflected in container in real-time

# Add a test image
cp ~/Desktop/test.png ./frontend/public/media/images/

# Access via API
curl http://localhost:3000/api/media?type=image

# Or via web
# http://localhost:3000/media/images/test.png
```

#### Database Persistence

```bash
# View volume
docker volume ls | grep qrs-postgres

# Inspect volume
docker volume inspect qrs-postgres-dev-data

# Backup database
docker-compose -f compose.dev.yml exec postgres pg_dump -U qrsdev qrs_dev > backup.sql

# Restore database
docker-compose -f compose.dev.yml exec -T postgres psql -U qrsdev qrs_dev < backup.sql
```

### Network Debugging

```bash
# Inspect network
docker network inspect qrs-dev-network

# Test connectivity from app to postgres
docker-compose -f compose.dev.yml exec app nc -zv postgres 5432

# Test connectivity from app to itself
docker-compose -f compose.dev.yml exec app curl http://localhost:3000/api/health
```

---

## Production Deployment

### Prerequisites for Production

- Managed PostgreSQL database (Neon, AWS RDS, etc.)
- Container registry (Docker Hub, ECR, GitHub Container Registry, etc.)
- Orchestration platform (Docker Swarm, Kubernetes, etc.)
- Reverse proxy/load balancer (Nginx, Traefik, etc.)
- SSL/TLS certificate
- Monitoring & logging solution

### Image Building for Production

#### 1. Build & Tag Image

```bash
# Build production image
docker build -t qrs-app:latest .
docker tag qrs-app:latest qrs-app:v1.0.0

# Or with registry
docker build -t docker.io/yourusername/qrs-app:latest .
docker build -t docker.io/yourusername/qrs-app:v1.0.0 .
```

#### 2. Push to Registry

```bash
# Docker Hub
docker push docker.io/yourusername/qrs-app:latest
docker push docker.io/yourusername/qrs-app:v1.0.0

# GitHub Container Registry
docker push ghcr.io/yourusername/qrs-app:latest

# AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag qrs-app:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/qrs-app:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/qrs-app:latest
```

#### 3. Verify Image Size

```bash
# Check image size
docker images | grep qrs-app

# Inspect layers
docker history qrs-app:latest

# Expected size: 500-600MB (optimized multi-stage)
```

### Docker Swarm Deployment

```yaml
# swarm-stack.yml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: qrs_prod
      POSTGRES_USER: qrs_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - qrs-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U qrs_user"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      placement:
        constraints: [node.role == manager]
      restart_policy:
        condition: on-failure

  app:
    image: docker.io/yourusername/qrs-app:latest
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://qrs_user:${DB_PASSWORD}@postgres:5432/qrs_prod
      DATABASE_URL_UNPOOLED: postgresql://qrs_user:${DB_PASSWORD}@postgres:5432/qrs_prod
      NEXT_PUBLIC_SITE_URL: https://qrsrisk.com
      NEXT_PUBLIC_CMS_URL: https://qrsrisk.com
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      JWT_SECRET: ${JWT_SECRET}
      SESSION_SECRET: ${SESSION_SECRET}
    ports:
      - "3000:3000"
    volumes:
      - media-storage:/app/public/media
    networks:
      - qrs-network
    depends_on:
      - postgres
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 10s

  reverse-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    networks:
      - qrs-network
    depends_on:
      - app
    deploy:
      placement:
        constraints: [node.role == manager]

volumes:
  postgres-data:
  media-storage:

networks:
  qrs-network:
    driver: overlay
```

```bash
# Deploy to Swarm
docker stack deploy -c swarm-stack.yml qrs-prod

# Monitor
docker stack ps qrs-prod
docker service logs qrs-prod_app -f

# Update image
docker service update --image docker.io/yourusername/qrs-app:v1.0.1 qrs-prod_app
```

### Kubernetes Deployment

```yaml
# k8s-deployment.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: qrs-config
data:
  NODE_ENV: "production"
  NEXT_PUBLIC_SITE_URL: "https://qrsrisk.com"
  NEXT_PUBLIC_CMS_URL: "https://qrsrisk.com"

---
apiVersion: v1
kind: Secret
metadata:
  name: qrs-secrets
type: Opaque
stringData:
  DATABASE_URL: postgresql://user:password@postgres-service:5432/qrs_prod
  DATABASE_URL_UNPOOLED: postgresql://user:password@postgres-service:5432/qrs_prod
  PAYLOAD_SECRET: "your-secure-payload-secret"
  JWT_SECRET: "your-secure-jwt-secret"
  SESSION_SECRET: "your-secure-session-secret"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qrs-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: qrs-app
  template:
    metadata:
      labels:
        app: qrs-app
    spec:
      containers:
      - name: app
        image: docker.io/yourusername/qrs-app:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: qrs-config
        - secretRef:
            name: qrs-secrets
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 40
          periodSeconds: 30
          timeoutSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 20
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        volumeMounts:
        - name: media
          mountPath: /app/public/media
      volumes:
      - name: media
        emptyDir: {}

---
apiVersion: v1
kind: Service
metadata:
  name: qrs-app-service
spec:
  selector:
    app: qrs-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

```bash
# Deploy to Kubernetes
kubectl apply -f k8s-deployment.yml

# Monitor
kubectl get pods
kubectl logs -f deployment/qrs-app
kubectl describe pod <pod-name>
```

---

## Image Building

### Build Process

```bash
# Build with progress output
docker build --progress=plain -t qrs-app:latest .

# Build with build args (for optimization)
docker build -t qrs-app:latest \
  --build-arg NODE_ENV=production \
  .

# Build for specific platform (useful for M1/ARM Macs)
docker buildx build --platform linux/amd64 -t qrs-app:latest .
```

### Multi-Platform Builds

```bash
# Enable buildx (if not already enabled)
docker buildx create --name multiplatform

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t docker.io/yourusername/qrs-app:latest \
  --push \
  .
```

### Build Optimization

```bash
# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t qrs-app:latest .

# Check build cache
docker builder prune --all

# View image layers
docker history qrs-app:latest --no-trunc --quiet | \
  xargs -I {} docker inspect {} | grep -A 10 'Architecture'
```

---

## Container Management

### Running Containers

#### Standalone Container

```bash
# Run with all required environment variables
docker run -d \
  --name qrs-app \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/qrs \
  -e DATABASE_URL_UNPOOLED=postgresql://user:pass@host:5432/qrs \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_SITE_URL=https://qrsrisk.com \
  -e PAYLOAD_SECRET=your-secret \
  -e JWT_SECRET=your-secret \
  -e SESSION_SECRET=your-secret \
  -v media:/app/public/media \
  --restart unless-stopped \
  --health-cmd="node -e 'require(\"http\").get(\"http://localhost:3000/api/health\", (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})'" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  qrs-app:latest

# View logs
docker logs -f qrs-app

# Stop container
docker stop qrs-app

# Remove container
docker rm qrs-app
```

#### Using Environment File

```bash
# Create .env.prod file
cat > .env.prod << EOF
NODE_ENV=production
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=...
JWT_SECRET=...
SESSION_SECRET=...
EOF

# Run with environment file
docker run -d \
  --name qrs-app \
  -p 3000:3000 \
  --env-file .env.prod \
  -v media:/app/public/media \
  --restart unless-stopped \
  qrs-app:latest
```

### Container Inspection

```bash
# View container status
docker ps -a | grep qrs-app

# View detailed information
docker inspect qrs-app

# View resource usage
docker stats qrs-app

# View recent logs
docker logs --tail 50 qrs-app

# Follow logs in real-time
docker logs -f qrs-app

# View specific time range
docker logs --since 2h qrs-app
```

### Container Maintenance

```bash
# Prune unused images
docker image prune -a

# Prune unused containers
docker container prune

# Prune unused volumes
docker volume prune

# Prune everything unused
docker system prune -a --volumes

# Check disk usage
docker system df
```

---

## Troubleshooting

### Application Won't Start

#### Check Logs
```bash
# Docker Compose
docker-compose -f compose.dev.yml logs app

# Standalone container
docker logs qrs-app
```

#### Common Causes

**1. Database Connection Failed**
```
Error: connect ECONNREFUSED 127.0.0.1:5432

# Solution: Ensure DATABASE_URL is correct and postgres service is running
docker-compose -f compose.dev.yml ps postgres
docker-compose -f compose.dev.yml logs postgres
```

**2. Port Already in Use**
```
Error: listen EADDRINUSE :::3000

# Solution: Change port mapping or stop other service
lsof -i :3000  # Find what's using port 3000
docker run -p 3001:3000 qrs-app:latest  # Use different host port
```

**3. Out of Memory**
```
Error: JavaScript heap out of memory

# Solution: Increase container memory limit or check for memory leak
docker run --memory 1g qrs-app:latest
docker stats qrs-app  # Monitor usage
```

**4. Build Fails**
```
Error: Sharp installation failed

# Solution: Ensure Dockerfile includes build dependencies
# Check that apk add includes: python3 make g++ cairo-dev jpeg-dev pango-dev
docker build --progress=plain -t qrs-app:latest .  # See detailed output
```

### Connectivity Issues

#### Container Can't Reach Database
```bash
# Test connection
docker-compose -f compose.dev.yml exec app \
  node -e "require('pg').Client().connect()"

# Or use direct test
docker-compose -f compose.dev.yml exec app \
  nc -zv postgres 5432

# Check network
docker network inspect qrs-dev-network
```

#### Container Can't Access External APIs
```bash
# Test external connectivity
docker-compose -f compose.dev.yml exec app curl https://google.com

# Check DNS
docker-compose -f compose.dev.yml exec app nslookup google.com

# Check firewall rules
# Ensure Docker is not restricted by host firewall
```

### Health Check Failures

```bash
# View health status
docker inspect qrs-app | grep -A 10 '"Health"'

# Manually test health endpoint
curl http://localhost:3000/api/health

# Check from inside container
docker exec qrs-app curl http://localhost:3000/api/health

# View health check logs
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Performance Issues

#### High CPU Usage
```bash
# Monitor CPU
docker stats --no-stream qrs-app

# Profile application
docker run --cpus 2 qrs-app:latest  # Limit CPU to 2 cores
```

#### High Memory Usage
```bash
# Monitor memory
docker stats qrs-app

# Check for leaks
docker exec qrs-app node -e "console.log(process.memoryUsage())"

# Reduce memory limits to catch leaks
docker run --memory 256m qrs-app:latest
```

### Database Issues

#### Migrations Failed
```bash
# Check database state
docker-compose -f compose.dev.yml exec postgres psql -U qrsdev qrs_dev -c "\dt"

# Rollback and retry
docker-compose -f compose.dev.yml down -v
docker-compose -f compose.dev.yml up -d

# Manual seed
docker-compose -f compose.dev.yml exec app npm run seed
```

#### Corrupt Database
```bash
# Backup current data
docker volume create qrs-postgres-backup
docker run --rm -v qrs-postgres-dev-data:/data -v qrs-postgres-backup:/backup \
  alpine tar -czf /backup/dump.tar.gz -C /data .

# Recreate volume
docker volume rm qrs-postgres-dev-data
docker-compose -f compose.dev.yml up -d postgres

# Restore if needed
docker run --rm -v qrs-postgres-backup:/backup -v qrs-postgres-dev-data:/data \
  alpine tar -xzf /backup/dump.tar.gz -C /data
```

---

## Best Practices

### Security

1. **Use non-root user** ✓ (Dockerfile creates `nextjs` user)
2. **No secrets in images** ✓ (Use runtime environment injection)
3. **Minimal base image** ✓ (alpine Linux)
4. **Regular updates** - Scan images regularly
   ```bash
   docker scan qrs-app:latest
   ```
5. **Secrets management** - Use orchestration platform secret storage
   - Docker Swarm: `docker secret`
   - Kubernetes: `Secret` objects
   - Compose (dev): `.env` file (gitignored)

### Monitoring

```bash
# Set up logging
docker-compose -f compose.dev.yml logs -f

# Structured logging
# Add to app code:
# console.log(JSON.stringify({level: 'info', message: '...', timestamp: new Date()}))

# Use ELK Stack or similar for production
# - Elasticsearch for storage
# - Logstash for processing
# - Kibana for visualization
```

### Resource Management

**Development (compose.dev.yml):**
```yaml
# No resource limits (uses host resources)
```

**Production (swarm/k8s):**
```yaml
# Set resource limits
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

### Updates & Versioning

```bash
# Semantic versioning for images
docker tag qrs-app:latest qrs-app:v1.0.0
docker tag qrs-app:latest qrs-app:1
docker tag qrs-app:latest qrs-app:1.0

# Blue-green deployment
docker service update --image qrs-app:v1.0.1 qrs-prod_app

# Rollback if needed
docker service update --image qrs-app:v1.0.0 qrs-prod_app
```

### Backup Strategy

```bash
# Database backups
docker-compose -f compose.dev.yml exec postgres \
  pg_dump -U qrsdev qrs_dev | gzip > backup-$(date +%Y%m%d).sql.gz

# Restore from backup
gunzip -c backup-20260824.sql.gz | \
  docker-compose -f compose.dev.yml exec -T postgres \
  psql -U qrsdev qrs_dev

# Volume backups
docker run --rm -v qrs-postgres-dev-data:/data -v $(pwd):/backup \
  alpine tar -czf /backup/data-$(date +%Y%m%d).tar.gz -C /data .
```

---

## Architecture

### Container Architecture

```
┌─────────────────────────────────────────────┐
│          Docker Host (localhost)            │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │     Docker Network (qrs-network)    │   │
│  │                                     │   │
│  │  ┌──────────────┐  ┌────────────┐  │   │
│  │  │  postgres    │  │  qrs-app   │  │   │
│  │  │  :5432       │  │  :3000     │  │   │
│  │  │              │  │            │  │   │
│  │  │ DB: qrs_dev  │  │ Next.js +  │  │   │
│  │  │              │  │ Payload    │  │   │
│  │  └──────────────┘  └────────────┘  │   │
│  │                         ↑           │   │
│  │                    (proxies to      │   │
│  │                    :3001 internally)│   │
│  │                                     │   │
│  │  ┌──────────────┐ (optional)        │   │
│  │  │   adminer    │                   │   │
│  │  │   :8080      │                   │   │
│  │  └──────────────┘                   │   │
│  └─────────────────────────────────────┘   │
│           ↑               ↑                 │
│       Browser Access  Database Admin       │
│      localhost:3000   localhost:8080       │
│                                             │
└─────────────────────────────────────────────┘
```

### Data Flow

```
Client Browser
    ↓ HTTP Request
    ↓ (Port 3000)
    ↓
┌─────────────────────────┐
│   Next.js App Server    │ (Container: qrs-app)
│                         │
│ • Public pages          │
│ • API routes            │
│ • /api/payload/* proxy  │ ──────┐
│ • Health check          │       │
└─────────────────────────┘       │
    ↓                              │
    ↓ (Response to client)         │
    ↓                              │
Client Browser                    │
                                   │
                                   │ (Internal TCP)
                                   │ (Port 3001)
                                   ↓
                          ┌─────────────────────┐
                          │ Payload CMS Server  │
                          │ (Inside qrs-app     │
                          │  container)         │
                          │                     │
                          │ • API endpoints     │
                          │ • Admin interface   │
                          │ • Auth              │
                          └─────────────────────┘
                                   ↓
                                   ↓ (SQL queries)
                                   ↓
                          ┌─────────────────────┐
                          │    PostgreSQL       │
                          │ (Container: postgres)
                          │                     │
                          │ Database: qrs_dev   │
                          └─────────────────────┘
```

---

## Common Tasks

### Backup Before Major Changes
```bash
# Full backup
docker-compose -f compose.dev.yml down
docker volume create qrs-backup-$(date +%Y%m%d)
docker run --rm -v qrs-postgres-dev-data:/source -v qrs-backup-$(date +%Y%m%d):/dest \
  alpine cp -r /source/* /dest/

# Resume
docker-compose -f compose.dev.yml up -d
```

### Monitor Application
```bash
# Real-time monitoring
watch -n 1 'docker stats --no-stream qrs-app'

# Weekly cleanup
docker system prune -a --volumes

# Security scan
docker scan qrs-app:latest
trivy image qrs-app:latest
```

### Deploy New Version
```bash
# Build new version
docker build -t qrs-app:v1.0.1 .

# Test locally
docker run -p 3000:3000 --env-file .env.prod qrs-app:v1.0.1

# Push to registry
docker push docker.io/yourusername/qrs-app:v1.0.1

# Update service (Swarm example)
docker service update --image docker.io/yourusername/qrs-app:v1.0.1 qrs-prod_app
```

---

## Support

For issues or questions:

1. Check logs: `docker-compose logs -f app`
2. Review DOCKER_AUDIT.md for architecture details
3. Check GitHub Issues: <repo-url>/issues
4. Contact: devops@example.com

---

## References

- Docker Documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Kubernetes: https://kubernetes.io/docs/
- PostgreSQL: https://www.postgresql.org/docs/
- Next.js: https://nextjs.org/docs
- Payload CMS: https://payloadcms.com/docs
