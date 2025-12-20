import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, DollarSign, Award, FileText, MessageCircle } from 'lucide-react';
import { fetchRFQs, fetchBids, fetchConversations } from '../../api/azureSQL';
import { useAuth } from '../../hooks/useAuth';
import BidModal from './BidModal';
import StatCard from '../common/StatCard';
import DataTable from '../common/DataTable';
import LoadingSpinner from '../common/LoadingSpinner';
import ChatWindow from '../common/ChatWindow';

export default function VendorDashboard() {
    const { user } = useAuth();
    const [rfqs, setRfqs] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRFQ, setSelectedRFQ] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [showChat, setShowChat] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        loadData();
        loadUnreadCount();
    }, []);

    const loadData = async () => {
        try {
            const [rfqData, bidData] = await Promise.all([
                fetchRFQs(user.id, user.role),
                fetchBids(user.id, user.role)
            ]);
            setRfqs(rfqData);
            setMyBids(bidData.filter(bid => bid.vendor_name === user?.name));
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const conversations = await fetchConversations(user.id, user.role);
            const total = conversations.reduce((sum, conv) => sum + (conv.vendor_unread_count || 0), 0);
            setUnreadCount(total);
        } catch (error) {
            console.error('Failed to load unread count:', error);
        }
    };

    if (loading) return <LoadingSpinner />;

    // Calculate statistics
    const totalBids = myBids.length;
    const activeBids = myBids.filter(b => b.status === 'Pending').length;
    const wonBids = myBids.filter(b => b.status === 'Accepted').length;
    const winRate = totalBids > 0 ? ((wonBids / totalBids) * 100).toFixed(0) : 0;
    const totalRevenue = myBids
        .filter(b => b.status === 'Accepted')
        .reduce((sum, bid) => sum + (bid.price || 0), 0);

    // Filter RFQs
    const categories = ['All', ...new Set(rfqs.map(r => r.category).filter(Boolean))];
    const filteredRFQs = categoryFilter === 'All'
        ? rfqs
        : rfqs.filter(r => r.category === categoryFilter);

    // My Bids table columns
    const bidColumns = [
        { key: 'rfq_id', label: 'RFQ ID', sortable: true },
        {
            key: 'price',
            label: 'Bid Amount',
            sortable: true,
            render: (val) => `$${val?.toLocaleString() || 0}`
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (val) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${val === 'Accepted' ? 'bg-green-100 text-green-700' :
                    val === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {val || 'Pending'}
                </span>
            )
        },
        {
            key: 'timestamp',
            label: 'Submitted',
            sortable: true,
            render: (val) => new Date(val).toLocaleDateString()
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Vendor Dashboard</h1>
                    <p className="text-slate-600 mt-1">Welcome back, {user?.name}!</p>
                </div>
                <button
                    onClick={() => setShowChat(true)}
                    className="relative px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                    <MessageCircle size={20} />
                    Messages
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Bids"
                    value={totalBids}
                    icon={FileText}
                    color="blue"
                />
                <StatCard
                    title="Active Bids"
                    value={activeBids}
                    icon={TrendingUp}
                    color="orange"
                />
                <StatCard
                    title="Win Rate"
                    value={`${winRate}%`}
                    icon={Award}
                    color="green"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="purple"
                />
            </div>

            {/* My Bids Table */}
            <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">My Bids</h2>
                <DataTable
                    columns={bidColumns}
                    data={myBids}
                    searchable={true}
                    pageSize={10}
                />
            </div>

            {/* Available RFQs */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Available RFQs</h2>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRFQs.map(rfq => (
                        <div key={rfq.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                                    {rfq.category}
                                </span>
                                <span className="text-green-600 font-bold">${rfq.budget?.toLocaleString()}</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">{rfq.title}</h3>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{rfq.description}</p>
                            <button
                                onClick={() => setSelectedRFQ(rfq)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-semibold"
                            >
                                View & Bid
                            </button>
                        </div>
                    ))}
                </div>

                {filteredRFQs.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No RFQs available in this category
                    </div>
                )}
            </div>

            {selectedRFQ && <BidModal lead={selectedRFQ} onClose={() => setSelectedRFQ(null)} />}

            {/* Chat Window */}
            {showChat && (
                <ChatWindow
                    user={user}
                    onClose={() => {
                        setShowChat(false);
                        loadUnreadCount();
                    }}
                />
            )}
        </div>
    );
}