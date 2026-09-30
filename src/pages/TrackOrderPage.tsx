import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';
import api from '../services/api';
import { IOrder } from '../types';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrackOrder = async (num: string, ph: string) => {
    if (!num.trim() || !ph.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await api.get(`/orders/track?orderNumber=${encodeURIComponent(num.trim())}&phone=${encodeURIComponent(ph.trim())}`);
      setOrder(res.data.order);
    } catch (err: any) {
      setError(err.message || 'No matching order found. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber && phone) {
      fetchTrackOrder(orderNumber, phone);
    }
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackOrder(orderNumber, phone);
  };

  const steps = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Dispatched', 'Delivered'];
  const currentStepIndex = order ? steps.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <SEO title="Track Order Status" description="Check live status and delivery timeline for your building material orders." />

      <div className="text-center max-w-lg mx-auto">
        <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Track Your Material Order
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Enter your Order Number (e.g. <span className="font-mono font-semibold">AMS-2026-000001</span>) and Contact Phone
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs max-w-xl mx-auto">
        <form onSubmit={handleTrackSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Order Number *</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="e.g. AMS-2026-000001"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28] font-mono text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Customer Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 0301 3242408"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#17191C] hover:bg-[#F28C28] text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching Order...' : 'Track Order'}</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Tracking Result */}
      {order && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F28C28]">Verified Order</span>
              <h2 className="font-mono text-xl font-bold text-gray-900">{order.orderNumber}</h2>
              <p className="text-xs text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Current Status</span>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-6">Delivery Progress</h3>
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {steps.map((st, i) => {
                const isPassed = currentStepIndex >= i;
                const isCurrent = currentStepIndex === i;
                return (
                  <div key={st} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isPassed ? 'bg-[#F28C28] text-white shadow-xs' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <div className="md:text-center">
                      <p className={`text-xs font-bold ${isCurrent ? 'text-[#F28C28]' : isPassed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {st}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items & Shipping address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 uppercase">Ordered Products ({order.items.length})</h4>
              <div className="divide-y divide-gray-100">
                {order.items.map(it => (
                  <div key={it.productId} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{it.name}</p>
                      <p className="text-gray-400">{it.quantity} {it.unit} × Rs. {it.price.toLocaleString()}</p>
                    </div>
                    <span className="font-bold text-gray-900 tabular-nums">
                      Rs. {(it.price * it.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="font-bold text-gray-900 uppercase">Site Delivery Information</h4>
              <p><span className="text-gray-500">Customer:</span> <span className="font-semibold text-gray-800">{order.customerName}</span></p>
              <p><span className="text-gray-500">Address:</span> <span className="font-semibold text-gray-800">{order.shippingAddress.street}, {order.shippingAddress.area}, {order.shippingAddress.city}</span></p>
              <p><span className="text-gray-500">Payment:</span> <span className="font-semibold text-gray-800">{order.paymentMethod}</span></p>
              <p className="text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                Total Payable: <span className="text-[#F28C28]">Rs. {order.total.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Need help row */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-2">
            <span>Need immediate delivery dispatch update?</span>
            <a
              href={`https://wa.me/923013242408?text=Order%20Inquiry%20for%20${encodeURIComponent(order.orderNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F28C28] font-bold hover:underline flex items-center gap-1"
            >
              <span>Contact Store Dispatch on WhatsApp →</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
