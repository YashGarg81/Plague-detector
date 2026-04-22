# Setup Guide

Complete step-by-step guide to set up PLAQUE locally and in production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** v7 or higher (comes with Node.js)
- **MongoDB** (local or cloud) ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **OpenAI API Key** ([Get here](https://platform.openai.com/api-keys))
- **Git** ([Download](https://git-scm.com/))

### Optional
- **Docker** ([Download](https://www.docker.com/)) - For containerized deployment
- **Postman** ([Download](https://www.postman.com/)) - For API testing
- **VS Code** ([Download](https://code.visualstudio.com/)) - Recommended IDE

### Verify Prerequisites
```bash
node --version    # Should be v16+
npm --version     # Should be v7+
git --version
```

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/plaque.git
cd plaque
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Expected output: "added XXX packages"

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Backend Configuration

### 1. Create Environment File

```bash
cd backend

# Copy example file
cp .env.example .env

# Edit .env with your text editor
```

### 2. Configure Environment Variables

Open `backend/.env` and configure:

```env
# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000

# Database - Choose one option:

# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/plaque

# Option B: MongoDB Atlas (Cloud)
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create a free cluster
# 3. Get connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/plaque?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key-here

# File Upload
MAX_FILE_SIZE=50000000
ALLOWED_EXTENSIONS=pdf,doc,docx

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Detection Thresholds
AI_DETECTION_THRESHOLD=0.6
PLAGIARISM_THRESHOLD=0.3
```

### 3. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to `OPENAI_API_KEY` in `.env`

**⚠️ Security Note:** Never commit `.env` file to git. It's in `.gitignore`.

---

## Frontend Configuration

### 1. Create Environment File

```bash
cd frontend

# Create .env.local file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
```

### 2. Optional Frontend Configuration

Create `frontend/.env.local` with additional settings:

```env
# API
REACT_APP_API_URL=http://localhost:5000/api

# Analytics (optional)
REACT_APP_ANALYTICS_ID=your-analytics-id

# App Name
REACT_APP_NAME=PLAQUE
REACT_APP_VERSION=1.0.0
```

---

## Database Setup

### Option A: Local MongoDB Installation

#### Windows
```bash
# 1. Download MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# 2. Run the installer and follow setup

# 3. Start MongoDB
mongod

# In another terminal, verify:
mongo
# You should see MongoDB shell
```

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### Verify Installation
```bash
mongo --version
# Should show MongoDB shell version
```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster (select free tier)
4. Click "Connect"
5. Choose "Connect your application"
6. Copy connection string
7. Replace `<password>` with your password
8. Paste into `MONGODB_URI` in `.env`

Example:
```
mongodb+srv://username:password@cluster0.mongodb.net/plaque?retryWrites=true&w=majority
```

### Create Database and Collections

The application automatically creates these:

**Database:** `plaque`

**Collections:**
- `users` - User accounts
- `documents` - Uploaded documents and analysis

No manual setup needed - Mongoose creates them automatically.

---

## Running the Application

### 1. Start MongoDB (if local)

```bash
# Terminal 1
mongod
# Should output: "waiting for connections on port 27017"
```

### 2. Start Backend Server

```bash
# Terminal 2
cd backend
npm run dev

# Output should show:
# ✅ MongoDB connected successfully
# 🚀 Server running on http://localhost:5000
# 📁 Upload directory: uploads
# 🤖 OpenAI API configured: ✅
```

### 3. Start Frontend Dev Server

```bash
# Terminal 3
cd frontend
npm start

# Browser should open http://localhost:3000
# If not, navigate manually to http://localhost:3000
```

### 4. Verify Everything Works

- Frontend: http://localhost:3000 (should load)
- Backend Health: http://localhost:5000/api/health (should show `{"status":"OK"}`)
- Try to register at http://localhost:3000/register

---

## Testing the Application

### 1. Register an Account

1. Go to http://localhost:3000/register
2. Fill in the form
3. Click "Register"

### 2. Upload a Test Document

1. Create a simple `.pdf` or `.docx` file with some text
2. On dashboard, click upload
3. Drag and drop your file
4. It should extract text and show analysis

### 3. Test Analysis

The system should:
- Extract text from the document
- Calculate AI score and plagiarism score
- Highlight suspicious sections

### 4. Test Humanization

1. Select a writing style (formal, simplified, scholarly)
2. Click "Humanize Content"
3. View comparison between original and humanized text

---

## Production Deployment

### Prepare for Production

#### Backend

1. **Update .env for Production**
```env
NODE_ENV=production
JWT_SECRET=generate-a-long-random-string-here
OPENAI_API_KEY=your-api-key
MONGODB_URI=mongodb+srv://...  # Use Atlas
FRONTEND_URL=https://yourdomain.com
```

2. **Build Backend**
```bash
cd backend
npm run build
npm start  # Starts from dist/server.js
```

#### Frontend

1. **Build Frontend**
```bash
cd frontend
npm run build
# Creates optimized build in frontend/build/
```

### Deployment Options

#### Option 1: Heroku (Simple)

**Backend:**
```bash
# Create Heroku app
heroku create plaque-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set OPENAI_API_KEY=your-key
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set FRONTEND_URL=https://your-frontend.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Frontend (Netlify):**
```bash
# Install Netlify CLI
npm install -g netlify-cli

cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=build

# Set environment variable in Netlify dashboard:
# REACT_APP_API_URL=https://plaque-api.herokuapp.com/api
```

#### Option 2: AWS

**Using Elastic Beanstalk:**

```bash
# Install AWS CLI
pip install awsebcli

cd backend

# Initialize EB
eb init -p node.js-16 plaque-api

# Create environment
eb create plaque-api-env

# Set environment variables
eb setenv MONGODB_URI=your-uri JWT_SECRET=your-secret

# Deploy
eb deploy
```

#### Option 3: Docker

**Dockerfile (Backend):**
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

**Build and Run:**
```bash
docker build -t plaque-api .
docker run -p 5000:5000 \
  -e MONGODB_URI=your-uri \
  -e OPENAI_API_KEY=your-key \
  plaque-api
```

#### Option 4: DigitalOcean App Platform

1. Push code to GitHub
2. Sign up for [DigitalOcean](https://www.digitalocean.com/)
3. Connect GitHub repository
4. Create app from repository
5. Set environment variables
6. Deploy

---

## Environment Checklist

Before going to production, verify:

- [ ] All `.env` variables are set
- [ ] OpenAI API key is valid
- [ ] MongoDB is accessible and has backups
- [ ] JWT_SECRET is a long random string
- [ ] FRONTEND_URL matches your domain
- [ ] Files are being uploaded to correct directory
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] HTTPS is enabled
- [ ] Logs are being captured

---

## Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Find and kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Ensure MongoDB is running: mongod
2. Check MONGODB_URI in .env
3. If using Atlas, verify network access
4. Verify connection string format
```

#### OpenAI API Error
```
Error: 401 Unauthorized

Solution:
1. Verify API key in .env
2. Check API key has credits
3. Visit https://platform.openai.com/account/api-keys
4. Regenerate key if necessary
```

#### File Upload Issues
```
Error: File size exceeds limit

Solution:
1. Increase MAX_FILE_SIZE in .env
2. Restart backend server
3. Default is 50MB, increase if needed
```

### Frontend Issues

#### Can't Connect to Backend
```
Error: Network Error

Solution:
1. Verify backend is running on port 5000
2. Check REACT_APP_API_URL in .env.local
3. Ensure CORS is enabled in backend
4. Check browser console for errors
```

#### Blank Page After Login
```
Solution:
1. Check browser console for errors
2. Verify JWT token is being stored
3. Clear browser cache and local storage
4. Hard refresh (Ctrl+Shift+R)
```

### Database Issues

#### Data Not Persisting
```
Solution:
1. Verify MONGODB_URI is correct
2. Check that MongoDB is running
3. Look for errors in MongoDB logs
4. Ensure database user has write permissions
```

### General Issues

#### Slow Performance
```
Solution:
1. Add database indexes
2. Reduce file upload size limit
3. Optimize API queries
4. Enable caching
5. Use CDN for static files
```

#### 404 Errors
```
Solution:
1. Verify all routes are configured
2. Check URL paths match API endpoints
3. Ensure backend is running
4. Clear browser cache
```

---

## Performance Optimization

### Backend
- Enable GZIP compression
- Implement caching (Redis)
- Add database indexes
- Optimize API queries
- Use pagination for lists

### Frontend
- Lazy load components
- Code splitting
- Image optimization
- CSS/JS minification
- Caching strategies

### Database
```javascript
// Add indexes for faster queries
db.documents.createIndex({ userId: 1, createdAt: -1 })
db.users.createIndex({ email: 1 })
```

---

## Security Checklist

- [ ] Change JWT_SECRET to a random string
- [ ] Use HTTPS in production
- [ ] Enable CORS properly (specify domain)
- [ ] Set up rate limiting
- [ ] Use environment variables for secrets
- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Enable helmet.js
- [ ] Use bcrypt for password hashing
- [ ] Implement CSRF protection
- [ ] Keep dependencies updated

---

## Next Steps

1. **Documentation:** Read [API.md](./API.md) for API documentation
2. **Architecture:** See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. **Customization:** Modify styles, add features
4. **Testing:** Implement unit and integration tests
5. **Monitoring:** Set up error tracking and analytics

---

## Support

For help:
- Check [Troubleshooting](#troubleshooting) section
- Review error logs in terminal
- Check MongoDB logs
- Visit documentation site
- Create GitHub issue

---

**Congratulations! You've successfully set up PLAQUE! 🎉**
