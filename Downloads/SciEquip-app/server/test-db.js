const sql = require('mssql');
const fs = require('fs');

const sqlConfig = {
    server: 'sciequip-db-server.database.windows.net',
    database: 'sciequip-db',
    user: '2021varundhamode@gmail.com',
    password: 'V@run#2003',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

console.log('Config:', JSON.stringify(sqlConfig, null, 2));

sql.connect(sqlConfig).then(() => {
    console.log('SUCCESS: Connected to Azure SQL Database!');
    fs.writeFileSync('error.log', 'SUCCESS');
    sql.close();
}).catch(err => {
    console.error('FAILURE: Database Connection Failed!');
    console.error(err);
    fs.writeFileSync('error.log', 'FAILURE: ' + err.message);
});
