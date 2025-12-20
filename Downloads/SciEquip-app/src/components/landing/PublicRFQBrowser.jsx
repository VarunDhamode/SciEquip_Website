import React, { useState, useEffect } from 'react';
import { fetchRFQs } from '../../api/azureSQL';
import { ArrowLeft, Search, DollarSign, Calendar } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import ThemeToggle from '../common/ThemeToggle';

export default function PublicRFQBrowser({ onNavigate, onLoginRequired }) {
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    useEffect(() => {
        loadRFQs();
    }, []);

    const loadRFQs = async () => {
        try {
            const data = await fetchRFQs();
            setRfqs(data);
        } catch (error) {
            console.error('Failed to load RFQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(rfqs.map(rfq => rfq.category).filter(Boolean))];

    const filteredRFQs = rfqs.filter(rfq => {
        const matchesSearch = rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (rfq.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || rfq.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <button
                                onClick={() => onNavigate('landing')}
                                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Back to Home
                            </button>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Browse RFQs</h1>
                            <p className="text-slate-600 dark:text-slate-300 mt-2">
                                Explore active requests from buyers. Login to submit competitive bids.
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mb-6 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search RFQs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* RFQ Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRFQs.map(rfq => (
                        <RFQCard key={rfq.id} rfq={rfq} onLoginRequired={onLoginRequired} />
                    ))}
                </div>

                {filteredRFQs.length === 0 && (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        No RFQs found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}

function RFQCard({ rfq, onLoginRequired }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-transparent dark:border-slate-700">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{rfq.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${rfq.status === 'Open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    rfq.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                    {rfq.status}
                </span>
            </div>

            {rfq.category && (
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    Category: {rfq.category}
                </div>
            )}

            <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                {rfq.description || 'No description provided'}
            </p>

            <div className="flex items-center gap-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
                {rfq.budget && (
                    <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        ${rfq.budget.toLocaleString()}
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {rfq.vendor_bids || 0} bids
                </div>
            </div>

            <button
                onClick={onLoginRequired}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
                Login to Submit Bid
            </button>
        </div>
    );
}
