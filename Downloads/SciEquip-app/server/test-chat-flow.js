const sql = require('mssql');
require('dotenv').config({ path: '../.env' });

const sqlConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
    authentication: {
        type: 'azure-active-directory-default'
    }
};

// Override auth if password provided (same logic as index.js)
if (process.env.DB_USER && process.env.DB_PASSWORD) {
    if (process.env.DB_USER.includes('@')) {
        sqlConfig.authentication = {
            type: 'azure-active-directory-password',
            options: {
                userName: process.env.DB_USER,
                password: process.env.DB_PASSWORD
            }
        };
    } else {
        delete sqlConfig.authentication;
        sqlConfig.user = process.env.DB_USER;
        sqlConfig.password = process.env.DB_PASSWORD;
    }
}

async function testChatFlow() {
    try {
        await sql.connect(sqlConfig);
        console.log('Connected to DB');

        // 1. Get a vendor and a customer
        const vendorRes = await sql.query("SELECT TOP 1 * FROM Vendors");
        const customerRes = await sql.query("SELECT TOP 1 * FROM Customers");
        const rfqRes = await sql.query("SELECT TOP 1 * FROM RFQs");

        if (vendorRes.recordset.length === 0 || customerRes.recordset.length === 0 || rfqRes.recordset.length === 0) {
            console.log('Not enough data to test (need vendor, customer, rfq)');
            return;
        }

        const vendor = vendorRes.recordset[0];
        const customer = customerRes.recordset[0];
        const rfq = rfqRes.recordset[0];

        console.log(`Testing with Vendor: ${vendor.name} (${vendor.id}), Customer: ${customer.name} (${customer.id})`);

        // 2. Create/Get Conversation
        const checkConv = new sql.Request();
        checkConv.input('rfqId', sql.Int, rfq.id);
        checkConv.input('customerId', sql.Int, customer.id);
        checkConv.input('vendorId', sql.Int, vendor.id);

        // Check existing
        let convId;
        const existing = await checkConv.query(`
            SELECT id FROM Conversations 
            WHERE rfq_id = @rfqId AND customer_id = @customerId AND vendor_id = @vendorId
        `);

        if (existing.recordset.length > 0) {
            convId = existing.recordset[0].id;
            console.log('Using existing conversation:', convId);
        } else {
            const createConv = new sql.Request();
            createConv.input('rfqId', sql.Int, rfq.id);
            createConv.input('customerId', sql.Int, customer.id);
            createConv.input('vendorId', sql.Int, vendor.id);
            const newConv = await createConv.query(`
                INSERT INTO Conversations (rfq_id, customer_id, vendor_id)
                OUTPUT INSERTED.id
                VALUES (@rfqId, @customerId, @vendorId)
            `);
            convId = newConv.recordset[0].id;
            console.log('Created new conversation:', convId);
        }

        // 3. Send Message as Vendor
        const msgText = `Test message from vendor ${Date.now()}`;
        const sendReq = new sql.Request();
        sendReq.input('conversationId', sql.Int, convId);
        sendReq.input('senderId', sql.Int, vendor.id);
        sendReq.input('senderType', sql.NVarChar, 'vendor'); // Sending as 'vendor'
        sendReq.input('messageText', sql.NVarChar, msgText);

        await sendReq.query(`
            INSERT INTO Messages (conversation_id, sender_id, sender_type, message_text)
            VALUES (@conversationId, @senderId, @senderType, @messageText)
        `);
        console.log('Sent message as vendor');

        // 4. Fetch Messages
        const fetchReq = new sql.Request();
        fetchReq.input('conversationId', sql.Int, convId);
        const messagesRes = await fetchReq.query(`
            SELECT m.*, 
                CASE 
                    WHEN m.sender_type = 'customer' THEN c.name
                    ELSE v.name
                END as sender_name
            FROM Messages m
            LEFT JOIN Conversations conv ON m.conversation_id = conv.id
            LEFT JOIN Customers c ON m.sender_id = c.id AND m.sender_type = 'customer'
            LEFT JOIN Vendors v ON m.sender_id = v.id AND m.sender_type = 'vendor'
            WHERE m.conversation_id = @conversationId
            ORDER BY m.created_at DESC
        `);

        const lastMsg = messagesRes.recordset[0];
        console.log('Last message fetched:', lastMsg);

        if (lastMsg.message_text === msgText && lastMsg.sender_name === vendor.name) {
            console.log('SUCCESS: Message saved and retrieved correctly with sender_name.');
        } else {
            console.log('FAILURE: Message mismatch or sender_name missing.');
            console.log('Expected Name:', vendor.name);
            console.log('Actual Name:', lastMsg.sender_name);
        }

    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        await sql.close();
    }
}

testChatFlow();
