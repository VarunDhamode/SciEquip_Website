import React, { useState, useEffect } from 'react';

// --- Internal Icon Components to remove external dependencies ---
const Icon = ({ size = 24, className, children, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        {children}
    </svg>
);

const ArrowRight = (props) => <Icon {...props}><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></Icon>;
const CheckCircle = (props) => <Icon {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>;
const Menu = (props) => <Icon {...props}><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></Icon>;
const X = (props) => <Icon {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>;
const Beaker = (props) => <Icon {...props}><path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><line x1="6" y1="14" x2="18" y2="14" /></Icon>;
const Search = (props) => <Icon {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>;
const FileText = (props) => <Icon {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></Icon>;
const Users = (props) => <Icon {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>;
const ShieldCheck = (props) => <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></Icon>;
const TrendingUp = (props) => <Icon {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></Icon>;
const Quote = (props) => <Icon {...props}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h1c0 1-1 2-2 2v3c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h1c0 1-1 2-2 2v3c0 1 0 1 1 1z" /></Icon>;
const Mail = (props) => <Icon {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Icon>;
const Send = (props) => <Icon {...props}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></Icon>;


export default function LandingPage({ onNavigate }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [contactStatus, setContactStatus] = useState('idle'); // idle, sending, success

    // Configuration for Contact Emails (Not visible to user)
    const TARGET_EMAILS = [
        'varundhamode30@gmail.com',
        // Add more emails here in the future, e.g., 'sales@sciequip.com'
    ];

    // Force light mode on landing page & Handle scroll for navbar styling
    useEffect(() => {
        document.documentElement.classList.remove('dark');

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setContactStatus('sending');

        // Retrieve form data
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            targets: TARGET_EMAILS
        };

        // --- SIMULATION OF EMAIL SENDING ---
        // In a real production app, you would send 'data' to your backend API here.
        // The backend would then use an email service (like SendGrid/AWS SES) to email varundhamode30@gmail.com
        console.log("Sending email to internal list:", TARGET_EMAILS);
        console.log("Message Content:", data);

        setTimeout(() => {
            setContactStatus('success');
            // Auto close after success
            setTimeout(() => {
                setIsContactOpen(false);
                setContactStatus('idle');
            }, 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 relative">
            {/* Navigation */}
            <header
                className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
                            <div className="bg-blue-600 p-2 rounded-lg text-white">
                                <Beaker size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                                SciEquip Connect
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {['How it Works', 'About', 'Testimonials'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                                    className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm uppercase tracking-wide"
                                >
                                    {item}
                                </button>
                            ))}
                            <div className="h-6 w-px bg-slate-200"></div>
                            <button
                                onClick={() => onNavigate('login')}
                                className="text-slate-700 font-semibold hover:text-blue-600 transition-colors"
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => onNavigate('register')}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl">
                        <div className="flex flex-col p-4 space-y-4">
                            {['How it Works', 'About', 'Testimonials'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                                    className="text-left font-medium text-slate-700 py-2 border-b border-slate-50"
                                >
                                    {item}
                                </button>
                            ))}
                            <div className="pt-2 flex flex-col gap-3">
                                <button
                                    onClick={() => onNavigate('login')}
                                    className="w-full py-3 text-slate-600 font-semibold border border-slate-200 rounded-lg"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => onNavigate('register')}
                                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md"
                                >
                                    Sign Up Free
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6 animate-fade-in-up">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                The #1 Marketplace for Scientific Gear
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                                Equip Your Lab <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                                    Without Limits
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
                                Connect directly with global vendors. Get competitive quotes, compare specs, and procure high-quality scientific instruments effortlessly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button
                                    onClick={() => onNavigate('register')}
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Get Started
                                    <ArrowRight size={20} />
                                </button>
                                <button
                                    onClick={() => scrollToSection('how-it-works')}
                                    className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-lg font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    How it works
                                </button>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-6 opacity-80">
                                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Trusted by labs at</p>
                                <div className="flex gap-6 grayscale opacity-60">
                                    {/* Simple placeholders for logos */}
                                    <div className="h-6 w-20 bg-slate-300 rounded"></div>
                                    <div className="h-6 w-20 bg-slate-300 rounded"></div>
                                    <div className="h-6 w-20 bg-slate-300 rounded"></div>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden md:block">
                            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-2 border border-slate-100 rotate-1 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="/assets/images/scientist-hero.png"
                                    alt="Modern Laboratory"
                                    className="w-full h-auto rounded-xl bg-slate-100"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentNode.className += ' h-96 flex items-center justify-center bg-blue-50';
                                        e.target.parentNode.innerHTML = '<div class="text-blue-200"><svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3M6 14h12"/></svg></div>';
                                    }}
                                />
                                {/* Floating Badge 1 */}
                                <div className="absolute -left-8 top-20 bg-white p-4 rounded-lg shadow-xl border border-slate-50 flex items-center gap-3 animate-bounce-slow">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold">Verified Vendors</p>
                                        <p className="text-sm font-bold text-slate-800">100% Quality</p>
                                    </div>
                                </div>
                                {/* Floating Badge 2 */}
                                <div className="absolute -right-8 bottom-20 bg-white p-4 rounded-lg shadow-xl border border-slate-50 flex items-center gap-3 animate-bounce-slow delay-700">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold">Cost Savings</p>
                                        <p className="text-sm font-bold text-slate-800">Up to 30%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-2xl opacity-10 transform translate-y-4 translate-x-4 -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Persona Section (Buyers vs Vendors) */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tailored for the Science Community</h2>
                        <p className="text-lg text-slate-600">Whether you're running experiments or supplying the gear, we've built the perfect ecosystem for you.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* For Buyers */}
                        <div className="group bg-white rounded-3xl p-8 lg:p-12 shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <Search size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">For Researchers & Labs</h3>
                                <ul className="space-y-4 mb-8">
                                    {[
                                        'Access a global network of verified suppliers',
                                        'Compare quotes to fit your budget',
                                        'Streamline procurement with one platform'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600">
                                            <CheckCircle className="flex-shrink-0 text-blue-500 mt-1" size={18} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => onNavigate('browse-vendors')}
                                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
                                >
                                    Post a Requirement
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* For Vendors */}
                        <div className="group bg-white rounded-3xl p-8 lg:p-12 shadow-sm hover:shadow-xl border border-slate-100 hover:border-teal-200 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <Users size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-8 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">For Equipment Vendors</h3>
                                <ul className="space-y-4 mb-8">
                                    {[
                                        'Receive qualified leads directly to your inbox',
                                        'Expand your market reach globally',
                                        'Manage bids and communications easily'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600">
                                            <CheckCircle className="flex-shrink-0 text-teal-500 mt-1" size={18} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => onNavigate('browse-rfqs')}
                                    className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
                                >
                                    Join as Vendor
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Simple Process</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6">How SciEquip Works</h2>
                        <p className="text-lg text-slate-600">From request to delivery, we make the process transparent and efficient.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 z-0"></div>

                        {[
                            {
                                icon: <FileText size={24} />,
                                title: "1. Post Requirement",
                                desc: "Detail your specifications, budget, and timeline in a simple form."
                            },
                            {
                                icon: <TrendingUp size={24} />,
                                title: "2. Receive Quotes",
                                desc: "Vetted vendors review your request and submit competitive bids."
                            },
                            {
                                icon: <CheckCircle size={24} />,
                                title: "3. Choose & Order",
                                desc: "Compare offers, chat with vendors, and select the best match."
                            }
                        ].map((step, idx) => (
                            <div key={idx} className="relative z-10 bg-white p-6 rounded-2xl text-center group hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-24 h-24 mx-auto mb-6 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center text-blue-600 shadow-sm group-hover:border-blue-100 group-hover:scale-110 transition-all">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Trusted by the Scientific Community</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                quote: "SciEquip Connect has revolutionized our procurement. We cut our equipment sourcing time by 50% and saved significantly on our mass spectrometer purchase.",
                                author: "Dr. Sarah Chen",
                                role: "Lab Director, BioTech Inc",
                                image: "https://i.pravatar.cc/150?u=1"
                            },
                            {
                                quote: "As a specialized equipment vendor, this platform gives us access to serious buyers we wouldn't find elsewhere. The lead quality is consistently high.",
                                author: "James Wilson",
                                role: "Sales Manager, LabTech Solutions",
                                image: "https://i.pravatar.cc/150?u=2"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-800 p-8 md:p-10 rounded-2xl border border-slate-700 relative">
                                <Quote className="absolute top-8 right-8 text-slate-600 opacity-20" size={48} />
                                <div className="flex items-center gap-4 mb-6">
                                    <img src={item.image} alt={item.author} className="w-14 h-14 rounded-full border-2 border-slate-600" />
                                    <div>
                                        <h4 className="font-bold text-lg">{item.author}</h4>
                                        <p className="text-slate-400 text-sm">{item.role}</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-lg leading-relaxed italic">"{item.quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold mb-6">Ready to upgrade your lab?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of researchers and vendors connecting daily on SciEquip.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('register')}
                            className="px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-colors"
                        >
                            Sign Up Now
                        </button>
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="px-8 py-4 bg-transparent border border-blue-300 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-16 pb-8 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                                    <Beaker size={20} />
                                </div>
                                <span className="text-xl font-bold text-slate-900">SciEquip</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                The leading marketplace for scientific equipment procurement.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600">Browse RFQs</a></li>
                                <li><a href="#" className="hover:text-blue-600">Browse Vendors</a></li>
                                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>© 2024 SciEquip Connect. All rights reserved.</p>
                        <div className="flex gap-6">
                            <span>Made for Science 🔬</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Contact Sales Modal */}
            {isContactOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsContactOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 animate-fade-in-up">
                        <button
                            onClick={() => setIsContactOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Contact Sales</h3>
                            <p className="text-slate-600">Have questions about our enterprise plans? Send us a message and we'll get back to you shortly.</p>
                        </div>

                        {contactStatus === 'success' ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-3">
                                    <CheckCircle size={24} />
                                </div>
                                <h4 className="text-green-800 font-bold text-lg mb-1">Message Sent!</h4>
                                <p className="text-green-600">Thank you for contacting us. We will respond to your email shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Dr. John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                                    <input
                                        required
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="john@laboratory.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                    <textarea
                                        required
                                        id="message"
                                        name="message"
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Tell us about your requirements..."
                                    ></textarea>
                                </div>
                                <button
                                    disabled={contactStatus === 'sending'}
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {contactStatus === 'sending' ? (
                                        <>Sending...</>
                                    ) : (
                                        <>Send Message <Send size={18} /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
