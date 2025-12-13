import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Circle, MessageCircle, AlertCircle } from 'lucide-react';
import { socketClient } from '../../api/socketClient';
import { fetchConversations, fetchMessages, sendMessage, markConversationAsRead } from '../../api/azureSQL';

const ChatWindow = ({ user, onClose, initialContext }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [typingUser, setTypingUser] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Connect to Socket.io
        socketClient.connect(user.id, user.role);

        // Load conversations
        loadConversations();

        // Listen for new messages
        socketClient.onNewMessage((message) => {
            if (selectedConversation && message.conversation_id === selectedConversation.id) {
                setMessages(prev => [...prev, message]);
            }
            // Refresh conversations to update unread counts
            loadConversations();
        });

        // Listen for online status updates
        socketClient.onUserStatus(({ userId, userType, isOnline }) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                const key = `${userType}_${userId}`;
                if (isOnline) {
                    newSet.add(key);
                } else {
                    newSet.delete(key);
                }
                return newSet;
            });
        });

        // Listen for typing indicators
        socketClient.onTypingStart(({ userName }) => {
            setTypingUser(userName);
        });

        socketClient.onTypingStop(() => {
            setTypingUser(null);
        });

        return () => {
            socketClient.removeAllListeners();
            socketClient.disconnect();
        };
    }, [user]);

    // Handle initial context (opening chat for specific bid)
    useEffect(() => {
        if (!loading && initialContext) {
            const { rfqId, vendorId, customerId } = initialContext;

            // Find existing conversation
            const existing = conversations.find(c =>
                c.rfq_id === rfqId &&
                c.vendor_id === vendorId &&
                c.customer_id === customerId
            );

            if (existing) {
                setSelectedConversation(existing);
            } else {
                // Create temporary conversation object
                // Only if user is customer (vendors can't start) OR if we want to show "Waiting" state
                setSelectedConversation({
                    id: 'temp',
                    rfq_id: rfqId,
                    vendor_id: vendorId,
                    customer_id: customerId,
                    rfq_title: initialContext.rfqTitle,
                    vendor_name: initialContext.vendorName,
                    customer_name: initialContext.customerName,
                    isTemp: true
                });
            }
        }
    }, [loading, initialContext]);

    useEffect(() => {
        if (selectedConversation) {
            if (!selectedConversation.isTemp) {
                loadMessages(selectedConversation.id);
                socketClient.joinConversation(selectedConversation.id);
                markConversationAsRead(selectedConversation.id, user.role);
            } else {
                setMessages([]);
            }
        }
    }, [selectedConversation]);

    const loadConversations = async () => {
        try {
            const data = await fetchConversations(user.id, user.role);
            setConversations(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading conversations:', error);
            setLoading(false);
        }
    };

    const loadMessages = async (conversationId) => {
        try {
            const data = await fetchMessages(conversationId);
            setMessages(data);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const messageData = {
                conversationId: selectedConversation.isTemp ? null : selectedConversation.id,
                senderId: user.id,
                senderType: user.role,
                messageText: newMessage.trim(),
                // Context for creating new conversation
                rfqId: selectedConversation.rfq_id,
                customerId: selectedConversation.customer_id,
                vendorId: selectedConversation.vendor_id
            };

            const sentMessage = await sendMessage(messageData);

            if (selectedConversation.isTemp) {
                // If it was temp, reload conversations to get the real one
                await loadConversations();
                // We'll rely on the reload to find the new conversation and select it
                // But for immediate UI feedback, we can add the message
                setMessages([sentMessage]);
            } else {
                setNewMessage('');
                socketClient.emitTypingStop(selectedConversation.id);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!selectedConversation || selectedConversation.isTemp) return;

        socketClient.emitTypingStart(selectedConversation.id, user.name);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socketClient.emitTypingStop(selectedConversation.id);
        }, 1000);
    };

    const isUserOnline = (conversation) => {
        if (!conversation) return false;
        if (user.role === 'customer') {
            return onlineUsers.has(`vendor_${conversation.vendor_id}`);
        } else {
            return onlineUsers.has(`customer_${conversation.customer_id}`);
        }
    };

    const getOtherPartyName = (conversation) => {
        if (!conversation) return '';
        if (conversation.isTemp) {
            return user.role === 'customer' ? conversation.vendor_name : conversation.customer_name;
        }
        return user.role === 'customer' ? conversation.vendor_name : conversation.customer_name;
    };

    const getUnreadCount = (conversation) => {
        if (conversation.isTemp) return 0;
        return user.role === 'customer' ? conversation.customer_unread_count : conversation.vendor_unread_count;
    };

    // Check if vendor can send message (must not be temp conversation)
    const canSendMessage = () => {
        if (user.role === 'customer') return true;
        return selectedConversation && !selectedConversation.isTemp;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[600px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-6 h-6" />
                        <h2 className="text-xl font-semibold">Messages</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-blue-800 rounded-full transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Conversations List */}
                    <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : conversations.length === 0 && !selectedConversation?.isTemp ? (
                            <div className="p-4 text-center text-gray-500">
                                No conversations yet
                            </div>
                        ) : (
                            <>
                                {/* Show Temp Conversation if active */}
                                {selectedConversation?.isTemp && (
                                    <div className="p-4 border-b bg-blue-100 border-l-4 border-l-blue-600 cursor-pointer">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900 truncate">
                                                        {getOtherPartyName(selectedConversation)}
                                                    </span>
                                                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">New</span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {selectedConversation.rfq_title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {conversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`p-4 border-b cursor-pointer transition ${selectedConversation?.id === conv.id
                                                ? 'bg-blue-100 border-l-4 border-l-blue-600'
                                                : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900 truncate">
                                                        {getOtherPartyName(conv)}
                                                    </span>
                                                    {isUserOnline(conv) && (
                                                        <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {conv.rfq_title}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(conv.last_message_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {getUnreadCount(conv) > 0 && (
                                                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-2">
                                                    {getUnreadCount(conv)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedConversation ? (
                            <>
                                {/* Conversation Header */}
                                <div className="p-4 border-b bg-white">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {getOtherPartyName(selectedConversation)}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {selectedConversation.rfq_title}
                                            </p>
                                        </div>
                                        {isUserOnline(selectedConversation) && (
                                            <div className="flex items-center gap-1 text-green-600 text-sm">
                                                <Circle className="w-2 h-2 fill-current" />
                                                <span>Online</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                    {selectedConversation.isTemp && user.role === 'vendor' ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <AlertCircle className="w-12 h-12 mb-2 text-gray-400" />
                                            <p className="font-medium">Conversation not started</p>
                                            <p className="text-sm">Waiting for customer to initiate chat.</p>
                                        </div>
                                    ) : messages.length === 0 && selectedConversation.isTemp ? (
                                        <div className="text-center text-gray-500 mt-10">
                                            <p>Start the conversation by sending a message.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender_type === user.role ? 'justify-end' : 'justify-start'
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.sender_type === user.role
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-900 border'
                                                        }`}
                                                >
                                                    <p className="text-sm break-words">{msg.message_text}</p>
                                                    <div className="flex items-center justify-end gap-2 mt-1">
                                                        <span className={`text-xs ${msg.sender_type === user.role ? 'text-blue-100' : 'text-gray-500'
                                                            }`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                        {msg.sender_type === user.role && msg.is_read && (
                                                            <span className="text-xs text-blue-100">✓✓</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {typingUser && (
                                        <div className="text-sm text-gray-500 italic">
                                            {typingUser} is typing...
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={handleTyping}
                                            placeholder={canSendMessage() ? "Type a message..." : "Cannot send message"}
                                            disabled={!canSendMessage()}
                                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim() || !canSendMessage()}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p>Select a conversation to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
