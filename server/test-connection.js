const sql = require('mssql');
const fs = require('fs');
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

console.log('Testing with:');
console.log('Server:', sqlConfig.server);
console.log('Database:', sqlConfig.database);
console.log('User:', sqlConfig.user);
console.log('Password:', sqlConfig.password);

sql.connect(sqlConfig).then(() => {
    console.log('✓ SUCCESS: Connected to Azure SQL Database!');
    fs.writeFileSync('connection_test.log', 'SUCCESS');
    process.exit(0);
}).catch(err => {
    console.error('✗ FAILURE: Database Connection Failed!');
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    fs.writeFileSync('connection_test.log', `FAILURE: ${err.message} (${err.code})`);
    process.exit(1);
});
