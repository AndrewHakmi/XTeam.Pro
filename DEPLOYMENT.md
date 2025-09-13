# XTeam.Pro Deployment Guide

This guide covers deploying the XTeam.Pro application to production using Vercel for the frontend and Railway for the backend.

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- Vercel CLI installed (`npm i -g vercel`)
- Railway CLI installed (optional)
- PostgreSQL database (for production)

## Frontend Deployment (Vercel)

### 1. Prepare for Deployment

```bash
# Build the project
npm run build

# Test the build locally
npm run preview
```

### 2. Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configure Environment Variables in Vercel

In your Vercel dashboard, add these environment variables:

- `VITE_API_URL`: Your backend URL (e.g., `https://your-app.railway.app`)
- `VITE_ENVIRONMENT`: `production`

## Backend Deployment (Railway)

### 1. Prepare Backend

1. Create a PostgreSQL database on Railway
2. Update `.env.production` with your database URL and other production values
3. Update CORS_ORIGINS with your Vercel frontend URL

### 2. Deploy to Railway

#### Option A: Using Railway CLI

```bash
cd backend
railway login
railway link
railway up
```

#### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Railway will automatically deploy from the `backend` folder

### 3. Configure Environment Variables in Railway

Add these environment variables in Railway dashboard:

- `DATABASE_URL`: Your PostgreSQL connection string
- `SECRET_KEY`: A secure random string
- `OPENAI_API_KEY`: Your OpenAI API key
- `CORS_ORIGINS`: Your Vercel frontend URL
- `ENVIRONMENT`: `production`
- `DEBUG`: `false`
- `SMTP_*`: Your email configuration

## Alternative Backend Deployment (Render)

If you prefer Render over Railway:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables as listed above

## Post-Deployment Steps

### 1. Update Configuration Files

After getting your deployment URLs, update:

- `vercel.json`: Replace `https://your-backend-url.com` with actual backend URL
- `.env.production`: Replace placeholder URLs with actual URLs
- `backend/.env.production`: Replace placeholder URLs with actual URLs

### 2. Test the Deployment

1. Visit your frontend URL
2. Test all major features:
   - Language switching
   - AI System Audit
   - ROI Calculator
   - Contact form
   - Admin panel

### 3. Monitor and Maintain

- Check Railway/Render logs for any errors
- Monitor Vercel deployment logs
- Set up monitoring and alerts

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS_ORIGINS includes your frontend URL
2. **Database Connection**: Verify DATABASE_URL is correct
3. **Environment Variables**: Double-check all required variables are set
4. **Build Failures**: Check Node.js/Python versions match requirements

### Logs

- **Vercel**: Check deployment logs in Vercel dashboard
- **Railway**: Use `railway logs` or check Railway dashboard
- **Render**: Check logs in Render dashboard

## Security Considerations

1. Use strong SECRET_KEY for JWT tokens
2. Enable HTTPS (handled by platforms)
3. Set proper CORS origins
4. Use environment variables for all secrets
5. Regular security updates

## Performance Optimization

1. Enable gzip compression (handled by platforms)
2. Use CDN for static assets (Vercel handles this)
3. Database connection pooling
4. Monitor response times and optimize queries

## Backup and Recovery

1. Regular database backups
2. Environment variable backups
3. Code repository backups (GitHub)
4. Deployment configuration backups