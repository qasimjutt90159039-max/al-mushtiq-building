import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageSquare, Clock, Send, CheckCircle2, FileText } from 'lucide-react';
import { SEO } from '../components/SEO';
import api from '../services/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Material Price Inquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Material Price Inquiry',
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try calling directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <SEO
        title="Contact Al Mushtaq Building Material Store"
        description="Call or visit Al Mushtaq Building Material Store at Basti Manzoorabad Pull, Manthar Road, Rahim Yar Khan. Phone: +92 301 3242408."
      />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">
          Rahim Yar Khan, Pakistan
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Contact Our Store
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Reach out for price inquiries, vehicle delivery schedules, stock verification, or commercial contractor quotations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Information Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#17191C] text-white p-6 sm:p-8 rounded-2xl border border-[#28323A] space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold">
              Al Mushtaq Building Material Store
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Building Materials / Construction Supplies / Hardware
            </p>
          </div>

          <div className="space-y-4 text-xs text-gray-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Physical Address:</span>
                <span>Basti Manzoorabad Pull, Manthar Road, Rahim Yar Khan, Pakistan</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Phone / WhatsApp:</span>
                <a href="tel:+923013242408" className="hover:text-[#F4B942] font-semibold text-sm">
                  +92 301 3242408
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Operating Hours:</span>
                <span>Monday – Saturday: 8:00 AM – 8:00 PM</span>
                <span className="block text-gray-400 text-[11px]">Sunday: Closed</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons (Section 55) */}
          <div className="pt-4 border-t border-gray-800 space-y-2.5">
            <a
              href="tel:+923013242408"
              className="w-full py-3 px-4 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 text-center"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now (+92 301 3242408)</span>
            </a>

            <a
              href="https://wa.me/923013242408?text=Hello%20Al%20Mushtaq%2C%20I%20have%20an%20inquiry%20regarding%20building%20materials."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#16803C] hover:bg-[#126b32] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Store</span>
            </a>

            <Link
              to="/request-quote"
              className="w-full py-3 px-4 bg-[#28323A] hover:bg-[#323e48] border border-gray-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 text-center"
            >
              <FileText className="w-4 h-4 text-[#F4B942]" />
              <span>Request a Quote</span>
            </Link>
          </div>
        </div>

        {/* Right Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-2">
            Send an Online Message
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Leave your contact details and message below. We respond promptly during operating hours.
          </p>

          {success ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-gray-900">Message Delivered!</h3>
              <p className="text-xs text-gray-500">
                Thank you. We have received your inquiry and will reach out shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 text-xs font-bold text-[#F28C28] hover:underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28]"
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
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Inquiry Subject</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28] bg-white"
                >
                  <option value="Material Price Inquiry">Material Price Inquiry</option>
                  <option value="Site Delivery & Offloading">Site Delivery &amp; Offloading</option>
                  <option value="Contractor Bulk Terms">Contractor Bulk Terms</option>
                  <option value="Product Availability Confirmation">Product Availability Confirmation</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe the materials and quantities you need..."
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#F28C28]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#17191C] hover:bg-[#F28C28] text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
