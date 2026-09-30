import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, FileText, MapPin, LogOut, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { IOrder } from '../types';

export const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile edit
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [area, setArea] = useState(user?.address?.area || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    api.get('/orders/my')
      .then(res => setOrders(res.data.orders || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', {
        name,
        phone,
        address: { street, area, city: 'Rahim Yar Khan', postalCode: '64200' }
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <SEO title="My Account" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#17191C] text-white flex items-center justify-center font-display text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">{user.role} Account</span>
            <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">{user.name}</h1>
            <p className="text-xs text-gray-500">{user.email} · {user.phone}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-red-400 text-gray-700 hover:text-red-600 rounded-lg text-xs font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 bg-white p-3 rounded-xl border border-gray-200 space-y-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center gap-2.5 transition-colors ${
              activeTab === 'orders' ? 'bg-[#17191C] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Package className="w-4 h-4 text-[#F28C28]" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center gap-2.5 transition-colors ${
              activeTab === 'profile' ? 'bg-[#17191C] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4 text-[#F28C28]" />
            <span>Profile &amp; Address</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-gray-900">
                Order History &amp; Tracking
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map(n => <div key={n} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center space-y-3">
                  <p className="text-sm font-semibold text-gray-700">You haven't placed any orders yet.</p>
                  <Link to="/shop" className="inline-block px-4 py-2 bg-[#F28C28] text-white text-xs font-bold rounded-lg">
                    Browse Materials
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 text-xs">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                        <div>
                          <span className="font-mono text-sm font-bold text-gray-900">{order.orderNumber}</span>
                          <span className="text-gray-400 block text-[11px]">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded">
                            {order.orderStatus}
                          </span>
                          <Link
                            to={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&phone=${encodeURIComponent(order.phone)}`}
                            className="text-[#F28C28] hover:underline font-bold flex items-center gap-1"
                          >
                            <span>Live Tracking</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-50">
                        {order.items.map(it => (
                          <div key={it.productId} className="py-1.5 flex justify-between">
                            <span className="font-medium text-gray-800">{it.name} ({it.quantity} {it.unit})</span>
                            <span className="font-bold tabular-nums">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline text-sm font-bold">
                        <span>Total:</span>
                        <span className="text-base text-[#F28C28] tabular-nums">Rs. {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 space-y-6">
              <h2 className="font-display text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                Personal Information &amp; Delivery Address
              </h2>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-bold">
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Default Street / Site</label>
                    <input
                      type="text"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Area / Colony</label>
                    <input
                      type="text"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#17191C] hover:bg-[#28323A] text-white font-bold rounded text-xs"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
