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

async function setupDatabase() {
    try {
        console.log('Connecting to Azure SQL Database...');
        await sql.connect(sqlConfig);
        console.log('✓ Connected!\n');

        console.log('Setting up database schema...\n');

        // Create all tables
        const tables = [
            {
                name: 'Customers',
                sql: `
                    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Customers]') AND type in (N'U'))
                    BEGIN
                        CREATE TABLE Customers (
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            name NVARCHAR(255) NOT NULL,
                            email NVARCHAR(255) NOT NULL UNIQUE,
                            password NVARCHAR(255) NOT NULL,
                            created_at DATETIME DEFAULT GETDATE()
                        );
                        PRINT '✓ Created Customers table';
                    END
                    ELSE PRINT '  Customers table already exists';
                `
            },
            {
                name: 'Vendors',
                sql: `
                    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Vendors]') AND type in (N'U'))
                    BEGIN
                        CREATE TABLE Vendors (
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            name NVARCHAR(255) NOT NULL,
                            email NVARCHAR(255) NOT NULL UNIQUE,
                            password NVARCHAR(255) NOT NULL,
                            created_at DATETIME DEFAULT GETDATE()
                        );
                        PRINT '✓ Created Vendors table';
                    END
                    ELSE PRINT '  Vendors table already exists';
                `
            },
            {
                name: 'Admins',
                sql: `
                    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Admins]') AND type in (N'U'))
                    BEGIN
                        CREATE TABLE Admins (
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            name NVARCHAR(255) NOT NULL,
                            email NVARCHAR(255) NOT NULL UNIQUE,
                            password NVARCHAR(255) NOT NULL,
                            created_at DATETIME DEFAULT GETDATE()
                        );
                        PRINT '✓ Created Admins table';
                    END
                    ELSE PRINT '  Admins table already exists';
                `
            },
            {
                name: 'RFQs',
                sql: `
                    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RFQs]') AND type in (N'U'))
                    BEGIN
                        CREATE TABLE RFQs (
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            customer_id INT,
                            title NVARCHAR(255) NOT NULL,
                            category NVARCHAR(100),
                            description NVARCHAR(MAX),
                            budget DECIMAL(18, 2),
                            status NVARCHAR(50) DEFAULT 'Open',
                            vendor_bids INT DEFAULT 0,
                            created_at DATETIME DEFAULT GETDATE()
                        );
                        PRINT '✓ Created RFQs table';
                    END
                    ELSE PRINT '  RFQs table already exists';
                `
            },
            {
                name: 'Bids',
                sql: `
                    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Bids]') AND type in (N'U'))
                    BEGIN
                        CREATE TABLE Bids (
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            rfq_id INT NOT NULL,
                            vendor_name NVARCHAR(255),
                            vendor_email NVARCHAR(255),
                            price DECIMAL(18, 2),
                            proposal NVARCHAR(MAX),
                            timestamp DATETIME DEFAULT GETDATE(),
                            FOREIGN KEY (rfq_id) REFERENCES RFQs(id)
                        );
                        PRINT '✓ Created Bids table';
                    END
                    ELSE PRINT '  Bids table already exists';
                `
            },
            {
                name: 'Conversations',
                sql: `
                    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Conversations]') AND type in (N'U'))
                    BEGIN
                        CREATE TABLE Conversations (
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            rfq_id INT NOT NULL,
                            customer_id INT NOT NULL,
                            vendor_id INT NOT NULL,
                            last_message_at DATETIME DEFAULT GETDATE(),
                            customer_unread_count INT DEFAULT 0,
                            vendor_unread_count INT DEFAULT 0,
                            created_at DATETIME DEFAULT GETDATE(),
                            FOREIGN KEY (rfq_id) REFERENCES RFQs(id),
                            FOREIGN KEY (customer_id) REFERENCES Customers(id),
                            FOREIGN KEY (vendor_id) REFERENCES Vendors(id),
                            CONSTRAINT UQ_Conversation UNIQUE (rfq_id, customer_id, vendor_id)
                        );
                        PRINT '✓ Created Conversations table';
                    END
                    ELSE PRINT '  Conversations table already exists';
                `
            },
            {
                name: 'Messages',
                sql: `
                    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Messages]') AND type in (N'U'))
                    BEGIN
                        CREATE TABLE Messages (
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            conversation_id INT NOT NULL,
                            sender_type NVARCHAR(20) NOT NULL,
                            sender_id INT NOT NULL,
                            message_text NVARCHAR(MAX) NOT NULL,
                            is_read BIT DEFAULT 0,
                            created_at DATETIME DEFAULT GETDATE(),
                            FOREIGN KEY (conversation_id) REFERENCES Conversations(id) ON DELETE CASCADE,
                            CONSTRAINT CK_SenderType CHECK (sender_type IN ('customer', 'vendor'))
                        );
                        PRINT '✓ Created Messages table';
                    END
                    ELSE PRINT '  Messages table already exists';
                `
            },
            {
                name: 'OnlineStatus',
                sql: `
                    IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OnlineStatus]') AND type in (N'U'))
                    BEGIN
                        CREATE TABLE OnlineStatus (
                            id INT IDENTITY(1,1) PRIMARY KEY,
                            user_id INT NOT NULL,
                            user_type NVARCHAR(20) NOT NULL,
                            is_online BIT DEFAULT 0,
                            last_seen DATETIME DEFAULT GETDATE(),
                            socket_id NVARCHAR(255),
                            updated_at DATETIME DEFAULT GETDATE(),
                            CONSTRAINT UQ_UserStatus UNIQUE (user_id, user_type),
                            CONSTRAINT CK_UserType CHECK (user_type IN ('customer', 'vendor'))
                        );
                        PRINT '✓ Created OnlineStatus table';
                    END
                    ELSE PRINT '  OnlineStatus table already exists';
                `
            }
        ];

        for (const table of tables) {
            console.log(`Creating ${table.name}...`);
            await sql.query(table.sql);
        }

        console.log('\n✅ Database setup complete!\n');

        // Insert default admin if not exists
        console.log('Checking for default admin...');
        const adminCheck = await sql.query`SELECT * FROM Admins WHERE email = 'admin@sciequip.com'`;
        if (adminCheck.recordset.length === 0) {
            await sql.query`INSERT INTO Admins (name, email, password) VALUES ('System Admin', 'admin@sciequip.com', 'admin123')`;
            console.log('✓ Created default admin user (admin@sciequip.com / admin123)\n');
        } else {
            console.log('  Default admin already exists\n');
        }

        // Show table counts
        console.log('Current data:');
        const customers = await sql.query`SELECT COUNT(*) as count FROM Customers`;
        const vendors = await sql.query`SELECT COUNT(*) as count FROM Vendors`;
        const admins = await sql.query`SELECT COUNT(*) as count FROM Admins`;
        const rfqs = await sql.query`SELECT COUNT(*) as count FROM RFQs`;
        const bids = await sql.query`SELECT COUNT(*) as count FROM Bids`;

        console.log(`  Customers: ${customers.recordset[0].count}`);
        console.log(`  Vendors: ${vendors.recordset[0].count}`);
        console.log(`  Admins: ${admins.recordset[0].count}`);
        console.log(`  RFQs: ${rfqs.recordset[0].count}`);
        console.log(`  Bids: ${bids.recordset[0].count}`);

        await sql.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

setupDatabase();
