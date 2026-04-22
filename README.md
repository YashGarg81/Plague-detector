# PLAQUE - Plagiarism Detection & AI Humanization Platform

A production-ready web application that detects AI-generated and plagiarized content in academic documents, then rewrites them to be more human-like while preserving meaning and academic integrity.

## 🎯 Features

### Core Features
- **File Upload System**: Support for PDF, DOC, and DOCX files
- **AI Detection**: Detect AI-generated content probability with confidence scores
- **Plagiarism Detection**: Analyze documents for plagiarism risk
- **Humanization Engine**: Rewrite AI-detected content into natural, human-like text
- **Multiple Rewriting Styles**: 
  - Formal Academic
  - Simplified Academic  
  - Advanced Scholarly
- **Side-by-Side Comparison**: View original vs humanized text
- **Detailed Reports**: Comprehensive analysis with percentages and flagged sections
- **User Authentication**: Secure login/signup system
- **Document History**: Track all analyzed documents

### Additional Features
- Drag-and-drop file upload
- Real-time analysis feedback
- Progress indicators during processing
- User document management
- Responsive design (Mobile/Tablet/Desktop)
- Error handling for unsupported files
- Rate limiting and security features

## 🏗️ Architecture

```
PLAQUE/
├── frontend/                 # React.js Frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API and state management
│   │   ├── styles/          # Tailwind CSS
│   │   ├── App.tsx          # Main app component
│   │   └── index.tsx        # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/                  # Node.js/Express Backend
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Express server
│   ├── uploads/             # File storage
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── docs/                     # Documentation
    ├── API.md               # API documentation
    ├── SETUP.md             # Setup guide
    └── ARCHITECTURE.md      # Architecture details
```

## 🔧 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **OpenAI API** - AI detection and humanization
- **Multer** - File uploads
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **pdf-parse** - PDF processing
- **Mammoth.js** - Word document processing

## 📋 Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **OpenAI API Key** (for AI features)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to project
cd plaque

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env

# Edit .env with your values:
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/plaque
JWT_SECRET=your_super_secret_key_here
OPENAI_API_KEY=sk-your-key-here
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```bash
cd frontend
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
```

### 3. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas in .env:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/plaque
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App opens on http://localhost:3000
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## 📖 API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Document Endpoints

```
POST /api/documents/upload
POST /api/documents/:documentId/analyze
POST /api/documents/:documentId/humanize
GET /api/documents/:documentId
GET /api/documents
DELETE /api/documents/:documentId
```

See [API.md](./docs/API.md) for detailed documentation.

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- File type validation
- File size limits (50MB)
- Input validation with Joi
- Secure file upload with UUID naming

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Serve the `build/` folder with a static server like Nginx or Express.

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection | local |
| JWT_SECRET | JWT signing key | required |
| OPENAI_API_KEY | OpenAI API key | required |
| FRONTEND_URL | Frontend URL | http://localhost:3000 |
| MAX_FILE_SIZE | Max upload size (bytes) | 50MB |
| AI_DETECTION_THRESHOLD | AI detection threshold | 0.6 |
| PLAGIARISM_THRESHOLD | Plagiarism threshold | 0.3 |

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running and connection string is correct
mongod # Start local MongoDB
# Or update MONGODB_URI to MongoDB Atlas
```

### OpenAI API Errors
```
Solution: Verify API key is valid and has available credits
Check: https://platform.openai.com/account/api-keys
```

### File Upload Issues
```
Solution: Check file size (max 50MB) and type (PDF, DOC, DOCX)
Increase MAX_FILE_SIZE in .env if needed
```

### CORS Errors
```
Solution: Ensure FRONTEND_URL matches your frontend origin
Check backend CORS configuration
```

## 📊 Database Schema

### User Schema
```
{
  username: String (unique, min 3)
  email: String (unique)
  password: String (hashed)
  createdAt: Date
  updatedAt: Date
}
```

### Document Schema
```
{
  userId: ObjectId (ref User)
  filename: String
  originalName: String
  mimeType: String
  fileSize: Number
  extractedText: String
  analysis: {
    aiScore: Number,
    plagiarismScore: Number,
    humanizedText: String,
    flaggedSections: Array,
    rewriteStyle: String
  }
  status: String (pending, processing, completed, failed)
  error: String
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Deployment

### Heroku
```bash
cd backend
heroku create plaque-app
git push heroku main
```

### AWS/Azure/GCP
See respective cloud provider documentation for Express.js and React deployment.

### Docker
```bash
# Build and run with Docker Compose
docker-compose up
```

## 📈 Performance Optimization

- Lazy loading of components
- Image optimization
- Code splitting
- Caching strategies
- Database indexing
- API request optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@plaque.app
- Documentation: [See docs/]

## 🎓 Educational Purpose

PLAQUE is designed for educational purposes to help students:
- Understand plagiarism and academic integrity
- Improve their writing skills
- Learn about AI content detection
- Practice ethical academic writing

## 📊 What Gets Detected

### AI-Generated Content
- Repetitive patterns
- Robotic tone
- Unusual word choices
- Consistent sentence structure
- Generic examples

### Plagiarism Risk
- Specific phrases that might be quoted
- Citation patterns
- Unusual writing consistency
- Generic academic language
- Matching phrases with known sources

## 🎯 Future Enhancements

- [ ] Real-time collaborative editing
- [ ] Advanced plagiarism database integration
- [ ] Citation management
- [ ] Bulk processing
- [ ] API for third-party integration
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Multiple language support
- [ ] Version history and tracking
- [ ] Custom rewriting templates

## 📞 Contact

- Website: https://plaque.app
- Email: hello@plaque.app
- Twitter: @plaqueapp

---

**Made with ❤️ for academic integrity**
#   P l a g u e - d e t e c t o r  
 