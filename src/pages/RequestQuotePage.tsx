import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Phone, FileText } from 'lucide-react';
import { SEO } from '../components/SEO';
import api from '../services/api';

export const RequestQuotePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    productName: '',
    quantity: 10,
    unit: 'Bag',
    projectType: 'Residential Construction',
    deliveryLocation: 'Rahim Yar Khan City',
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
      await api.post('/quotes', formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <SEO
        title="Request a Building Material Quotation"
        description="Submit your bulk construction material requirements for custom rates in Rahim Yar Khan."
      />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">
          Competitive Contractor &amp; Project Rates
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Request a Material Quotation
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Submit quantities for cement bags, Grade 60 steel rebars, bricks, crushed aggregate, or plumbing supplies. Our team provides verified daily rates with site offloading in Rahim Yar Khan.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs max-w-2xl mx-auto">
        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h2 className="font-display text-2xl font-bold text-gray-900">
              Quotation Request Received!
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Thank you, {formData.name}. Our commercial estimating department will evaluate your material schedule and contact you shortly on <span className="font-bold text-gray-900">{formData.phone}</span>.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    productName: '',
                    quantity: 10,
                    unit: 'Bag',
                    projectType: 'Residential Construction',
                    deliveryLocation: 'Rahim Yar Khan City',
                    message: ''
                  });
                }}
                className="px-5 py-2.5 bg-[#17191C] text-white font-bold text-xs rounded-lg"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-semibold">
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
                  placeholder="e.g. Engr. Naveed Akhtar"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0301 3242408"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="For written official proposal PDF"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
              <div className="sm:col-span-1">
                <label className="block font-semibold text-gray-700 mb-1">Target Material / Product *</label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={e => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g. DG Khan OPC Cement"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Unit of Measure *</label>
                <select
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28] bg-white"
                >
                  <option value="Bag">Bag (Cement)</option>
                  <option value="Ton">Metric Ton (Steel / Rebar)</option>
                  <option value="1000 Pcs">1000 Pcs (Bricks)</option>
                  <option value="100 Cu.Ft">100 Cu.Ft / Cft (Sand / Crush)</option>
                  <option value="Box">Box (Tiles)</option>
                  <option value="Drum (16L)">Drum 16L (Paints)</option>
                  <option value="Gallon">Gallon (Paints)</option>
                  <option value="Length">Length (Pipes 10ft/13ft)</option>
                  <option value="Coil (90m)">Coil 90m (Copper Wire)</option>
                  <option value="Set">Set / Piece</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Project Category</label>
                <select
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28] bg-white"
                >
                  <option value="Residential Construction">Residential House Construction</option>
                  <option value="Commercial Plaza">Commercial Plaza / Market</option>
                  <option value="Boundary Wall">Boundary Wall &amp; Retaining Wall</option>
                  <option value="Plumbing & Sanitary">Plumbing &amp; Sanitary Overhaul</option>
                  <option value="Industrial Shed">Industrial Warehouse / Shed</option>
                  <option value="Contractor Resale">Contractor Reseller</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Site Delivery Location *</label>
                <input
                  type="text"
                  required
                  value={formData.deliveryLocation}
                  onChange={e => setFormData({ ...formData, deliveryLocation: e.target.value })}
                  placeholder="e.g. Manthar Road / Sadiqabad Bypass"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Project Details &amp; Special Requirements</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention desired brand, steel bar size breakdown (3 sutar, 4 sutar), or estimated project start date..."
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#17191C] hover:bg-[#F28C28] text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit Quotation Request'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
