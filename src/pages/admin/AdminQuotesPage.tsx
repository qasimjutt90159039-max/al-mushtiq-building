import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { SEO } from '../../components/SEO';
import api from '../../services/api';
import { IQuoteRequest } from '../../types';

export const AdminQuotesPage: React.FC = () => {
  const [quotes, setQuotes] = useState<IQuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingQuote, setEditingQuote] = useState<IQuoteRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [quotedAmount, setQuotedAmount] = useState('');
  const [statusVal, setStatusVal] = useState('New');

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/quotes');
      setQuotes(res.data.quotes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const openEdit = (q: IQuoteRequest) => {
    setEditingQuote(q);
    setStatusVal(q.status);
    setAdminNotes(q.adminNotes || '');
    setQuotedAmount(q.quotedAmount ? String(q.quotedAmount) : '');
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuote) return;
    try {
      await api.put(`/quotes/${editingQuote._id}`, {
        status: statusVal,
        adminNotes,
        quotedAmount: quotedAmount ? Number(quotedAmount) : undefined
      });
      setEditingQuote(null);
      loadQuotes();
    } catch (err) {
      alert('Failed to update quote.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this quotation request?')) return;
    try {
      await api.delete(`/quotes/${id}`);
      setQuotes(prev => prev.filter(q => q._id !== id));
    } catch {
      alert('Failed to delete quote.');
    }
  };

  const filtered = quotes.filter(q => {
    return statusFilter === 'all' || q.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <SEO title="Quotation Requests Management" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">
            Material Quotation Requests ({quotes.length})
          </h1>
          <p className="text-xs text-gray-500">
            Review contractor and residential project inquiries, update quotation rates, and manage customer communications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-gray-500">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="all">All ({quotes.length})</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Quoted">Quoted</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Product &amp; Quantity</th>
                <th className="p-3.5">Delivery Area</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Quoted Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">Loading quotes...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">No quotation requests found.</td>
                </tr>
              ) : (
                filtered.map(q => (
                  <tr key={q._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3.5 font-semibold text-gray-900">{q.name}</td>
                    <td className="p-3.5 text-gray-700">
                      <a href={`tel:${q.phone}`} className="hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#F28C28]" />
                        <span>{q.phone}</span>
                      </a>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-gray-900 block">{q.productName}</span>
                      <span className="text-gray-500">{q.quantity} {q.unit} · {q.projectType}</span>
                    </td>
                    <td className="p-3.5 text-gray-600">{q.deliveryLocation}</td>
                    <td className="p-3.5 text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5 font-bold tabular-nums">
                      {q.quotedAmount ? `Rs. ${q.quotedAmount.toLocaleString()}` : <span className="text-gray-400 font-normal">Pending</span>}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.status === 'New'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : q.status === 'Quoted'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : q.status === 'Completed' || q.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEdit(q)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-[#F28C28] hover:text-white rounded font-semibold text-gray-700 transition-colors"
                      >
                        Respond
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Respond Modal */}
      {editingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setEditingQuote(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 z-10 space-y-4 text-xs">
            <h3 className="font-display text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              Respond to Quote: {editingQuote.name}
            </h3>

            <div className="bg-gray-50 p-3 rounded space-y-1">
              <p><span className="font-semibold text-gray-600">Material:</span> {editingQuote.productName}</p>
              <p><span className="font-semibold text-gray-600">Quantity:</span> {editingQuote.quantity} {editingQuote.unit}</p>
              <p><span className="font-semibold text-gray-600">Site Area:</span> {editingQuote.deliveryLocation}</p>
              {editingQuote.message && (
                <p><span className="font-semibold text-gray-600">Customer Note:</span> {editingQuote.message}</p>
              )}
            </div>

            <form onSubmit={handleSaveUpdate} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Quotation Status</label>
                <select
                  value={statusVal}
                  onChange={e => setStatusVal(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Quoted Price Amount (Total PKR)</label>
                <input
                  type="number"
                  value={quotedAmount}
                  onChange={e => setQuotedAmount(e.target.value)}
                  placeholder="e.g. 245000"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Internal Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Log notes about customer call or rates given..."
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingQuote(null)}
                  className="px-4 py-2 border rounded font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold rounded"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
