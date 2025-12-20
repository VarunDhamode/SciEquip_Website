// Socket.io Client for Real-time Chat
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketClient {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(userId, userType) {
        if (this.socket?.connected) {
            console.log('Socket already connected');
            return;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket.id);
            this.socket.emit('user:join', { userId, userType });
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
        }
    }

    joinConversation(conversationId) {
        if (this.socket) {
            this.socket.emit('conversation:join', conversationId);
        }
    }

    leaveConversation(conversationId) {
        if (this.socket) {
            this.socket.emit('conversation:leave', conversationId);
        }
    }

    onNewMessage(callback) {
        if (this.socket) {
            this.socket.on('new_message', callback);
            this.listeners.set('new_message', callback);
        }
    }

    onUserStatus(callback) {
        if (this.socket) {
            this.socket.on('user:status', callback);
            this.listeners.set('user:status', callback);
        }
    }

    onTypingStart(callback) {
        if (this.socket) {
            this.socket.on('typing:start', callback);
            this.listeners.set('typing:start', callback);
        }
    }

    onTypingStop(callback) {
        if (this.socket) {
            this.socket.on('typing:stop', callback);
            this.listeners.set('typing:stop', callback);
        }
    }

    emitTypingStart(conversationId, userName) {
        if (this.socket) {
            this.socket.emit('typing:start', { conversationId, userName });
        }
    }

    emitTypingStop(conversationId) {
        if (this.socket) {
            this.socket.emit('typing:stop', { conversationId });
        }
    }

    removeListener(event) {
        if (this.socket && this.listeners.has(event)) {
            const callback = this.listeners.get(event);
            this.socket.off(event, callback);
            this.listeners.delete(event);
        }
    }

    removeAllListeners() {
        if (this.socket) {
            this.listeners.forEach((callback, event) => {
                this.socket.off(event, callback);
            });
            this.listeners.clear();
        }
    }
}

// Export singleton instance
export const socketClient = new SocketClient();
