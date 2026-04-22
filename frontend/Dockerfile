FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/build ./build

EXPOSE 3000

ENV REACT_APP_API_URL=http://localhost:5000/api

CMD ["npm", "start"]
