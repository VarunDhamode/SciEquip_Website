# Login & Connection Troubleshooting

If you are seeing "IP address is likely blocked" or "Connection Failed" errors, follow these steps.

## 1. Understanding the Issue
Your application connects to an **Azure SQL Database**. Microsoft Azure blocks all unknown IP addresses by default for security. 
- **The Code Fix**: We have updated the code to use robust credentials and handle errors better.
- **The Infrastructure Fix**: You MUST tell Azure to allow connections.

## 2. How to Allow ALL Users (Quick Fix)
To allow any user (including yourself and others) to connect from any IP address:

1.  Go to the [Azure Portal](https://portal.azure.com).
2.  Navigate to your **SQL Server** resource (e.g., `sciequip-db-server`).
3.  In the left menu, click **Networking** (or 'Firewalls and virtual networks').
4.  **Add a Firewall Rule**:
    - **Rule Name**: `AllowAll`
    - **Start IP**: `0.0.0.0`
    - **End IP**: `255.255.255.255`
5.  Click **Save**.

> **Note**: This makes your database accessible from the public internet. Ensure you have a strong password (which you do).

## 3. Verify Deployment
If your frontend is deployed (e.g., Vercel) and backend is on a different server:
- Ensure `VITE_API_BASE_URL` in your frontend deployment settings points to your backend URL (e.g., `https://my-sciequip-backend.herokuapp.com/api`).
