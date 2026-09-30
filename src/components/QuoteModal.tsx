import React, { useState } from 'react';
import { X, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { IProduct } from '../types';
import api from '../services/api';

interface QuoteModalProps {
  product?: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    productName: product?.name || 'Bulk Building Materials',
    productId: product?._id || '',
    quantity: product?.minimumOrderQuantity || 10,
    unit: product?.unit || 'Bag',
    projectType: 'Residential Construction',
    deliveryLocation: 'Rahim Yar Khan City',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await api.post('/quotes', formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quote request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden z-10 p-6 max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-900 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900">Quotation Request Received</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Thank you. Our sales team at Al Mushtaq Building Material Store will calculate the latest project rates and contact you on <span className="font-semibold text-gray-900">{formData.phone}</span>.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-[#17191C] hover:bg-[#28323A] text-white text-xs font-bold rounded-lg"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F28C28]">
                Al Mushtaq Material Quotation
              </span>
              <h2 className="text-lg font-bold text-gray-900">
                Request a Bulk Price Quote
              </h2>
              {product && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Item: <span className="font-semibold text-gray-800">{product.name}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Muhammad Asif"
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#F28C28]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0301 1234567"
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#F28C28]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Quantity Required *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#F28C28]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Unit of Measure *</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. Bag, Ton, Box, 1000 Pcs, 100 Cft"
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#F28C28]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#F28C28] bg-white"
                  >
                    <option value="Residential Construction">Residential House Construction</option>
                    <option value="Commercial Plaza">Commercial Plaza / Market</option>
                    <option value="Boundary Wall / Plot">Boundary Wall / Foundation</option>
                    <option value="Plumbing & Sanitary Works">Plumbing &amp; Sanitary</option>
                    <option value="Tile Flooring & Renovation">Tile Flooring Renovation</option>
                    <option value="Contractor Bulk Supply">Contractor Wholesale Supply</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Site Delivery Area *</label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryLocation}
                    onChange={e => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    placeholder="e.g. Manthar Road, Sadiqabad"
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#F28C28]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Additional Project Specifications / Notes</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention target brand (e.g. DG Khan, Mughal Steel), required delivery date, or site offloading details..."
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#17191C] hover:bg-[#F28C28] text-white font-bold py-2.5 px-4 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Quote...' : 'Submit Quotation Request'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
