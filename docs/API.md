# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

---

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Missing required fields or password mismatch
- 409: User already exists

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Missing credentials
- 401: Invalid credentials

---

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Headers:** Authorization (required)

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 401: No token or invalid token
- 404: User not found

---

## Document Endpoints

### 1. Upload Document

**Endpoint:** `POST /documents/upload`

**Headers:** Authorization (required)

**Request Type:** multipart/form-data

**Form Parameters:**
- `file` (required): File object (PDF, DOC, or DOCX)

**Response (201):**
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": "507f1f77bcf86cd799439012",
    "originalName": "my-research-paper.pdf",
    "fileSize": 245632,
    "extractedText": "Lorem ipsum dolor sit amet... [first 500 characters]",
    "status": "pending"
  }
}
```

**Errors:**
- 400: Invalid file type or file too large
- 401: Unauthorized

**File Constraints:**
- Max size: 50MB
- Accepted types: PDF, DOC, DOCX

---

### 2. Analyze Document

**Endpoint:** `POST /documents/:documentId/analyze`

**Headers:** Authorization (required)

**URL Parameters:**
- `documentId` (required): Document ID from upload

**Request Body (optional):**
```json
{
  "excludeQuotes": true,
  "excludeBibliography": true,
  "excludeSmallMatchesUnderWords": 8
}
```

**Response (200):**
```json
{
  "message": "Analysis completed",
  "analysis": {
    "aiScore": 0.75,
    "plagiarismScore": 0.42,
    "similarityScore": 0.49,
    "confidence": 0.585,
    "reportGeneratedInMs": 932,
    "wordCount": 5234,
    "sourceMatches": [
      {
        "sourceType": "website",
        "sourceName": "Open internet corpus",
        "matchPercentage": 31,
        "matchedText": "This is a flagged section of text..."
      }
    ],
    "matchedContentBreakdown": {
      "websites": 31,
      "journals": 25,
      "studentPapers": 16
    },
    "filters": {
      "excludeQuotes": true,
      "excludeBibliography": true,
      "excludeSmallMatchesUnderWords": 8
    },
    "writingAnalysis": {
      "paraphrasingLikelihood": 0.58,
      "writingPatternConsistency": 0.67,
      "grammarRisk": 0.44,
      "structureRisk": 0.51
    },
    "flaggedSections": [
      {
        "text": "This is a flagged section of text",
        "type": "ai-generated",
        "color": "yellow",
        "confidence": 0.82
      },
      {
        "text": "Another suspicious section",
        "type": "plagiarism",
        "color": "red",
        "confidence": 0.71
      }
    ]
  }
}
```

**Response Fields:**
- `aiScore` (0-1): Probability of AI-generated content
- `plagiarismScore` (0-1): Plagiarism risk probability
- `similarityScore` (0-1): Combined similarity risk score
- `confidence` (0-1): Overall confidence in analysis
- `reportGeneratedInMs`: Time to generate report
- `wordCount`: Total words in document
- `sourceMatches`: Top source categories and matches
- `matchedContentBreakdown`: Category percentages by source class
- `filters`: Applied filtering controls for quote/bibliography/small match exclusion
- `writingAnalysis`: Heuristic paraphrasing and writing pattern metrics
- `flaggedSections`: Array of suspicious sections with UI color hints

**Errors:**
- 404: Document not found
- 403: Unauthorized (document belongs to another user)
- 500: Analysis failed

---

### 3. Humanize Document

**Endpoint:** `POST /documents/:documentId/humanize`

**Headers:** Authorization (required)

**URL Parameters:**
- `documentId` (required): Document ID

**Request Body:**
```json
{
  "style": "formal",
  "sections": ["optional", "specific", "sections"]
}
```

**Style Options:**
- `formal`: Professional and structured academic writing
- `simplified`: Clear and accessible language
- `scholarly`: Advanced expert-level writing

**Response (200):**
```json
{
  "message": "Humanization completed",
  "result": {
    "humanizedText": "The humanized version of the text...",
    "originalWordCount": 5234,
    "humanizedWordCount": 5412,
    "style": "formal",
    "readabilityScore": 62
  }
}
```

**Response Fields:**
- `humanizedText`: Rewritten content
- `originalWordCount`: Word count before humanization
- `humanizedWordCount`: Word count after humanization
- `style`: Applied writing style
- `readabilityScore`: 0-100 readability score

**Errors:**
- 404: Document not found
- 403: Unauthorized
- 500: Humanization failed

---

### 4. Upsert Document Feedback

**Endpoint:** `POST /documents/:documentId/feedback`

**Headers:** Authorization (required)

**URL Parameters:**
- `documentId` (required): Document ID

**Request Body:**
```json
{
  "quickMarks": ["Add citation", "Clarify claim"],
  "inlineComments": [
    { "text": "Great transition", "startIndex": 120, "endIndex": 166 }
  ],
  "rubricScore": 86,
  "audioFeedbackUrl": "https://cdn.example.edu/feedback/a1b2c3.mp3"
}
```

**Response (200):**
```json
{
  "message": "Feedback updated",
  "grading": {
    "quickMarks": ["Add citation", "Clarify claim"],
    "inlineComments": [
      { "text": "Great transition", "startIndex": 120, "endIndex": 166 }
    ],
    "rubricScore": 86,
    "audioFeedbackUrl": "https://cdn.example.edu/feedback/a1b2c3.mp3"
  }
}
```

---

### 5. Get Document Details

**Endpoint:** `GET /documents/:documentId`

**Headers:** Authorization (required)

**URL Parameters:**
- `documentId` (required): Document ID

**Response (200):**
```json
{
  "document": {
    "id": "507f1f77bcf86cd799439012",
    "originalName": "my-research-paper.pdf",
    "fileSize": 245632,
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00Z",
    "extractedText": "Full extracted text...",
    "analysis": {
      "aiScore": 0.75,
      "plagiarismScore": 0.42,
      "humanizedText": "Humanized version...",
      "rewriteStyle": "formal",
      "flaggedSections": [...]
    }
  }
}
```

**Errors:**
- 404: Document not found
- 403: Unauthorized

---

### 6. List Documents

**Endpoint:** `GET /documents`

**Headers:** Authorization (required)

**Query Parameters (optional):**
- `limit`: Number of documents (default: 50)
- `skip`: Number of documents to skip for pagination (default: 0)

**Response (200):**
```json
{
  "documents": [
    {
      "id": "507f1f77bcf86cd799439012",
      "originalName": "paper1.pdf",
      "fileSize": 245632,
      "status": "completed",
      "createdAt": "2024-01-15T10:30:00Z",
      "analysis": {
        "aiScore": 0.75,
        "plagiarismScore": 0.42
      }
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "originalName": "paper2.docx",
      "fileSize": 156234,
      "status": "processing",
      "createdAt": "2024-01-15T11:45:00Z",
      "analysis": null
    }
  ]
}
```

**Errors:**
- 401: Unauthorized

---

### 7. Delete Document

**Endpoint:** `DELETE /documents/:documentId`

**Headers:** Authorization (required)

**URL Parameters:**
- `documentId` (required): Document ID

**Response (200):**
```json
{
  "message": "Document deleted successfully"
}
```

**Errors:**
- 404: Document not found
- 403: Unauthorized

---

## Assignment Endpoints

### 1. Create Assignment
**Endpoint:** `POST /assignments`

### 2. List Assignments
**Endpoint:** `GET /assignments`

### 3. Get Assignment
**Endpoint:** `GET /assignments/:assignmentId`

### 4. Update Assignment
**Endpoint:** `PUT /assignments/:assignmentId`

### 5. Delete Assignment
**Endpoint:** `DELETE /assignments/:assignmentId`

**Example assignment payload:**
```json
{
  "title": "Final Research Essay",
  "course": "ENG-401",
  "instructions": "Submit a 3000-word essay with citations",
  "dueDate": "2026-05-20T23:59:00.000Z",
  "allowResubmission": true,
  "groupAssignment": false,
  "quickMarksLibrary": ["Needs citation", "Stronger thesis needed"],
  "rubric": [
    { "title": "Argument quality", "description": "Clarity and depth", "maxPoints": 40 },
    { "title": "Evidence", "description": "Sources and support", "maxPoints": 30 }
  ]
}
```

---

## Peer Review Endpoints

### 1. Assign Peer Review
**Endpoint:** `POST /peer-reviews/assignments/:assignmentId`

**Request Body:**
```json
{
  "reviewerId": "507f1f77bcf86cd799439011",
  "revieweeDocumentId": "507f1f77bcf86cd799439012"
}
```

### 2. List Assignment Reviews
**Endpoint:** `GET /peer-reviews/assignments/:assignmentId`

### 3. Submit Assigned Review
**Endpoint:** `POST /peer-reviews/:reviewId/submit`

**Request Body:**
```json
{
  "comments": [
    { "text": "Evidence needs stronger citation", "startIndex": 210, "endIndex": 290 }
  ],
  "rubricScores": [
    { "criterionTitle": "Argument quality", "score": 30, "maxPoints": 40 }
  ]
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal error |

---

## Document Status

- `pending`: Awaiting processing
- `processing`: Currently being analyzed
- `completed`: Analysis complete
- `failed`: Analysis failed

---

## Error Response Format

```json
{
  "error": "Description of what went wrong"
}
```

---

## Rate Limiting

- 100 requests per 15 minutes per IP
- Headers returned:
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

---

## Example Usage

### JavaScript/Fetch

```javascript
// Register
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'securePassword123',
    confirmPassword: 'securePassword123'
  })
});
const { token } = await registerResponse.json();

// Upload document
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:5000/api/documents/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
const { document } = await uploadResponse.json();

// Analyze
const analyzeResponse = await fetch(`http://localhost:5000/api/documents/${document.id}/analyze`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
const { analysis } = await analyzeResponse.json();

// Humanize
const humanizeResponse = await fetch(`http://localhost:5000/api/documents/${document.id}/humanize`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ style: 'formal' })
});
const { result } = await humanizeResponse.json();
```

### cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
  }'

# Upload
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer TOKEN_HERE" \
  -F "file=@path/to/file.pdf"

# Analyze
curl -X POST http://localhost:5000/api/documents/DOCUMENT_ID/analyze \
  -H "Authorization: Bearer TOKEN_HERE"

# Humanize
curl -X POST http://localhost:5000/api/documents/DOCUMENT_ID/humanize \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"style": "formal"}'
```

---

## Webhook Support (Future)

Webhooks will be added to notify your application when:
- Document analysis completes
- Humanization finishes
- Processing errors occur

---

## Rate Limit Handling

```javascript
// Implement exponential backoff for rate limits
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
```

---

## Versioning

Current API version: **v1**

Future: Support for `/api/v2` with backwards compatibility

---

For more information, visit the documentation at `/docs` or contact support@plaque.app
