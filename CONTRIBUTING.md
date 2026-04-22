# Comprehensive Development Guide

## Quick Commands Reference

### Backend
```bash
# Development
npm run dev          # Start dev server with auto-reload

# Production
npm run build        # Compile TypeScript to JavaScript
npm start           # Start production server

# Linting
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
```

### Frontend
```bash
# Development
npm start           # Start React dev server

# Production
npm run build       # Create optimized production build
npm run test        # Run tests

# Linting
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
```

## Git Workflow

```bash
# Clone repository
git clone https://github.com/yourusername/plaque.git
cd plaque

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# Test locally
# Commit changes
git add .
git commit -m "feat: description of feature"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Wait for code review
# Merge to main
```

## Environment Setup for Contributors

### 1. Node Version
```bash
# Use Node 16+ (check with nvm)
nvm use 16
node --version  # v16.x.x or higher
```

### 2. IDE Setup

#### VS Code Extensions (Recommended)
- ESLint
- Prettier
- MongoDB for VS Code
- Thunder Client / REST Client
- TypeScript Vue Plugin

#### VS Code Settings
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 3. Pre-commit Hooks

```bash
# Install husky (optional but recommended)
npm install husky --save-dev
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint"
```

## Common Development Tasks

### Adding a New API Endpoint

1. **Create Controller Method**
   ```typescript
   // backend/src/controllers/myController.ts
   export class MyController {
     static async myAction(req: AuthRequest, res: Response) {
       // Implementation
     }
   }
   ```

2. **Create Route**
   ```typescript
   // backend/src/routes/myRoutes.ts
   router.post('/my-endpoint', authenticate, MyController.myAction);
   ```

3. **Test with Postman/cURL**
   ```bash
   curl -X POST http://localhost:5000/api/my-endpoint \
     -H "Authorization: Bearer TOKEN"
   ```

### Adding a New Frontend Component

1. **Create Component**
   ```typescript
   // frontend/src/components/MyComponent.tsx
   const MyComponent: React.FC<Props> = ({ prop }) => {
     return <div>Component</div>;
   };
   export default MyComponent;
   ```

2. **Add to Page**
   ```typescript
   import MyComponent from '../components/MyComponent';
   // Use in JSX
   <MyComponent prop={value} />
   ```

3. **Test Component**
   - Manual testing in browser
   - Check React DevTools
   - Verify styling

### Adding a New Service

1. **Create Service Class**
   ```typescript
   // backend/src/services/myService.ts
   export class MyService {
     static async myMethod(data: any) {
       // Implementation
     }
   }
   ```

2. **Use in Controller**
   ```typescript
   import { MyService } from '../services/myService';
   
   const result = await MyService.myMethod(data);
   ```

## Debugging Tips

### Backend Debugging

```bash
# 1. Add debug logs
console.log('Debug:', variable);

# 2. Use debugger statement
debugger;  // Pauses execution in Chrome DevTools

# 3. VS Code debugger (launch.json)
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/backend/src/server.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
    }
  ]
}

# 4. Check logs
# MongoDB: mongod console output
# Backend: Terminal output
# Frontend: Browser console (F12)
```

### Frontend Debugging

```bash
# 1. React DevTools
# Chrome extension for React component inspection

# 2. Redux DevTools (if using Redux)
# Chrome extension for state management

# 3. Network tab
# Check API requests and responses

# 4. Console errors
# Press F12 to open developer tools

# 5. Source maps
# Set breakpoints directly in source code
```

## Testing Guidelines

### Unit Tests (Backend)
```typescript
// test/services/myService.test.ts
describe('MyService', () => {
  it('should do something', () => {
    const result = MyService.myMethod(input);
    expect(result).toBe(expected);
  });
});

// Run tests
npm test
```

### Component Tests (Frontend)
```typescript
// test/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />);
    expect(screen.getByText('expected')).toBeInTheDocument();
  });
});
```

## Code Style Guide

### TypeScript
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
}

// Use proper typing
const getUser = (id: string): User => {
  // Implementation
};

// Avoid 'any'
// ❌ const data: any = ...
// ✅ const data: User = ...
```

### React Components
```typescript
// Use functional components with TypeScript
interface ComponentProps {
  title: string;
  onClick?: () => void;
}

const MyComponent: React.FC<ComponentProps> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};
```

### CSS/Tailwind
```html
<!-- Use Tailwind utility classes -->
<div className="bg-white p-6 rounded-lg shadow-lg">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <p className="text-gray-600">Description</p>
</div>

<!-- Responsive design -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Columns adjust based on screen size -->
</div>
```

## Commit Message Convention

```
type: subject

body

footer

# Examples:
feat: add humanization service
fix: correct AI detection threshold
docs: update API documentation
style: format code with Prettier
refactor: reorganize service files
test: add unit tests for auth
chore: update dependencies

# Commit template
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement lazy loading with React.lazy
- Optimize images
- Use CSS modules or styled-components
- Profile with Chrome DevTools

### Backend
- Add database indexes
- Implement caching
- Use async/await properly
- Pool database connections
- Compress responses

## Security Best Practices

1. **Never commit .env files**
   - Use .env.example instead
   - Check .gitignore is configured

2. **Validate user input**
   - Frontend: Client-side validation
   - Backend: Server-side validation with Joi

3. **Secure sensitive data**
   - Use environment variables
   - Hash passwords with bcrypt
   - Sign JWTs with strong secret

4. **HTTPS in production**
   - Use Let's Encrypt for SSL
   - Update CORS configuration
   - Enable secure cookies

5. **Regular updates**
   - Keep dependencies updated
   - Check for vulnerabilities: `npm audit`
   - Review security advisories

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Cache Issues
```bash
# Clear npm cache
npm cache clean --force

# Clear bundler cache
rm -rf dist/ build/
```

### Database Issues
```bash
# Check MongoDB connection
mongosh mongodb://localhost:27017

# Drop database (development only!)
db.dropDatabase()
```

## Performance Profiling

### Frontend
```javascript
// Measure component render time
console.time('ComponentName');
// ... code ...
console.timeEnd('ComponentName');

// Use React Profiler API
```

### Backend
```typescript
// Measure function execution
console.time('functionName');
const result = await slowFunction();
console.timeEnd('functionName');

// Use APM tools (New Relic, Datadog)
```

## Documentation

### Code Documentation
```typescript
/**
 * Analyzes a document for AI-generated content
 * @param text The document text to analyze
 * @returns Promise<number> AI probability score (0-1)
 */
export const analyzeDocument = async (text: string): Promise<number> => {
  // Implementation
};
```

### API Documentation
- See docs/API.md
- Keep updated when adding endpoints
- Include request/response examples

### README
- Update when adding features
- Keep setup instructions current
- Link to detailed documentation

## Resources

### Documentation
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code](https://code.visualstudio.com/) - Code editor
- [Git](https://git-scm.com/) - Version control

### Learning
- [freeCodeCamp](https://www.freecodecamp.org/)
- [Udemy Courses](https://www.udemy.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Stack Overflow](https://stackoverflow.com/)

## Getting Help

- **Issues**: Check GitHub issues
- **Discussions**: Use GitHub discussions
- **Email**: support@plaque.app
- **Documentation**: See docs/ folder

## Contributing Code

1. Fork the repository
2. Create a feature branch
3. Follow code style guide
4. Add tests for new features
5. Commit with proper messages
6. Push to your branch
7. Create a Pull Request
8. Address review feedback
9. Merge when approved

Thank you for contributing to PLAQUE! 🚀
