import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

// --- Internal Icons ---
const Icon = ({ size = 24, className, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props} />
);
const ArrowLeft = (props) => <Icon {...props}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Icon>;
const Mail = (props) => <Icon {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Icon>;
const Lock = (props) => <Icon {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>;
const Beaker = (props) => <Icon {...props}><path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><line x1="6" y1="14" x2="18" y2="14" /></Icon>;
const AlertCircle = (props) => <Icon {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>;

export default function Login({ onRegisterClick, onBack }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginRole, setLoginRole] = useState('customer'); // Default to Customer (Buyer)
    const { login } = useAuth();

    // Fallback for back navigation
    const handleBack = () => {
        if (onBack) onBack();
        else window.history.back(); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Pass the selected role to the login function to ensure the backend validates the user type
            const user = await login(email, password, loginRole);
            
            if (user.role === 'admin') {
                throw new Error('Please use the Admin Portal to log in.');
            }
            if (user.role !== loginRole) {
                // If the user tries to login as Vendor but is actually a Customer (or vice versa)
                const correctRoleName = user.role === 'customer' ? 'Buyer' : 'Vendor';
                throw new Error(`Account found, but it is registered as a "${correctRoleName}". Please switch to the ${correctRoleName} tab.`);
            }
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
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-50 rounded-full blur-3xl opacity-40"></div>
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

            {/* Login Card */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative z-10 p-8 md:p-10 animate-fade-in-up">
                
                {/* Logo Area */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white mb-5 shadow-lg shadow-blue-500/30">
                        <Beaker size={28} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500">Sign in to your account</p>
                </div>

                {/* --- ROLE TOGGLE SWITCH --- */}
                <div className="bg-slate-100 p-1.5 rounded-xl flex gap-2 mb-8 border border-slate-200">
                    <button
                        type="button"
                        onClick={() => setLoginRole('customer')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${loginRole === 'customer'
                            ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        Buyer Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginRole('vendor')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${loginRole === 'vendor'
                            ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        Vendor Login
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                placeholder="name@laboratory.com"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold text-slate-700">Password</label>
                            <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : `Sign In as ${loginRole === 'customer' ? 'Buyer' : 'Vendor'}`}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-600 text-sm">
                        Don't have an account yet?{' '}
                        <button
                            onClick={onRegisterClick}
                            className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                        >
                            Sign up for free
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
