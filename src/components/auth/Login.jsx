import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

// --- Internal Icons ---
const Icon = ({ size = 24, className, ...props }) => (
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
  />
);

const ArrowLeft = (props) => (
  <Icon {...props}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </Icon>
);

const Mail = (props) => (
  <Icon {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </Icon>
);

const Lock = (props) => (
  <Icon {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);

const Beaker = (props) => (
  <Icon {...props}>
    <path d="M4.5 3h15" />
    <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
    <line x1="6" y1="14" x2="18" y2="14" />
  </Icon>
);

const AlertCircle = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Icon>
);

export default function Login({ onRegisterClick, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password, loginRole);

      // Defensive checks (prevents silent crashes)
      if (!user || !user.role) {
        throw new Error('Invalid response from server. Please try again.');
      }

      if (user.role === 'admin') {
        throw new Error('Please use the Admin Portal to log in.');
      }

      if (user.role !== loginRole) {
        const correctRoleName =
          user.role === 'customer' ? 'Buyer' : 'Vendor';

        throw new Error(
          `Account found, but it is registered as "${correctRoleName}". Please switch tabs.`
        );
      }

      // ✅ Successful login → navigation handled elsewhere (context / router)

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-900">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium bg-white/70 px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border p-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-blue-600 text-white mb-4">
            <Beaker size={28} />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-slate-500">Sign in to your account</p>
        </div>

        {/* Role Toggle */}
        <div className="bg-slate-100 p-1.5 rounded-xl flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setLoginRole('customer')}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              loginRole === 'customer'
                ? 'bg-white text-blue-600 shadow'
                : 'text-slate-500'
            }`}
          >
            Buyer
          </button>

          <button
            type="button"
            onClick={() => setLoginRole('vendor')}
            className={`flex-1 py-2 rounded-lg font-semibold ${
              loginRole === 'vendor'
                ? 'bg-white text-blue-600 shadow'
                : 'text-slate-500'
            }`}
          >
            Vendor
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex gap-2 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border bg-slate-50"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border bg-slate-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don’t have an account?{' '}
          <button
            onClick={onRegisterClick}
            className="text-blue-600 font-bold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
