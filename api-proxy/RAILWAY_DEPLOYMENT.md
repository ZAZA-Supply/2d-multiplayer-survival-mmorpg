# Railway Deployment Guide for API Proxy

This guide explains how to deploy the API Proxy server to Railway.

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository connected to Railway
- OpenAI API key

## Railway Setup Steps

### 1. Create a New Service in Railway

1. Go to your Railway project dashboard
2. Click **"New"** → **"GitHub Repo"** (or **"Empty Service"** if deploying manually)
3. Select your repository

### 2. Configure the Service Root Directory

**Important:** Railway needs to know this service runs from the `api-proxy` directory.

**Option A: Auto-detection (if Railway detects the service)**
- Railway may auto-detect the `api-proxy/railway.toml` file and create a service automatically
- Verify the root directory is set to `api-proxy`

**Option B: Manual Configuration**
1. After creating the service, go to **Settings** → **Service**
2. Set **Root Directory** to `api-proxy`
3. Railway will automatically use the `api-proxy/railway.toml` configuration

**Option C: If Railway doesn't detect railway.toml**
- Go to **Settings** → **Build**
- **Root Directory:** `api-proxy`
- **Build Command:** `npm install` (or leave blank to use railway.toml)
- **Start Command:** `npm start` (or leave blank to use railway.toml)

**Port:** Railway will automatically set the `PORT` environment variable (no need to configure manually)

### 3. Set Environment Variables

In Railway, go to your service → **Variables** tab and add:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `OPENAI_API_KEY` | `sk-your-openai-api-key-here` | Your OpenAI API key (required) |
| `NODE_ENV` | `production` | Set to production mode |
| `CLIENT_URL` | `https://your-client-railway-url.up.railway.app` | Your production client URL for CORS (optional, but recommended) |

**Important:** 
- The `OPENAI_API_KEY` is **required** - the server will exit if it's not set
- Railway automatically sets `PORT` - don't override it
- Set `CLIENT_URL` to match your production client deployment URL

### 4. Deploy

Once configured, Railway will:
1. Detect changes on your main branch
2. Build the service using `npm install`
3. Start the service using `npm start`
4. Expose it via a public URL

### 5. Get Your Service URL

After deployment:
1. Go to your service in Railway
2. Click on **"Settings"** → **"Networking"**
3. Generate a **Public Domain** (or use the default Railway domain)
4. Copy the URL (e.g., `https://api-proxy-production.up.railway.app`)

### 6. Update Client Configuration

Update your client's environment variables to use the Railway proxy URL:

**In Railway (for your client service):**
- Add variable: `VITE_API_PROXY_URL` = `https://your-api-proxy-url.up.railway.app`

**Or in your local `.env` file (for development):**
```env
VITE_API_PROXY_URL=https://your-api-proxy-url.up.railway.app
```

## Health Check

The service includes a health check endpoint at `/health` that Railway will use to monitor the service.

Test it:
```bash
curl https://your-api-proxy-url.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "openaiConfigured": true
}
```

## Troubleshooting

### Service Won't Start

1. **Check Logs:** Railway dashboard → Your service → **"Deployments"** → Click on latest deployment → View logs
2. **Common Issues:**
   - Missing `OPENAI_API_KEY` - Check environment variables
   - Port conflicts - Railway handles this automatically
   - Build failures - Check that `tsx` is installed (should be in dependencies)

### CORS Errors

If you see CORS errors from your client:
1. Verify `CLIENT_URL` environment variable is set correctly in Railway
2. Check that your client's URL matches the `CLIENT_URL` value
3. The server allows localhost origins in development mode automatically

### API Key Not Found

If you see "OPENAI_API_KEY not found":
1. Go to Railway → Your service → **Variables**
2. Verify `OPENAI_API_KEY` is set (it should be marked as "Secret")
3. Redeploy the service after adding the variable

## Manual Deployment (Alternative)

If you prefer to deploy manually without GitHub integration:

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Link to project: `railway link`
5. Set variables: `railway variables set OPENAI_API_KEY=sk-...`
6. Deploy: `railway up`

## Notes

- Railway automatically restarts the service on failure (configured in `railway.toml`)
- Health checks run every 30 seconds (configurable)
- The service listens on `0.0.0.0` to accept connections from Railway's network
- Environment variables set in Railway take precedence over `.env` files

