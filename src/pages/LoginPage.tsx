import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <SEO title="Customer Sign In" />

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">Customer Portal</span>
          <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-gray-500">
            Track orders, view saved project quotes, and manage addresses.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#17191C] hover:bg-[#F28C28] text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-[#F28C28] hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
