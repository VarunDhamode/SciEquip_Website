-- Run these commands in your Azure SQL Query Editor

-- 1. Create Customers Table
CREATE TABLE Customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

-- 2. Create Vendors Table
CREATE TABLE Vendors (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

-- 3. Create Admins Table
CREATE TABLE Admins (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

-- 4. Create RFQs Table
CREATE TABLE RFQs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT, -- Optional: Link to Customer if needed
    title NVARCHAR(255) NOT NULL,
    category NVARCHAR(100),
    description NVARCHAR(MAX),
    budget DECIMAL(18, 2),
    status NVARCHAR(50) DEFAULT 'Open',
    vendor_bids INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE()
);

-- 5. Create Bids Table
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

-- 6. Insert Initial Admin User
INSERT INTO Admins (name, email, password) VALUES ('System Admin', 'admin@sciequip.com', 'admin123');
