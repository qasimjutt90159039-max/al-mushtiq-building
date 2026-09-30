import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    street: '',
    area: '',
    city: 'Rahim Yar Khan'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <SEO title="Create Customer Account" />

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">New Customer Registration</span>
          <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-gray-500">
            Save delivery addresses, track orders, and request contractor quotes.
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
            <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Muhammad Asif"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0301 1234567"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min 6 characters"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
            />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <span className="font-bold text-gray-900 block mb-2">Default Site Address (Rahim Yar Khan)</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  value={formData.street}
                  onChange={e => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Street / Plot / Location"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                  placeholder="Area / Colony"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.city}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-[#F28C28] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
