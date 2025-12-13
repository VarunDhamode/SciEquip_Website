# PERMANENT FIX: Deploy Backend to Render.com

## Why This Fixes Everything
- Render.com supports full Node.js apps (not serverless)
- Your database connection will work properly
- Free tier available
- Auto-deploys from GitHub
- Login will work for ALL users

## Step-by-Step Guide

### Part 1: Deploy Backend to Render

1. **Go to Render.com**
   - Visit https://render.com
   - Click "Get Started for Free"
   - Sign up with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if asked
   - Select your `SciEquip_Website` repository

3. **Configure the Service**
   Fill in these settings:
   - **Name**: `sciequip-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free`

4. **Add Environment Variables**
   Scroll down to "Environment Variables" and click "Add Environment Variable":
   
   Add these one by one:
   ```
   DB_SERVER = sciequip-db-server.database.windows.net
   DB_NAME = sciequip-db
   DB_USER = 2021varundhamode@gmail.com
   DB_PASSWORD = V@run#2003
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - You'll get a URL like: `https://sciequip-backend.onrender.com`

### Part 2: Update Frontend on Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click on your `sci-equip-website` project

2. **Add Environment Variable**
   - Go to Settings → Environment Variables
   - Add new variable:
     ```
     VITE_API_BASE_URL = https://sciequip-backend.onrender.com/api
     ```
   - Important: Replace `sciequip-backend` with YOUR actual Render URL

3. **Redeploy Frontend**
   - Go to Deployments tab
   - Click three dots on latest deployment
   - Click "Redeploy"

### Part 3: Test Login

1. Wait for both deployments to finish (2-3 minutes)
2. Go to https://sci-equip-website.vercel.app/
3. Click "Sign In"
4. Use: `rutik@gmail.com` / `rutik123`
5. Login should work! ✅

## Why This Works

```
User Browser
    ↓
Vercel (Frontend - Free)
    ↓ HTTPS
Render.com (Backend - Free) 
    ↓ Persistent Connection
Azure SQL Database
```

- **Vercel**: Hosts your React frontend perfectly (what it's designed for)
- **Render**: Runs your full Node.js backend with persistent database connections
- **Azure SQL**: Your existing database (no changes needed)

## Troubleshooting

**If login still doesn't work:**

1. Check Render Logs:
   - Go to Render dashboard
   - Click on your service
   - Click "Logs" tab
   - Look for "Connected to Azure SQL Database" message
   - If you see connection errors, check your environment variables

2. Check Frontend is using correct URL:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try logging in
   - Check if requests go to `https://YOUR-APP.onrender.com/api/login`

3. Test Backend Directly:
   - Open `https://YOUR-APP.onrender.com/api/users` in browser
   - You should see JSON data (not an error page)

## Important Notes

- ✅ Render free tier is always on (doesn't sleep like Heroku free tier did)
- ✅ Auto-deploys when you push to GitHub
- ✅ Supports WebSockets (for your chat feature)
- ✅ Has logs for debugging
- ⚠️ First request might be slow (cold start)

## Cost
- Render.com: **FREE** (for small apps)
- Vercel: **FREE** (for personal projects)
- Azure SQL: ~$5/month (you're already paying this)

**Total new cost: $0**
