-- Chat Feature Database Setup
-- Run these commands in your Azure SQL Query Editor after running database_setup.sql

-- 1. Create Conversations Table
-- Links a customer and vendor for a specific RFQ
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
    -- Ensure one conversation per customer-vendor-rfq combination
    CONSTRAINT UQ_Conversation UNIQUE (rfq_id, customer_id, vendor_id)
);

-- 2. Create Messages Table
-- Stores individual messages in conversations
CREATE TABLE Messages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_type NVARCHAR(20) NOT NULL, -- 'customer' or 'vendor'
    sender_id INT NOT NULL,
    message_text NVARCHAR(MAX) NOT NULL,
    is_read BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (conversation_id) REFERENCES Conversations(id) ON DELETE CASCADE,
    -- Validate sender_type
    CONSTRAINT CK_SenderType CHECK (sender_type IN ('customer', 'vendor'))
);

-- 3. Create OnlineStatus Table
-- Tracks which users are currently online
CREATE TABLE OnlineStatus (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    user_type NVARCHAR(20) NOT NULL, -- 'customer' or 'vendor'
    is_online BIT DEFAULT 0,
    last_seen DATETIME DEFAULT GETDATE(),
    socket_id NVARCHAR(255), -- Socket.io connection ID
    updated_at DATETIME DEFAULT GETDATE(),
    -- Ensure one status record per user
    CONSTRAINT UQ_UserStatus UNIQUE (user_id, user_type),
    -- Validate user_type
    CONSTRAINT CK_UserType CHECK (user_type IN ('customer', 'vendor'))
);

-- 4. Create Indexes for Performance
CREATE INDEX IX_Conversations_Customer ON Conversations(customer_id);
CREATE INDEX IX_Conversations_Vendor ON Conversations(vendor_id);
CREATE INDEX IX_Conversations_RFQ ON Conversations(rfq_id);
CREATE INDEX IX_Messages_Conversation ON Messages(conversation_id);
CREATE INDEX IX_Messages_Created ON Messages(created_at DESC);
CREATE INDEX IX_OnlineStatus_User ON OnlineStatus(user_id, user_type);

-- 5. Verify Tables Created
SELECT 'Conversations' as TableName, COUNT(*) as RowCount FROM Conversations
UNION ALL
SELECT 'Messages', COUNT(*) FROM Messages
UNION ALL
SELECT 'OnlineStatus', COUNT(*) FROM OnlineStatus;
