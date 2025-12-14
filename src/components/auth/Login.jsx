import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login({ onRegisterClick }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginRole, setLoginRole] = useState('customer');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password, loginRole);
            if (user.role === 'admin') {
                throw new Error('Please use the Admin Portal to log in.');
            }
            if (user.role !== loginRole) {
                throw new Error(`This account is registered as a ${user.role}. Please switch to the ${user.role} tab.`);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Geometric Corner Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                    <path d="M 0,0 L 200,0 L 200,50 L 50,50 L 50,200 L 0,200 Z"
                        fill="none"
                        stroke="url(#grad1)"
                        strokeWidth="1" />
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.5 }} />
                            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.5 }} />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute top-12 left-12 w-3 h-3 bg-blue-500 rounded-full animate-pulse-slow"></div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 transform rotate-90">
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                    <path d="M 0,0 L 200,0 L 200,50 L 50,50 L 50,200 L 0,200 Z"
                        fill="none"
                        stroke="url(#grad2)"
                        strokeWidth="1" />
                    <defs>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.5 }} />
                            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.5 }} />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute top-12 left-12 w-3 h-3 bg-purple-500 rounded-full animate-pulse-slow delay-300"></div>
            </div>

            <div className="absolute bottom-0 left-0 w-64 h-64 transform rotate-270">
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                    <path d="M 0,0 L 200,0 L 200,50 L 50,50 L 50,200 L 0,200 Z"
                        fill="none"
                        stroke="url(#grad3)"
                        strokeWidth="1" />
                    <defs>
                        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.5 }} />
                            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.5 }} />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute top-12 left-12 w-3 h-3 bg-blue-400 rounded-full animate-pulse-slow delay-500"></div>
            </div>

            <div className="absolute bottom-0 right-0 w-64 h-64 transform rotate-180">
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                    <path d="M 0,0 L 200,0 L 200,50 L 50,50 L 50,200 L 0,200 Z"
                        fill="none"
                        stroke="url(#grad4)"
                        strokeWidth="1" />
                    <defs>
                        <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.5 }} />
                            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.5 }} />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute top-12 left-12 w-3 h-3 bg-purple-400 rounded-full animate-pulse-slow delay-700"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
                <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl">
                    {/* Logo/Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-300">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">
                            Don't have an account yet?{' '}
                            <button
                                onClick={onRegisterClick}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setLoginRole('customer')}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${loginRole === 'customer'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginRole('vendor')}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${loginRole === 'vendor'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            Vendor
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm animate-slide-up">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-500"
                                placeholder="email address"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-500"
                                placeholder="Password"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-[1.02]"
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-700"></div>
                        <span className="text-slate-500 text-sm">OR</span>
                        <div className="flex-1 h-px bg-slate-700"></div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                        <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-3 rounded-lg transition-all flex items-center justify-center group">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                        </button>
                        <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-3 rounded-lg transition-all flex items-center justify-center group">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </button>
                        <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white p-3 rounded-lg transition-all flex items-center justify-center group">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
