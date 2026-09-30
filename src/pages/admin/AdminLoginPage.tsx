import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@almushtaq.com');
  const [password, setPassword] = useState('admin_material_2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#17191C] flex items-center justify-center p-4">
      <SEO title="Admin Login" />

      <div className="max-w-md w-full bg-white rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <Logo />
          <div className="pt-2">
            <h1 className="font-display text-xl font-black text-gray-900">
              Admin Management Portal
            </h1>
            <p className="text-xs text-gray-500">
              Authorized personnel only. Product catalog &amp; orders control.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28]"
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-500">
            <p className="font-semibold text-gray-700 mb-0.5">Default System Credentials:</p>
            <p>Email: <span className="font-mono text-gray-900">admin@almushtaq.com</span></p>
            <p>Password: <span className="font-mono text-gray-900">admin_material_2026</span></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#17191C] hover:bg-[#F28C28] text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In as Admin'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
