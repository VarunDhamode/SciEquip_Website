const sql = require('mssql');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

const sqlConfig = {
    server: process.env.DB_SERVER || 'sciequip-db-server.database.windows.net',
    database: process.env.DB_NAME || 'sciequip-db',
    user: process.env.DB_USER || '2021varundhamode@gmail.com',
    password: process.env.DB_PASSWORD || 'V@run#2003',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function listUsers() {
    try {
        await sql.connect(sqlConfig);
        console.log('Connected to DB.');

        const tables = ['Customers', 'Vendors', 'Admins'];
        for (const table of tables) {
            const result = await sql.query(`SELECT * FROM ${table}`);
            console.log(`\n--- ${table} ---`);
            if (result.recordset.length > 0) {
                fs.appendFileSync('users.json', JSON.stringify(result.recordset, null, 2));
            }
        }
        sql.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

listUsers();
