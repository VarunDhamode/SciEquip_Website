import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Menu, X } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Force light mode on landing page
    React.useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans relative z-0 overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            {/* Beaker Icon (SVG) */}
                            <div className="text-blue-900">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.5 3h15" />
                                    <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
                                    <path d="M6 14h12" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-blue-900">SciEquip Connect</span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <button onClick={() => scrollToSection('how-it-works')} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">How it Works</button>
                            <button onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About</button>
                            <button onClick={() => scrollToSection('resources')} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Resources</button>
                            <button
                                onClick={() => onNavigate('register')}
                                className="px-5 py-2.5 border border-blue-900 text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Sign Up
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 p-4 shadow-lg absolute w-full">
                        <div className="flex flex-col gap-4">
                            <button onClick={() => scrollToSection('how-it-works')} className="text-left font-medium text-slate-700">How it Works</button>
                            <button onClick={() => scrollToSection('about')} className="text-left font-medium text-slate-700">About</button>
                            <button onClick={() => scrollToSection('resources')} className="text-left font-medium text-slate-700">Resources</button>
                            <button
                                onClick={() => onNavigate('register')}
                                className="w-full text-center px-5 py-3 bg-blue-900 text-white font-semibold rounded-lg"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="pt-16 pb-24 md:pt-24 md:pb-32 bg-gradient-to-br from-white via-blue-50/30 to-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-900 leading-tight mb-6">
                                Connect with <br />
                                Global Vendors <br />
                                for Scientific <br />
                                Equipment
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                                Find high-quality vendors and competitive quotes for all your scientific equipment needs
                            </p>
                            <button
                                onClick={() => onNavigate('register')}
                                className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-lg shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-1"
                            >
                                Get Started
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
                            {/* Scientist Hero Image */}
                            <img
                                src="/assets/images/scientist-hero.png"
                                alt="Scientist with microscope"
                                className="relative z-10 w-full h-auto drop-shadow-2xl"
                            />
                            {/* Decorative line */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cards Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* For Buyers Card */}
                        <div className="group bg-white border border-slate-200 rounded-2xl p-10 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
                            <div className="mb-8">
                                <img src="/assets/images/icon-document.png" alt="Buyers Icon" className="h-20 w-auto" />
                            </div>
                            <h3 className="text-3xl font-bold text-blue-900 mb-4">For Buyers</h3>
                            <p className="text-lg text-slate-600 mb-8 h-20">
                                Post your requirements and get multiple quotes.
                            </p>
                            <button
                                onClick={() => onNavigate('register')}
                                className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
                            >
                                Post a Requirement
                            </button>
                        </div>

                        {/* For Vendors Card */}
                        <div className="group bg-white border border-slate-200 rounded-2xl p-10 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
                            <div className="mb-8">
                                <img src="/assets/images/icon-building.png" alt="Vendors Icon" className="h-20 w-auto" />
                            </div>
                            <h3 className="text-3xl font-bold text-blue-900 mb-4">For Vendors</h3>
                            <p className="text-lg text-slate-600 mb-8 h-20">
                                Find qualified leads and grow your business
                            </p>
                            <button
                                onClick={() => onNavigate('register')} // Typically register as vendor
                                className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why SciEquip */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-16 text-center">
                        Why SciEquip Connect?
                    </h2>

                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 max-w-4xl mx-auto">
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="text-2xl md:text-3xl text-slate-800">Access to global vendors</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="text-2xl md:text-3xl text-slate-800">Qualified leads</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Find Right Equipment (About) */}
            <section id="about" className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 leading-tight">
                                Find the Right <br />
                                Scientific Equipment
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Connect with vetted vendors and get competitive quotes. We streamline the procurement process for research facilities worldwide.
                            </p>
                            <button
                                onClick={() => onNavigate('register')}
                                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all uppercase tracking-wide text-sm"
                            >
                                Post Requirement
                            </button>
                        </div>
                        <div className="relative">
                            <img
                                src="/assets/images/scientist-desk.png"
                                alt="Scientist working at desk"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* About 2 */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <img
                                src="/assets/images/laptop-checklist.png"
                                alt="Dashboard interface"
                                className="w-full h-auto drop-shadow-xl"
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                                About SciEquip Connect
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                SciEquip Connect offers buyers and vendors the same simplicity in an online marketplace for scientific instruments. We provide an easy term access, rewards mechanism for tailored quotes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">How It Works</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="text-center group">
                            <div className="w-24 h-24 mx-auto mb-8 bg-blue-50 rounded-3xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <img src="/assets/images/icon-document.png" className="w-12 h-12" alt="Post" />
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-3">Post Requirement</h3>
                            <p className="text-slate-600">Describe your equipment needs.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center group">
                            <div className="w-24 h-24 mx-auto mb-8 bg-blue-50 rounded-3xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <img src="/assets/images/icon-quotes.png" className="w-12 h-12" alt="Quotes" />
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-3">Get Quotes</h3>
                            <p className="text-slate-600">Receive competitive quotes from vendors</p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center group">
                            <div className="w-24 h-24 mx-auto mb-8 bg-blue-50 rounded-3xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <img src="/assets/images/icon-compare.png" className="w-12 h-12" alt="Decide" />
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-3">Compare & Decide</h3>
                            <p className="text-slate-600">Evaluate options and choose the best vendor</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-blue-900 mb-12">Testimonials</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 border border-slate-200 rounded-2xl hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-slate-200 rounded-full overflow-hidden flex-shrink-0">
                                    <img src="https://i.pravatar.cc/150?u=1" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-slate-600 mb-4 leading-relaxed">
                                        "SciEquip Connect has revolutionized our procurement process. We now receive quotes from multiple vendors in one place making it easier to compare options."
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border border-slate-200 rounded-2xl hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-slate-200 rounded-full overflow-hidden flex-shrink-0">
                                    <img src="https://i.pravatar.cc/150?u=2" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-slate-600 mb-4 leading-relaxed">
                                        "The platform's user-friendly interface and verified vendor network have significantly streamlined our equipment purchasing."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Clients (Vendor CTA) */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-blue-900 mb-6">Our Clients</h2>
                            <p className="text-xl text-slate-600 mb-8">
                                Join our network of vetted vendors and reach a wider audience
                            </p>
                            <button
                                onClick={() => onNavigate('register')}
                                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all uppercase tracking-wide text-sm"
                            >
                                Join as Vendor
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <img src="/assets/images/business-professional.png" alt="Business Professional" className="max-w-xs md:max-w-sm" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500">© 2024 SciEquip Connect. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-blue-900">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-blue-900">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
