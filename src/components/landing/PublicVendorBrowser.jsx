import React, { useState } from 'react';

// --- Internal Icon Components ---
const Icon = ({ size = 24, className, children, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        {children}
    </svg>
);
const ArrowLeft = (props) => <Icon {...props}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Icon>;
const Package = (props) => <Icon {...props}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16v-6.3a2.3 2.3 0 0 0-1.2-1.9l-7-4.2a2 2 0 0 0-2 0l-7 4.2a2.3 2.3 0 0 0-1.2 1.9V16a2.3 2.3 0 0 0 1.2 1.9l7 4.2a2 2 0 0 0 2 0l7-4.2a2.3 2.3 0 0 0 1.2-1.9z" /><polyline points="3.3 7 12 12 20.7 7" /><line x1="12" y1="22" x2="12" y2="12" /></Icon>;
const Star = (props) => <Icon {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>;
const Award = (props) => <Icon {...props}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></Icon>;
const ChevronRight = (props) => <Icon {...props}><polyline points="9 18 15 12 9 6" /></Icon>;
const ShieldCheck = (props) => <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></Icon>;
const Zap = (props) => <Icon {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>;
const Moon = (props) => <Icon {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Icon>;
const Sun = (props) => <Icon {...props}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></Icon>;


// --- MOCK COMPONENT (Internal) ---
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

export default function PublicVendorBrowser({ onNavigate, onLoginRequired }) {
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Sample categories and equipment
    const categories = ['All', 'Spectroscopy', 'Centrifuge', 'Freezer', 'Microscopy', 'Chromatography'];

    const equipmentShowcase = [
        { id: 1, name: 'High-Precision Spectrometer', category: 'Spectroscopy', rating: 4.8, vendors: 12, image: 'spectrometer' },
        { id: 2, name: 'Ultra Centrifuge 5000rpm', category: 'Centrifuge', rating: 4.6, vendors: 8, image: 'centrifuge' },
        { id: 3, name: '-80°C Ultra-Low Freezer', category: 'Freezer', rating: 4.9, vendors: 15, image: 'freezer' },
        { id: 4, name: 'Electron Microscope', category: 'Microscopy', rating: 4.7, vendors: 6, image: 'microscope' },
        { id: 5, name: 'HPLC System', category: 'Chromatography', rating: 4.8, vendors: 10, image: 'hplc' },
        { id: 6, name: 'Mass Spectrometer', category: 'Spectroscopy', rating: 4.9, vendors: 9, image: 'mass-spec' },
    ];

    const filteredEquipment = selectedCategory === 'All'
        ? equipmentShowcase
        : equipmentShowcase.filter(eq => eq.category === selectedCategory);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onNavigate('landing')}
                                className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <span className="font-bold text-xl text-slate-900">Marketplace</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onLoginRequired}
                                className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                Vendor Login
                            </button>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero / Intro */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Find the right <span className="text-blue-600">Equipment</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        Connect with verified manufacturers and distributors. Compare specs and get quotes instantly.
                    </p>
                </div>

                {/* Filter Chips */}
                <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === cat
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Equipment Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEquipment.map(equipment => (
                        <EquipmentCard
                            key={equipment.id}
                            equipment={equipment}
                            onLoginRequired={onLoginRequired}
                        />
                    ))}
                </div>
            </div>

            {/* Login CTA Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Package size={200} />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-bold mb-4">Are you a Supplier?</h2>
                        <p className="text-blue-100 mb-8 text-lg">
                            List your products on SciEquip Connect and reach thousands of labs worldwide looking for exactly what you sell.
                        </p>
                        <button
                            onClick={onLoginRequired}
                            className="px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-colors"
                        >
                            Become a Seller
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EquipmentCard({ equipment, onLoginRequired }) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300">
            {/* Card Header / Icon */}
            <div className="h-32 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <Package size={32} />
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    {equipment.rating}
                </div>
            </div>

            <div className="p-6">
                <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
                    {equipment.category}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {equipment.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-1.5">
                        <Award size={16} className="text-slate-400" />
                        <span>Verified</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-slate-400" />
                        <span>{equipment.vendors} Suppliers</span>
                    </div>
                </div>

                <button
                    onClick={onLoginRequired}
                    className="w-full py-3 bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                    <Zap size={16} />
                    Get Quotes
                </button>
            </div>
        </div>
    );
}
