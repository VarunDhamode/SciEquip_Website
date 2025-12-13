# IMMEDIATE FIX: Open Azure SQL Firewall

## The Problem
Vercel Serverless functions don't have static IP addresses, so Azure SQL can't whitelist them. This is why login fails.

## The Solution
Open Azure SQL firewall to allow ALL IP addresses. This will make login work immediately for all users.

## Step-by-Step Instructions

### 1. Open Azure Portal
Go to https://portal.azure.com and sign in

### 2. Navigate to Your SQL Server
- Click "All resources" in the left sidebar
- Find and click on `sciequip-db-server` (your SQL Server, NOT the database)

### 3. Open Networking Settings
- In the left menu, find **Security** section
- Click on **Networking**

### 4. Add Firewall Rule
- Under "Firewall rules", click **+ Add a firewall rule**
- Fill in:
  - **Rule name**: `AllowAll`
  - **Start IP**: `0.0.0.0`
  - **End IP**: `255.255.255.255`
- Click **OK**

### 5. Enable Azure Services (Important!)
- Find the checkbox: **"Allow Azure services and resources to access this server"**
- Make sure it's **CHECKED** ✅
- Click **Save** at the top

### 6. Wait 1 Minute
Azure needs a moment to apply the changes.

### 7. Test Login
- Go to https://sci-equip-website.vercel.app/
- Click "Sign In"
- Try logging in with any valid user credentials
- It should work now! ✅

## Screenshots Guide

Here's what you should see:

**Networking Page:**
```
Firewall rules:
┌─────────────┬──────────────┬──────────────┐
│ Rule Name   │ Start IP     │ End IP       │
├─────────────┼──────────────┼──────────────┤
│ AllowAll    │ 0.0.0.0      │ 255.255.255.255│
└─────────────┴──────────────┴──────────────┘

☑ Allow Azure services and resources to access this server
```

## Security Note

⚠️ **This configuration allows connections from anywhere in the world.**

Good news:
- ✅ Login will work for all users immediately
- ✅ Your database still requires valid username/password
- ✅ Your backend code uses parameterized queries (prevents SQL injection)

If you want to improve security later:
- Deploy backend to Azure App Service (has static IP)
- Remove the 0.0.0.0-255.255.255.255 rule
- Whitelist only the App Service IP

## Troubleshooting

**If login still doesn't work after this:**
1. Check browser console (F12) for errors
2. Verify the firewall rule was saved
3. Try a hard refresh (Ctrl+Shift+R)
4. Check Vercel deployment logs for errors

**Common mistakes:**
- ❌ Opening the DATABASE settings instead of SERVER settings
- ❌ Not clicking "Save" after adding the rule
- ❌ Not enabling "Allow Azure services"

## Alternative Solution (If This Doesn't Work)

If opening the firewall doesn't solve it, the issue might be with Vercel configuration. In that case:

1. Check Vercel Function Logs:
   - Go to Vercel Dashboard
   - Click on your deployment
   - Click "Functions" tab
   - Look for `/api/*` functions
   - Check the logs for errors

2. If you see "Cannot find module" errors:
   - The serverless function isn't finding dependencies
   - Let me know and I'll help fix the Vercel configuration
