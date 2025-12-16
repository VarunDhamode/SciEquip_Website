import React, { useState } from 'react';

// --- Internal Icons ---
const Icon = ({ size = 24, className, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props} />
);
const ArrowLeft = (props) => <Icon {...props}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Icon>;
const Mail = (props) => <Icon {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Icon>;
const Lock = (props) => <Icon {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>;
const User = (props) => <Icon {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>;
const Briefcase = (props) => <Icon {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></Icon>;
const Beaker = (props) => <Icon {...props}><path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><line x1="6" y1="14" x2="18" y2="14" /></Icon>;
const AlertCircle = (props) => <Icon {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>;
const ChevronDown = (props) => <Icon {...props}><polyline points="6 9 12 15 18 9" /></Icon>;

// --- MOCK HOOK (DELETE THIS IN REAL APP) ---
const useAuth = () => ({
    register: async (data) => {
        await new Promise(r => setTimeout(r, 1000));
        console.log('Registering:', data);
        return { ...data, id: '123' };
    }
});

export default function Register({ onLoginClick, onBack }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer' // Default role for new signups
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    // Fallback for back navigation
    const handleBack = () => {
        if (onBack) onBack();
        else window.history.back(); 
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-slate-900">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-40"></div>
            </div>

            {/* Back Button */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white border border-transparent hover:border-slate-100 shadow-sm"
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
            </div>

            {/* Register Card */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative z-10 p-8 md:p-10 animate-fade-in-up">
                
                {/* Logo Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white mb-5 shadow-lg shadow-blue-500/30">
                        <Beaker size={28} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500">Join the SciEquip network</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                placeholder="Dr. John Doe"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                placeholder="name@lab.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                placeholder="Create a strong password"
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">I am a</label>
                        <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" size={20} />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="customer">Buyer (Research Lab/Institute)</option>
                                <option value="vendor">Vendor (Equipment Supplier)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-600 text-sm">
                        Already have an account?{' '}
                        <button
                            onClick={onLoginClick}
                            className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
