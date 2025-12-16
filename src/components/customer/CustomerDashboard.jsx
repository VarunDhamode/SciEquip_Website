import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, TrendingUp, Eye, MessageCircle, Package, Search, Bell, Plus, Filter } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState('dashboard');
    const [view, setView] = useState('list'); // 'list' or 'create'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    useEffect(() => {
        loadData();
    }, [activeTab]);

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
            await createRFQ({ ...data, customerId: user.id });
            setActiveTab('dashboard');
            setView('list');
            setSelectedEquipment(null);
            loadData();
        } catch (err) {
            console.error(err);
            alert('Failed to create RFQ: ' + err.message);
        }
    };

    const handleEquipmentConfigure = (equipment) => setSelectedEquipment(equipment);

    const filteredEquipment = equipmentList.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    // Stats Logic
    const totalRFQs = rfqs.length;
    const activeRFQs = rfqs.filter(r => r.status === 'Open').length;
    const totalBidsReceived = rfqs.reduce((sum, rfq) => sum + (rfq.vendor_bids || 0), 0);
    const avgBidAmount = bids.length > 0
        ? (bids.reduce((sum, bid) => sum + (bid.price || 0), 0) / bids.length).toFixed(0)
        : 0;

    const recentBids = bids
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    const rfqColumns = [
        { key: 'title', label: 'Title', sortable: true, render: (val) => <span className="font-medium text-slate-900">{val}</span> },
        { key: 'category', label: 'Category', sortable: true },
        { key: 'budget', label: 'Budget', sortable: true, render: (val) => val ? <span className="font-mono">${val.toLocaleString()}</span> : 'N/A' },
        {
            key: 'status', label: 'Status', sortable: true,
            render: (val) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${val === 'Open' ? 'bg-emerald-100 text-emerald-700' :
                        val === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {val}
                </span>
            )
        },
        { key: 'vendor_bids', label: 'Bids', sortable: true, render: (val) => <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{val || 0}</span> }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 p-6 md:p-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-1">Welcome back, {user?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 rounded-full shadow-sm hover:shadow border border-slate-100 transition-all">
                        <Bell size={20} />
                    </button>
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </header>

            {view === 'create' ? (
                <CreateRFQForm onBack={() => setView('list')} />
            ) : (
                <>
                    <div className="flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm w-fit mb-8">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('equipment')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'equipment' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                        >
                            <Package size={16} /> Equipment Catalog
                        </button>
                    </div>

                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Total RFQs" value={totalRFQs} icon={FileText} color="blue" />
                                <StatCard title="Active RFQs" value={activeRFQs} icon={TrendingUp} color="green" />
                                <StatCard title="Bids Received" value={totalBidsReceived} icon={Eye} color="purple" />
                                <StatCard title="Avg Bid Amount" value={`$${avgBidAmount}`} icon={DollarSign} color="orange" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                                        <h3 className="font-bold text-lg text-slate-900">Active Requests</h3>
                                        <button
                                            onClick={() => setView('create')}
                                            className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <Plus size={16} /> New RFQ
                                        </button>
                                    </div>
                                    <DataTable columns={rfqColumns} data={rfqs} searchable={true} pageSize={10} />
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                                    <h3 className="font-bold text-lg text-slate-900 mb-6">Recent Bids</h3>
                                    {recentBids.length > 0 ? (
                                        <div className="space-y-4 flex-1">
                                            {recentBids.map((bid, idx) => (
                                                <div key={idx} className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-slate-800 text-sm">{bid.vendor_name}</h4>
                                                        <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-1.5 rounded">${bid.price?.toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 mb-3">Ref ID: {bid.rfq_id}</div>
                                                    <button
                                                        onClick={() => setSelectedChatBid(bid)}
                                                        className="w-full py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <MessageCircle size={14} /> Negotiate
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">No recent bids</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'equipment' && (
                        <div className="animate-in fade-in duration-500 space-y-6">
                            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-2xl">
                                <Search className="text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search catalog by name, category..."
                                    className="flex-1 outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Filter size={20} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredEquipment.map((eq) => (
                                    <EquipmentCard key={eq.id} equipment={eq} onConfigure={handleEquipmentConfigure} />
                                ))}
                            </div>

                            {filteredEquipment.length === 0 && (
                                <div className="text-center py-12 text-slate-500">No equipment found matching "{searchQuery}"</div>
                            )}
                        </div>
                    )}
                </>
            )}

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
