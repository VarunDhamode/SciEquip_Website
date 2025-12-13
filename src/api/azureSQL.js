// API Client for SciEquip Backend
// Connects to the Node.js server running at http://localhost:3000

// Use environment variable for API URL in production, or default to relative path '/api' which works if backend is on same domain
// Fallback to localhost only if strictly needed, but relative is safer for Vercel monorepo
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
};

export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE}/users`);
    return response.json();
};

export const fetchRFQs = async (userId, role) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (role) params.append('role', role);

    const response = await fetch(`${API_BASE}/rfqs?${params.toString()}`);
    return response.json();
};

export const createRFQ = async (rfqData) => {
    const response = await fetch(`${API_BASE}/rfqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rfqData)
    });
    if (!response.ok) throw new Error('Failed to create RFQ');
    return response.json();
};

export const submitBid = async (bidData) => {
    const response = await fetch(`${API_BASE}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bidData)
    });
    if (!response.ok) throw new Error('Failed to submit bid');
    return response.json();
};

export const fetchBids = async (userId, role) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (role) params.append('role', role);

    const response = await fetch(`${API_BASE}/bids?${params.toString()}`);
    return response.json();
};

// --- CHAT API FUNCTIONS ---

export const fetchConversations = async (userId, userType) => {
    const response = await fetch(`${API_BASE}/conversations/${userId}/${userType}`);
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return response.json();
};

export const fetchMessages = async (conversationId) => {
    const response = await fetch(`${API_BASE}/messages/${conversationId}`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
};

export const sendMessage = async (messageData) => {
    const response = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
};

export const markMessageAsRead = async (messageId) => {
    const response = await fetch(`${API_BASE}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to mark message as read');
    return response.json();
};

export const markConversationAsRead = async (conversationId, userType) => {
    const response = await fetch(`${API_BASE}/conversations/${conversationId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType })
    });
    if (!response.ok) throw new Error('Failed to mark conversation as read');
    return response.json();
};

export const checkOnlineStatus = async (userId, userType) => {
    const response = await fetch(`${API_BASE}/online-status/${userId}/${userType}`);
    if (!response.ok) throw new Error('Failed to check online status');
    return response.json();
};