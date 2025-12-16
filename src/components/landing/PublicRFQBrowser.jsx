import React, { useState, useEffect } from 'react';

// --- Internal Icon Components ---
const Icon = ({ size = 24, className, children, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        {children}
    </svg>
);
const ArrowLeft = (props) => <Icon {...props}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Icon>;
const Search = (props) => <Icon {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>;
const DollarSign = (props) => <Icon {...props}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>;
const Calendar = (props) => <Icon {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon>;
const Filter = (props) => <Icon {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></Icon>;
const Briefcase = (props) => <Icon {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></Icon>;
const Clock = (props) => <Icon {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>;
const ChevronRight = (props) => <Icon {...props}><polyline points="9 18 15 12 9 6" /></Icon>;
const Moon = (props) => <Icon {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Icon>;
const Sun = (props) => <Icon {...props}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></Icon>;
const Loader2 = (props) => <Icon {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></Icon>;


// --- MOCK COMPONENTS & API (Internal for standalone functionality) ---

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
);

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);
    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

const fetchRFQs = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        { id: 1, title: 'HPLC System for Pharma Lab', category: 'Chromatography', status: 'Open', budget: 50000, description: 'Looking for a high-performance liquid chromatography system for drug analysis. Must include autosampler.', vendor_bids: 3 },
        { id: 2, title: 'Electron Microscope Maintenance', category: 'Services', status: 'Open', budget: 12000, description: 'Annual maintenance contract needed for SEM model X-200. Requires certified technician.', vendor_bids: 1 },
        { id: 3, title: 'Industrial Centrifuge', category: 'Centrifuge', status: 'Pending', budget: 25000, description: 'High capacity centrifuge needed for separation processes. 10,000 RPM minimum.', vendor_bids: 5 },
        { id: 4, title: 'Mass Spectrometer Repair', category: 'Services', status: 'Open', budget: 8000, description: 'Urgent repair needed for Quadrupole Mass Analyzer. Vacuum leak detected.', vendor_bids: 2 },
        { id: 5, title: 'Lab Freezers (-80C)', category: 'Freezer', status: 'Open', budget: 18000, description: 'Procurement of 3 ultra-low temperature freezers for sample storage.', vendor_bids: 4 },
    ];
};

// --- MAIN COMPONENT ---

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
            setRfqs([]);
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

    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Placeholder for visual consistency during load */}
            <div className="h-20 bg-white/90 border-b border-slate-200 mb-8"></div>
            <LoadingSpinner />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {/* Header with Glass Effect */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onNavigate('landing')}
                                className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Active Opportunities</h1>
                                <p className="text-sm text-slate-500 hidden md:block">
                                    Browse active requests from research facilities
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onLoginRequired}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 px-4 py-2"
                            >
                                Login
                            </button>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Input */}
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by keyword, equipment, or details..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative w-full md:w-64">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer text-slate-700"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronRight className="w-4 h-4 text-slate-500 rotate-90" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRFQs.map(rfq => (
                        <RFQCard key={rfq.id} rfq={rfq} onLoginRequired={onLoginRequired} />
                    ))}
                </div>

                {filteredRFQs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <Search className="text-slate-400" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            We couldn't find any RFQs matching your current filters. Try adjusting your search terms or category.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                            className="mt-6 text-blue-600 font-semibold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function RFQCard({ rfq, onLoginRequired }) {
    return (
        <div className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    <Briefcase size={12} />
                    {rfq.category || 'General'}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${rfq.status === 'Open' ? 'bg-green-100 text-green-700' :
                        rfq.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${rfq.status === 'Open' ? 'bg-green-500' :
                            rfq.status === 'Pending' ? 'bg-amber-500' :
                                'bg-slate-500'
                        }`}></span>
                    {rfq.status}
                </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {rfq.title}
            </h3>

            <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-grow">
                {rfq.description || 'No detailed description provided for this requirement.'}
            </p>

            <div className="space-y-3 mb-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                        <DollarSign size={16} className="text-slate-400" />
                        <span>Budget</span>
                    </div>
                    <span className="font-semibold text-slate-900">
                        {rfq.budget ? `$${rfq.budget.toLocaleString()}` : 'Negotiable'}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={16} className="text-slate-400" />
                        <span>Current Bids</span>
                    </div>
                    <span className="font-semibold text-slate-900">
                        {rfq.vendor_bids || 0}
                    </span>
                </div>
            </div>

            <button
                onClick={onLoginRequired}
                className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
            >
                View Details & Bid
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
