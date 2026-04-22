# Deployment Guide

Complete guide for deploying PLAQUE to production environments.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Heroku Deployment](#heroku-deployment)
4. [AWS Deployment](#aws-deployment)
5. [DigitalOcean Deployment](#digitalocean-deployment)
6. [Docker Container Registry](#docker-container-registry)
7. [Database Setup](#database-setup)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Monitoring & Logging](#monitoring--logging)
10. [Scaling](#scaling)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Code linted and formatted
- [ ] Dependencies updated
- [ ] Security vulnerabilities fixed
- [ ] TypeScript compiles without errors

### Configuration
- [ ] .env.example updated
- [ ] Environment variables documented
- [ ] API keys and secrets generated
- [ ] Database backups configured
- [ ] CORS properly configured
- [ ] SSL/HTTPS configured

### Infrastructure
- [ ] Database provisioned and tested
- [ ] File storage configured
- [ ] Email service configured (optional)
- [ ] CDN configured (optional)
- [ ] Load balancer configured (if needed)
- [ ] Monitoring set up

### Testing
- [ ] Manual testing completed
- [ ] API endpoints tested
- [ ] File upload tested
- [ ] Authentication tested
- [ ] Error handling tested
- [ ] Performance tested

---

## Environment Setup

### Production Environment Variables

Create `backend/.env` with production values:

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/plaque

# Security
JWT_SECRET=generate-long-random-string-at-least-32-chars
JWT_EXPIRY=7d

# OpenAI
OPENAI_API_KEY=sk-production-api-key

# Frontend
FRONTEND_URL=https://yourdomain.com

# File Upload
MAX_FILE_SIZE=50000000
ALLOWED_EXTENSIONS=pdf,doc,docx
UPLOAD_DIR=/var/uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Detection Thresholds
AI_DETECTION_THRESHOLD=0.6
PLAGIARISM_THRESHOLD=0.3

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/plaque/app.log

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-key
```

### Generate Secure Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: abc123def456... (use this value)
```

---

## Heroku Deployment

### 1. Install Heroku CLI

```bash
# Windows: Download installer
# Mac: brew tap heroku/brew && brew install heroku
# Linux: npm install -g heroku

# Verify
heroku --version
```

### 2. Login to Heroku

```bash
heroku login
# Authenticate with your Heroku account
```

### 3. Create Heroku App

```bash
# Create app
heroku create plaque-api

# Or use existing app
heroku apps:info plaque-api
```

### 4. Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-here
heroku config:set OPENAI_API_KEY=sk-your-key
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/plaque
heroku config:set FRONTEND_URL=https://your-frontend.com

# Verify
heroku config
```

### 5. Deploy

```bash
# Deploy backend
cd backend
git push heroku main

# Or deploy specific branch
git push heroku develop:main

# View logs
heroku logs --tail
```

### 6. Add MongoDB

```bash
# Add MongoDB addon (free tier)
heroku addons:create mongodb-atlas:free

# Or use MongoDB Atlas cloud database
# 1. Create account at mongodb.com
# 2. Get connection string
# 3. Set MONGODB_URI environment variable
```

### 7. Deploy Frontend (Netlify)

```bash
cd frontend

# Build
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build

# Configure environment variable
# In Netlify dashboard:
# Settings > Build & Deploy > Environment
# Add: REACT_APP_API_URL=https://plaque-api.herokuapp.com/api
```

### Heroku Helpful Commands

```bash
# View logs
heroku logs --tail

# Run command
heroku run npm run seed

# Scale dynos
heroku ps:scale web=2

# Restart app
heroku restart

# View config
heroku config

# Delete app
heroku apps:destroy --app plaque-api
```

---

## AWS Deployment

### Using Elastic Beanstalk

#### 1. Install AWS CLI

```bash
# Install
pip install awsebcli

# Configure credentials
aws configure
```

#### 2. Initialize Elastic Beanstalk

```bash
cd backend

# Initialize
eb init -p node.js-16 plaque-api --region us-east-1

# Create application
eb create plaque-api-prod
```

#### 3. Set Environment Variables

```bash
# Create .ebextensions/env.config
mkdir -p .ebextensions

cat > .ebextensions/env.config << EOF
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    JWT_SECRET: your-secret
    OPENAI_API_KEY: your-key
    MONGODB_URI: your-mongodb-uri
    FRONTEND_URL: https://your-domain.com
EOF
```

#### 4. Deploy

```bash
# Deploy
eb deploy plaque-api-prod

# View logs
eb logs

# View status
eb status

# Open app in browser
eb open
```

#### 5. Configure RDS Database

```bash
# Create RDS instance in AWS Console
# 1. RDS > Databases > Create database
# 2. Choose MongoDB Atlas or similar
# 3. Get connection string
# 4. Update environment variable
```

### Using EC2 + Load Balancer

See AWS documentation for detailed EC2 setup.

---

## DigitalOcean Deployment

### Using App Platform

#### 1. Create GitHub Repository

```bash
git remote add origin https://github.com/yourusername/plaque.git
git push -u origin main
```

#### 2. Connect to DigitalOcean

1. Sign up at [DigitalOcean](https://www.digitalocean.com)
2. Create new "App" in App Platform
3. Connect GitHub repository
4. Select `backend` source directory
5. Set environment variables
6. Deploy

#### 3. Set Environment Variables

In DigitalOcean App Platform dashboard:
- Add MONGODB_URI
- Add JWT_SECRET
- Add OPENAI_API_KEY
- Add FRONTEND_URL

#### 4. Deploy Frontend

Repeat process for frontend using `frontend` source directory.

#### 5. Link Frontend to Backend

Set in frontend environment:
```
REACT_APP_API_URL=https://your-backend-app.ondigitalocean.app/api
```

---

## Docker Container Registry

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Build image
cd backend
docker build -t yourusername/plaque-api:1.0.0 .

# Push
docker push yourusername/plaque-api:1.0.0

# Pull on server
docker pull yourusername/plaque-api:1.0.0

# Run
docker run -d -p 5000:5000 \
  -e MONGODB_URI=your-uri \
  -e OPENAI_API_KEY=your-key \
  yourusername/plaque-api:1.0.0
```

### Push to AWS ECR

```bash
# Create ECR repository
aws ecr create-repository --repository-name plaque-api

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag
docker build -t plaque-api:1.0.0 .
docker tag plaque-api:1.0.0 <account-id>.dkr.ecr.us-east-1.amazonaws.com/plaque-api:1.0.0

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/plaque-api:1.0.0

# Run from ECR
docker run -d -p 5000:5000 \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/plaque-api:1.0.0
```

---

## Database Setup

### MongoDB Atlas (Recommended)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster (free tier available)
3. Create database user
4. Add IP address to whitelist (0.0.0.0/0 for dev, specific IPs for prod)
5. Get connection string
6. Add to environment variables

### Backup Strategy

```bash
# Automated backups with MongoDB Atlas
# Enable in cluster settings > Backup

# Manual backup
mongoexport --uri "mongodb+srv://..." --collection documents > backup.json

# Restore
mongoimport --uri "mongodb+srv://..." --collection documents < backup.json
```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Build and push to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: plaque-api
        heroku_email: your-email@example.com
        appdir: backend
    
    - name: Deploy Frontend to Netlify
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      run: |
        cd frontend
        npm install
        npm run build
        netlify deploy --prod --dir=build
```

### Pre-Deployment Tests

```bash
# Add to package.json scripts
"test": "jest",
"test:coverage": "jest --coverage",
"lint": "eslint .",
"build": "tsc",
"deploy:prepare": "npm run lint && npm run test && npm run build"
```

---

## Monitoring & Logging

### Application Monitoring

#### Sentry (Error Tracking)

```bash
# Install
npm install @sentry/node

# Configure in server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

#### New Relic

```bash
# Install
npm install newrelic

# Add to top of server.ts
require('newrelic');
```

### Logging

```typescript
// Configure Winston logger
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

### Health Checks

```bash
# Monitor endpoint
curl https://yourdomain.com/api/health

# Should return
# {"status":"OK","timestamp":"2024-01-15T10:30:00Z"}
```

---

## Scaling

### Horizontal Scaling

```
                    Load Balancer
                          |
        ┌─────────────────┼─────────────────┐
        |                 |                 |
    Server 1         Server 2          Server 3
        |                 |                 |
        └─────────────────┼─────────────────┘
                    Shared Database
```

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Upgrade database tier
- Implement caching (Redis)

### Database Scaling

```bash
# Create read replicas
db.replicate()

# Configure connection pooling
MONGODB_MAX_POOL_SIZE=100

# Add indexes
db.documents.createIndex({ userId: 1, createdAt: -1 })
```

### Cache Layer (Redis)

```bash
# Add Redis to production environment
heroku addons:create heroku-redis:premium-0

# Use in code
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache API responses
client.setex(`user:${userId}`, 3600, JSON.stringify(user));
```

---

## Production Security Checklist

- [ ] HTTPS enabled
- [ ] All environment variables set
- [ ] Database credentials secured
- [ ] API keys rotated
- [ ] CORS configured for specific domain
- [ ] Rate limiting enabled
- [ ] DDoS protection enabled
- [ ] WAF (Web Application Firewall) enabled
- [ ] Regular backups scheduled
- [ ] Monitoring and alerting active
- [ ] Security headers configured
- [ ] Dependencies updated
- [ ] Security scanning enabled (npm audit)

---

## Troubleshooting

### Build Failures
- Check build logs
- Verify environment variables
- Ensure dependencies are compatible
- Check Node.js version compatibility

### Database Connection Errors
- Verify connection string
- Check firewall rules
- Ensure IP is whitelisted
- Test connection locally first

### High Memory Usage
- Check for memory leaks
- Implement caching
- Use pagination for large queries
- Monitor with APM tools

### Slow Performance
- Optimize database queries
- Add indexes
- Enable caching
- Implement CDN for static files

---

## Post-Deployment

1. **Monitor Logs**
   - Watch for errors
   - Monitor performance metrics
   - Set up alerts

2. **Backup Strategy**
   - Enable automated backups
   - Test restore process
   - Keep multiple backup copies

3. **Security Updates**
   - Regular dependency updates
   - Security patch management
   - Penetration testing

4. **Performance Optimization**
   - Analyze bottlenecks
   - Optimize queries
   - Implement caching

5. **User Support**
   - Monitor error reports
   - Respond to feedback
   - Fix bugs quickly

---

For more information, see:
- [SETUP.md](./docs/SETUP.md) - Local setup
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design
- [README.md](./README.md) - Project overview
