import React, { useEffect, useState } from 'react';
import { Database, Users, FileText, DollarSign } from 'lucide-react';
import { fetchRFQs, fetchUsers, fetchBids } from '../../api/azureSQL';
import StatCard from '../common/StatCard';
import DataTable from '../common/DataTable';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [rfqs, setRfqs] = useState([]);
    const [users, setUsers] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [rfqData, userData, bidData] = await Promise.all([
                fetchRFQs(),
                fetchUsers(),
                fetchBids()
            ]);
            setRfqs(rfqData);
            setUsers(userData);
            setBids(bidData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    // Calculate platform statistics
    const totalUsers = users.length;
    const totalRFQs = rfqs.length;
    const totalBids = bids.length;
    const platformRevenue = bids
        .filter(b => b.status === 'Accepted')
        .reduce((sum, bid) => sum + (bid.price || 0), 0);

    // Table columns
    const userColumns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
            render: (val) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${val === 'admin' ? 'bg-purple-100 text-purple-700' :
                    val === 'vendor' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                    {val}
                </span>
            )
        }
    ];

    const rfqColumns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'title', label: 'Title', sortable: true },
        { key: 'category', label: 'Category', sortable: true },
        {
            key: 'budget',
            label: 'Budget',
            sortable: true,
            render: (val) => `$${val?.toLocaleString() || 0}`
        },
        {
            key: 'vendor_bids',
            label: 'Bids',
            sortable: true,
            render: (val) => val || 0
        }
    ];

    const bidColumns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'rfq_id', label: 'RFQ ID', sortable: true },
        { key: 'vendor_name', label: 'Vendor', sortable: true },
        {
            key: 'price',
            label: 'Amount',
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
        }
    ];

    const renderContent = () => {
        if (activeTab === 'overview') {
            return (
                <div className="space-y-6">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Users"
                            value={totalUsers}
                            icon={Users}
                            color="blue"
                        />
                        <StatCard
                            title="Total RFQs"
                            value={totalRFQs}
                            icon={FileText}
                            color="green"
                        />
                        <StatCard
                            title="Total Bids"
                            value={totalBids}
                            icon={Database}
                            color="purple"
                        />
                        <StatCard
                            title="Platform Revenue"
                            value={`$${platformRevenue.toLocaleString()}`}
                            icon={DollarSign}
                            color="orange"
                        />
                    </div>

                    {/* Recent Activity */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Users</h3>
                            <div className="space-y-3">
                                {users.slice(0, 5).map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-900">{user.name}</p>
                                            <p className="text-sm text-slate-600">{user.email}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'vendor' ? 'bg-green-100 text-green-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent RFQs</h3>
                            <div className="space-y-3">
                                {rfqs.slice(0, 5).map(rfq => (
                                    <div key={rfq.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-900">{rfq.title}</p>
                                            <p className="text-sm text-slate-600">{rfq.category}</p>
                                        </div>
                                        <span className="text-green-600 font-bold">${rfq.budget?.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTab === 'users') {
            return (
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">All Users</h2>
                    <DataTable columns={userColumns} data={users} searchable={true} pageSize={15} />
                </div>
            );
        }

        if (activeTab === 'rfqs') {
            return (
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">All RFQs</h2>
                    <DataTable columns={rfqColumns} data={rfqs} searchable={true} pageSize={15} />
                </div>
            );
        }

        if (activeTab === 'bids') {
            return (
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">All Bids</h2>
                    <DataTable columns={bidColumns} data={bids} searchable={true} pageSize={15} />
                </div>
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600 mt-1">Platform overview and management</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                {['overview', 'users', 'rfqs', 'bids'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-medium capitalize transition-colors ${activeTab === tab
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            {renderContent()}
        </div>
    );
}