# PLAQUE - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- OpenAI API Key

### 1️⃣ Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/plaque.git
cd plaque

# Install backend
cd backend && npm install && cd ..

# Install frontend  
cd frontend && npm install && cd ..
```

### 2️⃣ Configure

**Backend (.env)**
```bash
cd backend
cp .env.example .env

# Edit .env:
# - MONGODB_URI: your MongoDB connection string
# - OPENAI_API_KEY: your OpenAI API key
# - JWT_SECRET: generate a random string
```

**Frontend (.env.local)**
```bash
cd frontend
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
```

### 3️⃣ Start Services

**Terminal 1 - Start MongoDB**
```bash
mongod
# Output: "waiting for connections on port 27017"
```

**Terminal 2 - Start Backend**
```bash
cd backend
npm run dev
# Output: "Server running on http://localhost:5000"
```

**Terminal 3 - Start Frontend**
```bash
cd frontend
npm start
# Browser opens http://localhost:3000
```

### 4️⃣ Test the App

1. Register account at http://localhost:3000/register
2. Upload a PDF/DOC/DOCX file
3. View analysis results
4. Choose humanization style
5. See comparison view

### ✅ Done! 

You're now running PLAQUE locally!

---

## 📂 File Structure

```
plaque/
├── backend/           # Node.js/Express API
├── frontend/          # React.js UI
├── docs/              # Documentation
├── docker-compose.yml # Docker setup
└── README.md          # Full documentation
```

---

## 🔑 Key Endpoints

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/documents/upload` - Upload file
- `POST /api/documents/:id/analyze` - Analyze document
- `POST /api/documents/:id/humanize` - Humanize text

See [docs/API.md](./docs/API.md) for full details.

---

## 📚 Documentation

- **[README.md](./README.md)** - Full project overview
- **[docs/SETUP.md](./docs/SETUP.md)** - Detailed setup guide
- **[docs/API.md](./docs/API.md)** - API documentation
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical architecture
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development guide

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod
```

### OpenAI Error
```
Get your API key: https://platform.openai.com/api-keys
Add to backend/.env: OPENAI_API_KEY=sk-...
```

### Port in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### Blank Page
```
Clear cache: Ctrl+Shift+Delete
Hard refresh: Ctrl+Shift+R
Check console: F12
```

---

## 🐳 Docker Setup (Optional)

```bash
# Requires Docker & Docker Compose installed

# Start all services
docker-compose up

# Stop services
docker-compose down

# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

---

## 📝 Next Steps

1. **Read Documentation**
   - Complete setup guide: docs/SETUP.md
   - API reference: docs/API.md
   - Architecture: docs/ARCHITECTURE.md

2. **Develop Features**
   - See CONTRIBUTING.md for development guidelines
   - Follow code style guide
   - Add tests for new features

3. **Deploy**
   - Choose deployment platform (Heroku, AWS, etc.)
   - Configure production environment
   - Set up monitoring and logging

4. **Customize**
   - Modify UI styling (Tailwind CSS)
   - Add new features
   - Integrate with external services

---

## 💡 Common Tasks

### Add New API Endpoint
1. Create controller method: `backend/src/controllers/`
2. Create route: `backend/src/routes/`
3. Test with Postman

### Create New Component
1. Create component: `frontend/src/components/`
2. Import in page
3. Test in browser

### Test File Upload
```bash
# Create test file
echo "Sample content for testing" > test-doc.txt
# Convert to PDF or DOCX
# Upload via UI
```

### Check API Responses
```bash
# Use Postman or curl
curl -X GET http://localhost:5000/api/health

# Or use VS Code REST Client extension
```

---

## 🔐 Security Notes

- ⚠️ Never commit `.env` files
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use strong passwords
- ⚠️ Enable HTTPS in production
- ⚠️ Keep dependencies updated: `npm audit`

---

## 📊 Project Stats

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Authentication**: JWT
- **Database**: MongoDB + Mongoose

---

## 🆘 Support

- **Documentation**: See docs/ folder
- **Issues**: Create GitHub issue
- **Email**: support@plaque.app
- **Discussions**: GitHub discussions

---

## 🎉 You're Ready!

Start using PLAQUE now!

1. Open http://localhost:3000
2. Register/Login
3. Upload a document
4. Get instant analysis
5. Humanize your content

**Happy writing! 📝**

---

## 🚀 What's Next?

- [ ] Create account
- [ ] Upload first document
- [ ] View analysis
- [ ] Humanize content
- [ ] Export document
- [ ] Read full documentation
- [ ] Contribute to project

**Enjoy PLAQUE! 🎓**
