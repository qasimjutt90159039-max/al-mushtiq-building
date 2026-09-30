import React, { useState } from 'react';
import { Briefcase, Send, CheckCircle2, Phone, Truck, ShieldAlert } from 'lucide-react';
import { SEO } from '../components/SEO';
import api from '../services/api';

export const BulkOrderPage: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    companyName: '',
    projectLocation: 'Rahim Yar Khan',
    requiredDate: '',
    productsSummary: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refNum, setRefNum] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/bulk-orders', formData);
      setSuccess(true);
      setRefNum(res.data.bulkOrder?.referenceNumber || '');
    } catch (err: any) {
      setError(err.message || 'Unable to submit bulk order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <SEO
        title="Contractor &amp; Bulk Project Orders"
        description="Wholesale supply agreements and large tonnage deliveries for construction companies in Rahim Yar Khan."
      />

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs font-bold">
          <Briefcase className="w-3.5 h-3.5 text-[#F28C28]" />
          <span>Contractors · Real Estate Developers · Government Schemes</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Contractor / Bulk Order Procurement
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Procuring trailer-loads of cement, mill-bundled steel rebars, or commercial plumbing for whole projects? Submit your bill of quantities (BOQ) below for dedicated supplier pricing and scheduled site delivery.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs max-w-2xl mx-auto">
        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h2 className="font-display text-2xl font-bold text-gray-900">
              Bulk Procurement Request Registered
            </h2>
            <p className="text-xs text-gray-500">
              Reference: <span className="font-mono font-bold text-gray-900">{refNum}</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Thank you, {formData.customerName}. Our commercial wholesale director at Al Mushtaq will review your materials summary and contact you today.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  customerName: '',
                  phone: '',
                  email: '',
                  companyName: '',
                  projectLocation: 'Rahim Yar Khan',
                  requiredDate: '',
                  productsSummary: '',
                  notes: ''
                });
              }}
              className="mt-4 px-6 py-2.5 bg-[#17191C] text-white text-xs font-bold rounded-lg"
            >
              Submit Another Project
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
                <label className="block font-semibold text-gray-700 mb-1">Contractor / Contact Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Haji Bashir Ahmad"
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

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Company / Project Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Al-Madina Builders / Commercial Center"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  value={formData.requiredDate}
                  onChange={e => setFormData({ ...formData, requiredDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Project Site Location *</label>
              <input
                type="text"
                required
                value={formData.projectLocation}
                onChange={e => setFormData({ ...formData, projectLocation: e.target.value })}
                placeholder="e.g. Manthar Road, Near Manzoorabad Pull, RYK"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Required Products &amp; Quantities Summary *</label>
              <textarea
                required
                rows={4}
                value={formData.productsSummary}
                onChange={e => setFormData({ ...formData, productsSummary: e.target.value })}
                placeholder="List required items, e.g.:
1. 500 Bags DG Khan OPC Cement
2. 8 Tons Grade 60 Rebar (4 Sutar & 3 Sutar)
3. 2 Dumper Chenab Coarse Sand
4. 200 Boxes Master Porcelain 24x24 Floor Tiles"
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Unloading Conditions &amp; Payment Terms</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Mention payment schedule, tractor trolley clearance, or site supervisor details..."
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2 outline-none focus:border-[#F28C28]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#17191C] hover:bg-[#F28C28] text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting BOQ...' : 'Submit Bulk Order Schedule'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
