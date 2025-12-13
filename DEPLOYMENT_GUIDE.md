# Azure App Service + Netlify Deployment Guide

This guide will help you deploy your secure SciEquip application following industry best practices.

## Architecture Overview

```
Users → Netlify (Frontend) → Azure App Service (Backend API) → Azure SQL Database
```

## Part 1: Deploy Backend to Azure App Service

### Prerequisites
- Azure account with active subscription
- Azure CLI installed (optional but recommended)

### Step 1: Create Azure App Service

1. **Via Azure Portal:**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Click "Create a resource" → "Web App"
   - Fill in details:
     - **App name**: `sciequip-backend` (must be globally unique)
     - **Runtime stack**: Node 18 LTS
     - **Region**: Choose closest to your users
     - **Pricing tier**: B1 Basic (or F1 Free for testing)
   - Click "Review + Create"

### Step 2: Configure Environment Variables

1. Go to your App Service → **Configuration** → **Application settings**
2. Add the following:
   ```
   DB_SERVER = sciequip-db-server.database.windows.net
   DB_NAME = sciequip-db
   DB_USER = 2021varundhamode@gmail.com
   DB_PASSWORD = V@run#2003
   ```
3. Click **Save**

### Step 3: Deploy Backend Code

**Option A: Via VS Code (Recommended)**
1. Install "Azure App Service" extension in VS Code
2. Right-click `server` folder → "Deploy to Web App"
3. Select your App Service
4. Wait for deployment to complete

**Option B: Via GitHub Actions**
1. In Azure Portal, go to App Service → Deployment Center
2. Select "GitHub" as source
3. Authorize and select your repository
4. Set **Build path** to `server`
5. Azure will auto-deploy on every push

**Option C: Via ZIP Deploy**
1. Create a ZIP of the `server` folder
2. Use Azure CLI:
   ```bash
   az webapp deployment source config-zip --resource-group <group-name> --name sciequip-backend --src server.zip
   ```

### Step 4: Test Backend

1. Open `https://sciequip-backend.azurewebsites.net/api/users`
2. You should see a JSON response (not an error)
3. Note this URL for frontend configuration

## Part 2: Configure Azure SQL Firewall

1. Go to Azure Portal → SQL Server (not database) → **Networking**
2. Under "Firewall rules":
   - ✅ Enable "Allow Azure services and resources to access this server"
   - ❌ Do NOT add 0.0.0.0 - 255.255.255.255
3. Click **Save**

> **Why this works:** Azure App Service's outbound traffic is recognized as an Azure service, so it can connect without specific IP whitelisting.

## Part 3: Deploy Frontend to Netlify

### Step 1: Prepare Frontend

Ensure your code is pushed to GitHub with the latest changes.

### Step 2: Create Netlify Site

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and authorize
4. Choose your `SciEquip_Website` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Step 3: Configure Environment Variable

1. In Netlify, go to Site Settings → Environment Variables
2. Add:
   ```
   VITE_API_BASE_URL = https://sciequip-backend.azurewebsites.net/api
   ```
3. Click "Save"
4. Trigger a redeploy: Deploys → "Trigger deploy" → "Clear cache and deploy site"

## Part 4: Verification

### Test Login Flow

1. Open your Netlify site URL
2. Click "Sign In"
3. Enter valid credentials
4. Login should succeed ✅

### Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform login
4. Verify requests go to `https://sciequip-backend.azurewebsites.net/api`
5. Confirm NO requests to Azure SQL domain

## Troubleshooting

### "Connection timeout" error
- Check Azure SQL firewall has "Allow Azure services" enabled
- Verify App Service environment variables are set correctly

### "404 Not Found" on API calls
- Ensure `VITE_API_BASE_URL` in Netlify includes `/api` at the end
- Verify App Service is running (not stopped)

### Frontend shows old code
- Clear Netlify cache and redeploy
- Hard refresh browser (Ctrl+Shift+R)

## Security Checklist

- ✅ Backend is only place with database credentials
- ✅ Azure SQL firewall restricts access to Azure services only
- ✅ All SQL queries use parameterized inputs
- ✅ Frontend makes only HTTP API calls
- ✅ No direct database connections from browser

## Cost Estimation

- **Azure App Service B1**: ~$13/month
- **Azure SQL Basic**: ~$5/month
- **Netlify**: Free (up to 100GB bandwidth)
- **Total**: ~$18/month

## Maintenance

### Updating Backend
1. Push changes to GitHub
2. If using GitHub Actions, deployment is automatic
3. If using ZIP/VS Code, redeploy manually

### Updating Frontend
1. Push changes to GitHub
2. Netlify auto-deploys on every push to main branch

## Next Steps

1. Add custom domain in Netlify (Settings → Domain management)
2. Enable HTTPS (automatic with Netlify)
3. Set up monitoring in Azure (Application Insights)
4. Consider adding Redis cache for performance
