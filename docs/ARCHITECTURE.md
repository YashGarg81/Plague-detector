# Architecture & Design

Complete overview of PLAQUE's architecture, design patterns, and technical decisions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer (Browser)                   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    React Frontend                        │   │
│  │  ┌──────────┬──────────┬──────────┬──────────────────┐  │   │
│  │  │  Pages   │Components│ Services │ State Management│  │   │
│  │  └──────────┴──────────┴──────────┴──────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓ HTTPS/API Calls                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer (Server)                   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Express.js Server                     │   │
│  │                                                          │   │
│  │  ┌──────────┬───────────┬────────┬───────────────────┐  │   │
│  │  │ Routes   │Middleware │Services│  Controllers      │  │   │
│  │  │          │           │        │                   │  │   │
│  │  │/auth     │JWT Auth   │Auth    │  AuthController   │  │   │
│  │  │/documents│File Upload│Files   │  DocumentController│  │   │
│  │  │          │Error Hdlr │AI Detect  Humanization    │  │   │
│  │  │          │Rate Limit │Plugins │                   │  │   │
│  │  └──────────┴───────────┴────────┴───────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────┼──────────┐
                    ↓          ↓          ↓
        ┌─────────────────────────────────────────────┐
        │    External Services & Data Layer           │
        │                                             │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
        │  │ MongoDB  │  │ OpenAI   │  │ File     │ │
        │  │ Database │  │ API      │  │ Storage  │ │
        │  └──────────┘  └──────────┘  └──────────┘ │
        └─────────────────────────────────────────────┘
```

---

## Technology Stack Details

### Frontend Stack

```
React 18
├── TypeScript (Type Safety)
├── Tailwind CSS (Styling)
├── React Router (Navigation)
├── Zustand (State Management)
├── Axios (HTTP Client)
├── React Hot Toast (Notifications)
└── React Icons (UI Icons)
```

**Key Characteristics:**
- Single Page Application (SPA)
- Client-side routing
- Responsive design (Mobile-first)
- Component-based architecture
- Zustand for global state

### Backend Stack

```
Node.js + Express
├── TypeScript (Type Safety)
├── MongoDB + Mongoose (Database)
├── OpenAI API (AI Services)
├── Multer (File Uploads)
├── JWT (Authentication)
├── Bcrypt (Password Security)
├── Helmet (Security Headers)
├── CORS (Cross-origin)
└── Express Rate Limit (DDoS Protection)
```

**Key Characteristics:**
- RESTful API
- Middleware-based architecture
- Async/await patterns
- Database abstraction with Mongoose
- Security-first design

---

## File Structure & Organization

### Frontend Structure
```
frontend/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── FileUpload.tsx
│   │   ├── AnalysisReport.tsx
│   │   ├── ComparisonView.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/               # Page components (routes)
│   │   ├── Home.tsx         # Landing page
│   │   ├── Login.tsx        # Login page
│   │   ├── Register.tsx     # Registration page
│   │   └── Dashboard.tsx    # Main app page
│   ├── services/            # Business logic
│   │   ├── api.ts           # API client config
│   │   └── store.ts         # Zustand stores
│   ├── styles/              # Global styles
│   │   └── globals.css      # Tailwind imports
│   ├── App.tsx              # Root app component
│   └── index.tsx            # ReactDOM entry
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

### Backend Structure
```
backend/
├── src/
│   ├── config/              # Configuration
│   │   ├── environment.ts   # Env variables
│   │   └── database.ts      # MongoDB connection
│   ├── models/              # Mongoose schemas
│   │   ├── User.ts
│   │   └── Document.ts
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   └── documentController.ts
│   ├── routes/              # API routes
│   │   ├── authRoutes.ts
│   │   └── documentRoutes.ts
│   ├── middleware/          # Custom middleware
│   │   └── auth.ts          # JWT verification
│   ├── services/            # Business logic
│   │   ├── fileProcessor.ts # File extraction
│   │   ├── aiDetection.ts   # AI detection
│   │   ├── humanization.ts  # Text rewriting
│   │   └── (more services)
│   └── server.ts            # Express app entry
├── uploads/                 # File storage
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Data Models

### User Model

```typescript
{
  _id: ObjectId,
  username: String,           // Unique username
  email: String,              // Unique email
  password: String,           // Hashed with bcrypt
  createdAt: Date,
  updatedAt: Date
}
```

**Key Features:**
- Unique constraints on username and email
- Password automatically hashed before saving
- Timestamps for audit trail

### Document Model

```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User
  filename: String,           // UUID-based filename
  originalName: String,       // Original filename
  mimeType: String,          // File MIME type
  fileSize: Number,          // File size in bytes
  extractedText: String,     // Extracted content
  analysis: {
    aiScore: Number,         // 0-1 AI probability
    plagiarismScore: Number, // 0-1 plagiarism risk
    humanizedText: String,   // Rewritten content
    flaggedSections: Array,  // Suspicious content
    rewriteStyle: String,    // Applied style
    originalWordCount: Number,
    humanizedWordCount: Number
  },
  status: String,            // pending|processing|completed|failed
  error: String,             // Error message if failed
  createdAt: Date,
  updatedAt: Date
}
```

**Key Features:**
- Document ownership (userId)
- File tracking and history
- Analysis results storage
- Status tracking
- Error logging

---

## API Request/Response Flow

### Authentication Flow

```
1. User Registration
   ├─ POST /auth/register
   ├─ Validate input
   ├─ Hash password with bcrypt
   ├─ Create User document
   ├─ Generate JWT token
   └─ Return token + user data

2. User Login
   ├─ POST /auth/login
   ├─ Verify email exists
   ├─ Compare password with hash
   ├─ Generate JWT token
   └─ Return token + user data

3. Protected Requests
   ├─ Include JWT in Authorization header
   ├─ Middleware verifies token
   ├─ Extract userId from token
   └─ Proceed with request
```

### Document Processing Flow

```
1. Upload
   ├─ User selects file
   ├─ Client validates file type/size
   ├─ POST multipart/form-data to /upload
   ├─ Server validates again
   ├─ Store file with UUID name
   ├─ Extract text from file
   ├─ Create Document record
   └─ Return document ID

2. Analysis
   ├─ User requests analysis via POST /analyze/:id
   ├─ Fetch document and extracted text
   ├─ Update status to "processing"
   ├─ Send text to OpenAI for detection
   │   ├─ Calculate AI score
   │   └─ Calculate plagiarism score
   ├─ Identify and flag suspicious sections
   ├─ Store analysis results
   ├─ Update status to "completed"
   └─ Return analysis data

3. Humanization
   ├─ User selects style (formal/simplified/scholarly)
   ├─ POST /humanize/:id with style
   ├─ Update status to "processing"
   ├─ Send text + style to OpenAI
   ├─ Receive humanized text
   ├─ Calculate readability score
   ├─ Store humanized content
   ├─ Update status to "completed"
   └─ Return comparison data
```

---

## Security Architecture

### Authentication & Authorization

```
JWT Token Structure
├─ Header: Algorithm (HS256)
├─ Payload: userId, username, exp
└─ Signature: HMAC-SHA256 with secret

Token Flow:
1. User logs in
2. Server generates JWT with expiration (7 days)
3. Client stores token in localStorage
4. Client includes token in Authorization header
5. Server verifies signature and expiration
6. Extract userId from token
7. Use userId for authorization checks
```

### Password Security

```
Registration:
1. User provides password
2. Validate password strength (min 6 chars)
3. Generate salt (10 rounds)
4. Hash password with bcrypt + salt
5. Store hash in database
6. Never store plain password

Login:
1. User provides password
2. Fetch user from database
3. Compare plain password with stored hash
4. Return error if mismatch
5. Generate JWT if match
```

### File Upload Security

```
Validation:
1. Client-side: Check file type and size
2. Server-side: Validate again
3. Check MIME type
4. Verify file extension
5. Check file size against limit
6. Scan for malicious content (future)

Storage:
1. Generate UUID filename
2. Store in /uploads directory
3. Remove original filename
4. Link file to user document
5. Secure file permissions
```

### Additional Security

```
Helmet.js:
├─ Content Security Policy (CSP)
├─ X-Frame-Options
├─ X-Content-Type-Options
├─ Strict-Transport-Security
├─ X-XSS-Protection
└─ Various security headers

CORS:
├─ Only allow specific origin
├─ Credentials mode enabled
└─ Allow specific methods

Rate Limiting:
├─ 100 requests per 15 minutes per IP
├─ Return 429 when exceeded
└─ Exponential backoff on client
```

---

## Service Layer Architecture

### FileProcessor Service

```typescript
class FileProcessor {
  // Extract text from different formats
  ├─ extractTextFromPDF()
  ├─ extractTextFromDocx()
  ├─ extractTextFromDoc()
  ├─ extractText()           // Route to correct extractor
  ├─ cleanText()             // Normalize and clean
  ├─ splitIntoSentences()    // Text segmentation
  └─ splitIntoParagraphs()   // Paragraph extraction
}
```

### AIDetectionService

```typescript
class AIDetectionService {
  // AI content detection
  ├─ detectAIContent()       // Score AI probability
  ├─ detectPlagiarism()      // Score plagiarism risk
  └─ analyzeFullDocument()   // Comprehensive analysis

// Uses OpenAI API:
├─ GPT-3.5-turbo model
├─ Few-shot prompting
├─ Temperature: 0.3 (consistent results)
└─ Max tokens: 10 (brief numeric output)
```

### HumanizationService

```typescript
class HumanizationService {
  // Text humanization
  ├─ humanizeText()          // Main rewriting function
  ├─ humanizeSections()      // Process multiple sections
  ├─ improveClarity()        // Enhance readability
  └─ calculateReadabilityScore() // Flesch reading ease

// Supports styles:
├─ formal: Professional academic writing
├─ simplified: Clear accessible language
└─ scholarly: Advanced expert-level writing

// Uses OpenAI API:
├─ GPT-3.5-turbo model
├─ System prompts for style guidance
├─ Temperature: 0.7 (creative variation)
└─ Max tokens: ~document length * 1.2
```

---

## State Management (Frontend)

### Zustand Stores

```typescript
// useAuthStore
{
  user: User | null,
  token: string | null,
  isLoading: boolean,
  login(token, user): void,
  logout(): void,
  setUser(user): void,
  setLoading(isLoading): void
}

// useDocumentStore
{
  documents: Document[],
  currentDocument: Document | null,
  setDocuments(docs): void,
  setCurrentDocument(doc): void,
  addDocument(doc): void,
  removeDocument(id): void
}
```

**Persistence:**
- Auth state stored in localStorage
- Survives page refresh
- Automatically cleared on logout

---

## Error Handling

### Frontend Error Handling

```typescript
// API errors
├─ Network errors → Toast notification
├─ 401 Unauthorized → Redirect to login
├─ 400 Bad Request → Display error message
├─ 404 Not Found → Show friendly message
├─ 500 Server Error → Alert user
└─ File validation errors → Toast feedback

// Try-catch blocks for async operations
// React error boundaries for component errors
// Error logging to console/service
```

### Backend Error Handling

```typescript
// Input validation
├─ Joi schemas for request bodies
├─ File type/size validation
├─ Required field checking
└─ Data type validation

// Authentication errors
├─ 401 for missing/invalid token
├─ 403 for unauthorized access
└─ 409 for duplicate resources

// Error responses
├─ Consistent error format: { error: string }
├─ Appropriate HTTP status codes
├─ Error logging to console
└─ Stack traces in development
```

---

## Database Design

### Indexes

```javascript
// User queries
db.users.createIndex({ email: 1 })         // Login queries
db.users.createIndex({ username: 1 })      // Username lookups

// Document queries
db.documents.createIndex({ userId: 1, createdAt: -1 })  // List by user
db.documents.createIndex({ status: 1 })                  // Status queries
```

### Relationships

```
User (1) ──────── (Many) Documents
  |
  └─ userId: ObjectId reference in Document
```

---

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    ├─ Server Instance 1
    ├─ Server Instance 2
    └─ Server Instance 3
         ↓
    Shared MongoDB
    (handles concurrent connections)
```

### Optimization Strategies

1. **Caching:**
   - Redis for session storage
   - Browser caching for static assets
   - API response caching

2. **Database:**
   - Connection pooling
   - Query optimization
   - Read replicas for scalability

3. **Frontend:**
   - Code splitting
   - Lazy loading
   - CDN for assets

4. **Backend:**
   - Request queueing for AI API
   - Async processing for heavy tasks
   - File compression

---

## Performance Optimization

### Frontend Optimizations
- Tree-shaking and code splitting
- Lazy loading routes and components
- Memoization of expensive computations
- Image optimization
- CSS-in-JS optimization

### Backend Optimizations
- Database query optimization
- Connection pooling
- Response compression (GZIP)
- Request timeout handling
- Async processing for AI requests

### Monitoring
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Logging (Winston/Pino)
- Metrics collection (Prometheus)

---

## Deployment Architecture

```
Production Environment:

CDN (Static Assets)
   ↓
Frontend (React)
   ├─ Netlify/Vercel
   ├─ AWS S3 + CloudFront
   └─ DigitalOcean App Platform

API Gateway / Load Balancer
   ↓
Backend Servers (Express)
   ├─ Heroku
   ├─ AWS EC2/Elastic Beanstalk
   ├─ DigitalOcean Droplets
   └─ Google Cloud Run

MongoDB Database (Atlas)
   ├─ Automatic backups
   ├─ Replica sets
   └─ Connection pooling

File Storage:
   ├─ AWS S3
   ├─ Google Cloud Storage
   └─ Local server storage
```

---

## Future Architecture Enhancements

```
1. Microservices
   ├─ Auth Service
   ├─ File Processing Service
   ├─ AI Detection Service
   └─ Humanization Service

2. Message Queue
   ├─ RabbitMQ/Redis
   ├─ Async job processing
   └─ Webhook notifications

3. Caching Layer
   ├─ Redis for sessions
   ├─ Memcached for query results
   └─ Browser caching strategies

4. Real-time Features
   ├─ WebSockets (Socket.io)
   ├─ Real-time collaboration
   └─ Live progress updates

5. Analytics
   ├─ User behavior tracking
   ├─ Performance metrics
   └─ Usage insights
```

---

## Development Workflow

```
Feature Development:
1. Create feature branch
2. Implement feature with tests
3. Local testing in dev environment
4. Commit with descriptive message
5. Push to branch
6. Create Pull Request
7. Code review
8. Merge to main
9. Deploy to staging
10. Deploy to production

CI/CD Pipeline:
├─ Automated tests
├─ Linting
├─ Build verification
├─ Deployment automation
└─ Monitoring & alerts
```

---

## Documentation Structure

```
docs/
├─ API.md                 # API endpoints and examples
├─ SETUP.md              # Installation and configuration
├─ ARCHITECTURE.md       # This file
├─ CONTRIBUTING.md       # Development guidelines
├─ DEPLOYMENT.md         # Production deployment
└─ TROUBLESHOOTING.md    # Common issues and solutions
```

---

## Testing Strategy

### Unit Tests
- Service functions
- Utility functions
- Component logic

### Integration Tests
- API endpoints
- Database operations
- Authentication flows

### E2E Tests
- User workflows
- Document processing
- Complete user journeys

---

## Conclusion

PLAQUE is built with scalability, security, and maintainability in mind. The architecture supports growth from a single-server setup to a distributed microservices architecture. The separation of concerns between frontend and backend enables independent development and deployment of features.

For more information, refer to specific documentation files or contact the development team.
