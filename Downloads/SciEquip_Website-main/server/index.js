const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' }); // Load .env from root

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- AZURE SQL DATABASE CONFIGURATION ---
const dbUser = process.env.DB_USER || '2021varundhamode@gmail.com';
const dbPassword = process.env.DB_PASSWORD || 'V@run#2003';
const dbServer = process.env.DB_SERVER || 'sciequip-db-server.database.windows.net';
const dbName = process.env.DB_NAME || 'sciequip-db';

const sqlConfig = {
    server: dbServer,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    options: {
        encrypt: true,
        trustServerCertificate: false, // Set to true if having certificate issues, but false is safer for Azure
        connectTimeout: 30000 // Increase connection timeout to 30s
    }
};

// Handle Entra ID specific auth if needed (User mentioned they might use it), 
// but sticking to standard SQL Auth or Active Directory Password based on variables.
if (dbUser.includes('@')) {
    sqlConfig.authentication = {
        type: 'azure-active-directory-password',
        options: {
            userName: dbUser,
            password: dbPassword
        }
    };
}

// Create connection pool
let pool;

async function getConnection() {
    if (!pool) {
        try {
            pool = new sql.ConnectionPool(sqlConfig);
            await pool.connect();
            console.log('Connected to Azure SQL Database');
        } catch (err) {
            console.error('Database Connection Error:', err);
            pool = null; // Reset pool so we retry next time
            throw err;
        }
    }
    return pool;
}

// --- AUTH ROUTES ---

// 1. LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        await getConnection();
        const tables = ['Customers', 'Vendors', 'Admins'];

        for (const table of tables) {
            const request = pool.request();
            request.input('email', sql.NVarChar, email);
            request.input('password', sql.NVarChar, password);

            const result = await request.query(`SELECT * FROM ${table} WHERE email = @email AND password = @password`);

            if (result.recordset.length > 0) {
                const user = result.recordset[0];
                const role = table.slice(0, -1).toLowerCase();
                const { password: _, ...userWithoutPass } = user; // exclude password
                return res.json({ ...userWithoutPass, role });
            }
        }

        res.status(401).json({ error: 'Invalid credentials' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed due to server error' });
    }
});

// 2. REGISTER
app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    let table = '';
    if (role === 'customer') table = 'Customers';
    else if (role === 'vendor') table = 'Vendors';
    else if (role === 'admin') table = 'Admins';
    else return res.status(400).json({ error: 'Invalid role' });

    try {
        await getConnection();
        const request = pool.request();
        request.input('name', sql.NVarChar, name);
        request.input('email', sql.NVarChar, email);
        request.input('password', sql.NVarChar, password);

        await request.query(`INSERT INTO ${table} (name, email, password) VALUES (@name, @email, @password)`);
        res.json({ name, email, role, message: 'Registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed. Email might be in use.' });
    }
});

// --- DATA ROUTES ---

// 3. RFQS
app.get('/api/rfqs', async (req, res) => {
    const { userId, role } = req.query;
    try {
        await getConnection();
        const request = pool.request();
        let query = `
            SELECT r.*, c.name as customer_name 
            FROM RFQs r
            JOIN Customers c ON r.customer_id = c.id
        `;

        if (role === 'customer' && userId) {
            query += ` WHERE r.customer_id = @userId`;
            request.input('userId', sql.Int, userId);
        }

        query += ` ORDER BY r.created_at DESC`;

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Fetch RFQs error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/rfqs', async (req, res) => {
    const { title, category, description, budget, customerId } = req.body;
    try {
        await getConnection();
        const request = pool.request();
        request.input('title', sql.NVarChar, title);
        request.input('category', sql.NVarChar, category);
        request.input('description', sql.NVarChar, description);
        request.input('budget', sql.Decimal(18, 2), budget);
        request.input('customerId', sql.Int, customerId);

        await request.query('INSERT INTO RFQs (title, category, description, budget, customer_id) VALUES (@title, @category, @description, @budget, @customerId)');
        res.json({ message: 'RFQ Created' });
    } catch (err) {
        console.error('Create RFQ error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 4. BIDS
app.get('/api/bids', async (req, res) => {
    const { userId, role } = req.query;
    try {
        await getConnection();
        const request = pool.request();

        // Complex query to handle latest bids logic
        let query = `
            WITH RankedBids AS (
                SELECT b.*, v.id as vendor_id,
                       ROW_NUMBER() OVER (PARTITION BY b.rfq_id, b.vendor_email ORDER BY b.timestamp DESC) as rn
                FROM Bids b
                LEFT JOIN Vendors v ON b.vendor_email = v.email
            )
            SELECT * FROM RankedBids WHERE rn = 1
        `;

        if (role === 'customer' && userId) {
            query = `
                WITH RankedBids AS (
                    SELECT b.*, v.id as vendor_id,
                           ROW_NUMBER() OVER (PARTITION BY b.rfq_id, b.vendor_email ORDER BY b.timestamp DESC) as rn
                    FROM Bids b
                    LEFT JOIN Vendors v ON b.vendor_email = v.email
                )
                SELECT rb.* 
                FROM RankedBids rb
                JOIN RFQs r ON rb.rfq_id = r.id
                WHERE rb.rn = 1 AND r.customer_id = @userId
            `;
            request.input('userId', sql.Int, userId);
        } else if (role === 'vendor' && userId) {
            query = `
                WITH RankedBids AS (
                    SELECT b.*, v.id as vendor_id,
                           ROW_NUMBER() OVER (PARTITION BY b.rfq_id, b.vendor_email ORDER BY b.timestamp DESC) as rn
                    FROM Bids b
                    LEFT JOIN Vendors v ON b.vendor_email = v.email
                )
                SELECT * FROM RankedBids 
                WHERE rn = 1 AND vendor_id = @userId
            `;
            request.input('userId', sql.Int, userId);
        }

        query += ` ORDER BY timestamp DESC`;
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Fetch Bids error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bids', async (req, res) => {
    const { rfqId, vendorName, vendorEmail, price, proposal } = req.body;
    try {
        await getConnection();
        const request = pool.request();
        request.input('rfqId', sql.Int, rfqId);
        request.input('vendorName', sql.NVarChar, vendorName);
        request.input('vendorEmail', sql.NVarChar, vendorEmail);
        request.input('price', sql.Decimal(18, 2), price);
        request.input('proposal', sql.NVarChar, proposal);

        await request.query('INSERT INTO Bids (rfq_id, vendor_name, vendor_email, price, proposal) VALUES (@rfqId, @vendorName, @vendorEmail, @price, @proposal)');

        // Update bid count
        await pool.request().input('id', sql.Int, rfqId).query('UPDATE RFQs SET vendor_bids = vendor_bids + 1 WHERE id = @id');

        res.json({ message: 'Bid Submitted' });
    } catch (err) {
        console.error('Submit Bid error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 5. CHAT (Restoring Chat Routes)
app.get('/api/conversations/:userId/:userType', async (req, res) => {
    const { userId, userType } = req.params;
    try {
        await getConnection();
        const request = pool.request();
        request.input('userId', sql.Int, userId);

        let query;
        if (userType === 'customer') {
            query = `
                SELECT c.*, 
                    v.name as vendor_name, 
                    v.email as vendor_email,
                    r.title as rfq_title,
                    os.is_online as vendor_online
                FROM Conversations c
                JOIN Vendors v ON c.vendor_id = v.id
                JOIN RFQs r ON c.rfq_id = r.id
                LEFT JOIN OnlineStatus os ON os.user_id = v.id AND os.user_type = 'vendor'
                WHERE c.customer_id = @userId
                ORDER BY c.last_message_at DESC
            `;
        } else {
            query = `
                SELECT c.*, 
                    cu.name as customer_name, 
                    cu.email as customer_email,
                    r.title as rfq_title,
                    os.is_online as customer_online
                FROM Conversations c
                JOIN Customers cu ON c.customer_id = cu.id
                JOIN RFQs r ON c.rfq_id = r.id
                LEFT JOIN OnlineStatus os ON os.user_id = cu.id AND os.user_type = 'customer'
                WHERE c.vendor_id = @userId
                ORDER BY c.last_message_at DESC
            `;
        }

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/messages', async (req, res) => {
    // This is the simplified message logic from step 7
    const { conversationId, senderId, senderType, messageText, rfqId, customerId, vendorId } = req.body;
    try {
        await getConnection();
        let convId = conversationId;

        // Create conversation if needed
        if (!convId && rfqId) {
            // Logic to find or create conversation (simplified for conciseness but robust enough)
            // We can check if exists
            const checkOrCr = pool.request();
            checkOrCr.input('rfqId', sql.Int, rfqId);
            checkOrCr.input('customerId', sql.Int, customerId);
            checkOrCr.input('vendorId', sql.Int, vendorId);

            // Try to find
            const existing = await checkOrCr.query('SELECT id FROM Conversations WHERE rfq_id=@rfqId AND customer_id=@customerId AND vendor_id=@vendorId');
            if (existing.recordset.length > 0) convId = existing.recordset[0].id;
            else {
                const newC = await checkOrCr.query('INSERT INTO Conversations (rfq_id, customer_id, vendor_id) OUTPUT INSERTED.id VALUES (@rfqId, @customerId, @vendorId)');
                convId = newC.recordset[0].id;
            }
        }

        const request = pool.request();
        request.input('convId', sql.Int, convId);
        request.input('senderId', sql.Int, senderId);
        request.input('senderType', sql.NVarChar, senderType);
        request.input('text', sql.NVarChar, messageText);

        const result = await request.query('INSERT INTO Messages (conversation_id, sender_id, sender_type, message_text) OUTPUT INSERTED.* VALUES (@convId, @senderId, @senderType, @text)');

        // Update conversation timestamp
        await pool.request().input('cid', sql.Int, convId).query('UPDATE Conversations SET last_message_at = GETDATE() WHERE id = @cid');

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Send message error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/messages/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    try {
        await getConnection();
        const request = pool.request();
        request.input('cid', sql.Int, conversationId);
        const result = await request.query('SELECT * FROM Messages WHERE conversation_id = @cid ORDER BY created_at ASC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- STATIC FILE SERVING (Azure Web App) ---
// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React routing - send all non-API requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// --- SERVER START ---
if (process.env.VERCEL) {
    module.exports = app;
} else {
    const server = require('http').createServer(app);
    // Socket.io initialization (Standard)
    const io = require('socket.io')(server, {
        cors: { origin: "*", methods: ["GET", "POST"] }
    });

    io.on('connection', (socket) => {
        // Basic socket join
        socket.on('user:join', ({ userId, userType }) => {
            // join logic
        });
    });

    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
