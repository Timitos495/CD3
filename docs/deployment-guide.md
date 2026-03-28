# Deployment Guide

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Build succeeds (`npm run build`)
- [ ] Tests pass (if applicable)
- [ ] Code reviewed
- [ ] Version updated (if applicable)

## Deployment Platforms

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Traditional Node.js Hosting (Railway, Render, etc.)

```bash
# Build the application
npm run build

# Start production server
npm start
```

Ensure Node.js 18+ is installed on the hosting platform.

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public
COPY lib ./lib

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t coffee-dashboard:latest .
docker run -p 3000:3000 coffee-dashboard:latest
```

## Environment Variables

Configure these in your deployment platform:

```
# Add your environment variables here
NODE_ENV=production
```

## Monitoring

- Monitor error logs
- Track application performance
- Set up alerting for downtime

---

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
