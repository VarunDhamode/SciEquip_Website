import React, { useState } from 'react';
import { ArrowLeft, Package, Star, Award } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

export default function PublicVendorBrowser({ onNavigate, onLoginRequired }) {
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Sample categories and equipment
    const categories = ['All', 'Spectroscopy', 'Centrifuge', 'Freezer', 'Microscopy', 'Chromatography'];

    const equipmentShowcase = [
        { id: 1, name: 'High-Precision Spectrometer', category: 'Spectroscopy', rating: 4.8, vendors: 12 },
        { id: 2, name: 'Ultra Centrifuge 5000rpm', category: 'Centrifuge', rating: 4.6, vendors: 8 },
        { id: 3, name: '-80°C Ultra-Low Freezer', category: 'Freezer', rating: 4.9, vendors: 15 },
        { id: 4, name: 'Electron Microscope', category: 'Microscopy', rating: 4.7, vendors: 6 },
        { id: 5, name: 'HPLC System', category: 'Chromatography', rating: 4.8, vendors: 10 },
        { id: 6, name: 'Mass Spectrometer', category: 'Spectroscopy', rating: 4.9, vendors: 9 },
    ];

    const filteredEquipment = selectedCategory === 'All'
        ? equipmentShowcase
        : equipmentShowcase.filter(eq => eq.category === selectedCategory);

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
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Browse Equipment</h1>
                            <p className="text-slate-600 dark:text-slate-300 mt-2">
                                Explore available scientific equipment. Login to submit RFQs and connect with verified vendors.
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Category Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mb-6 transition-colors duration-300">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
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

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 text-blue-50">
                        Login to submit RFQs and connect with verified vendors
                    </p>
                    <button
                        onClick={onLoginRequired}
                        className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        Login / Register
                    </button>
                </div>
            </div>
        </div>
    );
}

function EquipmentCard({ equipment, onLoginRequired }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-transparent dark:border-slate-700">
            {/* Equipment Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                <Package className="text-white" size={32} />
            </div>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{equipment.name}</h3>

            <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Category: {equipment.category}
            </div>

            {/* Rating & Vendors */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{equipment.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Award size={18} />
                    <span className="text-sm">{equipment.vendors} Vendors</span>
                </div>
            </div>

            <button
                onClick={onLoginRequired}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
            >
                Login to Submit RFQ
            </button>
        </div>
    );
}
