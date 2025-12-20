const sql = require('mssql');
require('dotenv').config({ path: '../.env' });

const sqlConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function testUsers() {
    try {
        console.log('Connecting to database...');
        await sql.connect(sqlConfig);
        console.log('✓ Connected!\n');

        // Check if users table exists and has data
        const result = await sql.query`SELECT TOP 10 userId, email, username, role FROM users`;

        console.log(`Found ${result.recordset.length} users in database:\n`);

        if (result.recordset.length === 0) {
            console.log('❌ NO USERS FOUND! You need to register a user first.');
        } else {
            console.log('Available users:');
            result.recordset.forEach((user, index) => {
                console.log(`${index + 1}. Email: ${user.email}, Username: ${user.username}, Role: ${user.role}, ID: ${user.userId}`);
            });
        }

        await sql.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

testUsers();
