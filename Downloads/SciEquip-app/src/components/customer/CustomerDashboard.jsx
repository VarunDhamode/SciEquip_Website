import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, TrendingUp, Plus, Eye, MessageCircle, Package, Search } from 'lucide-react';
import { fetchRFQs, fetchBids, createRFQ } from '../../api/azureSQL';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../common/StatCard';
import DataTable from '../common/DataTable';
import LoadingSpinner from '../common/LoadingSpinner';
import ChatWindow from '../common/ChatWindow';
import { equipmentList } from '../../utils/equipmentData';
import EquipmentCard from './EquipmentCard';
import EquipmentParameterForm from './EquipmentParameterForm';
import CreateRFQForm from './CreateRFQForm';

export default function CustomerDashboard() {
    const { user } = useAuth();
    const [rfqs, setRfqs] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChatBid, setSelectedChatBid] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, equipment, create-rfq
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    useEffect(() => {
        loadData();
    }, [activeTab]); // Reload when tab changes just in case

    const loadData = async () => {
        try {
            const [rfqData, bidData] = await Promise.all([
                fetchRFQs(user.id, user.role),
                fetchBids(user.id, user.role)
            ]);
            setRfqs(rfqData);
            setBids(bidData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRFQ = async (data) => {
        try {
            await createRFQ({
                ...data,
                customerId: user.id
            });
            setActiveTab('dashboard');
            setSelectedEquipment(null);
            loadData();
        } catch (err) {
            console.error(err);
            alert('Failed to create RFQ: ' + err.message);
        }
    };

    const handleEquipmentConfigure = (equipment) => {
        setSelectedEquipment(equipment);
    };

    const filteredEquipment = equipmentList.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    // Calculate statistics
    const totalRFQs = rfqs.length;
    const activeRFQs = rfqs.filter(r => r.status === 'Open').length;
    const totalBidsReceived = rfqs.reduce((sum, rfq) => sum + (rfq.vendor_bids || 0), 0);
    const avgBidAmount = bids.length > 0
        ? (bids.reduce((sum, bid) => sum + (bid.price || 0), 0) / bids.length).toFixed(0)
        : 0;

    // Recent bids (last 5)
    const recentBids = bids
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    // Table columns
    const rfqColumns = [
        { key: 'title', label: 'Title', sortable: true },
        { key: 'category', label: 'Category', sortable: true },
        {
            key: 'budget',
            label: 'Budget',
            sortable: true,
            render: (val) => val ? `$${val.toLocaleString()}` : 'N/A'
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (val) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${val === 'Open' ? 'bg-green-100 text-green-700' :
                        val === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-700'
                    }`}>
                    {val}
                </span>
            )
        },
        { key: 'vendor_bids', label: 'Bids', sortable: true, render: (val) => val || 0 }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Customer Dashboard</h1>
                    <p className="text-slate-600 mt-1">Welcome back, {user?.name}!</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('equipment')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'equipment' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Package size={18} />
                        Equipment Catalog
                    </button>
                </div>
            </div>

            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total RFQs" value={totalRFQs} icon={FileText} color="blue" />
                        <StatCard title="Active RFQs" value={activeRFQs} icon={TrendingUp} color="green" />
                        <StatCard title="Bids Received" value={totalBidsReceived} icon={Eye} color="purple" />
                        <StatCard title="Avg Bid Amount" value={`$${avgBidAmount}`} icon={DollarSign} color="orange" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">My RFQs</h2>
                        <DataTable columns={rfqColumns} data={rfqs} searchable={true} pageSize={10} />
                    </div>

                    {/* Recent Bids */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Bids Received</h2>
                        {recentBids.length > 0 ? (
                            <div className="space-y-3">
                                {recentBids.map((bid, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{bid.vendor_name}</p>
                                            <p className="text-sm text-slate-600">RFQ ID: {bid.rfq_id}</p>
                                        </div>
                                        <div className="text-right mr-4">
                                            <p className="font-semibold text-green-600">${bid.price?.toLocaleString()}</p>
                                            <p className="text-xs text-slate-500">{new Date(bid.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedChatBid(bid)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <MessageCircle size={16} /> Chat
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">No bids received yet</p>
                        )}
                    </div>
                </>
            )}

            {/* Equipment Catalog View */}
            {activeTab === 'equipment' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                        <Search className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search equipment by name or category..."
                            className="flex-1 outline-none text-slate-900"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEquipment.map((eq) => (
                            <EquipmentCard
                                key={eq.id}
                                equipment={eq}
                                onConfigure={handleEquipmentConfigure}
                            />
                        ))}
                    </div>

                    {filteredEquipment.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-lg">No equipment found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}

            {/* Overlays */}
            {selectedChatBid && (
                <ChatWindow
                    user={user}
                    initialContext={{
                        rfqId: selectedChatBid.rfq_id,
                        vendorId: selectedChatBid.vendor_id,
                        customerId: user.id,
                        rfqTitle: rfqs.find(r => r.id === selectedChatBid.rfq_id)?.title || 'RFQ',
                        vendorName: selectedChatBid.vendor_name,
                        customerName: user.name
                    }}
                    onClose={() => setSelectedChatBid(null)}
                />
            )}

            {selectedEquipment && (
                <EquipmentParameterForm
                    equipment={selectedEquipment}
                    onClose={() => setSelectedEquipment(null)}
                    onSubmit={handleCreateRFQ}
                />
            )}
        </div>
    );
}