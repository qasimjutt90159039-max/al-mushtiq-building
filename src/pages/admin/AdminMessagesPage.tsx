import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Check } from 'lucide-react';
import { SEO } from '../../components/SEO';
import api from '../../services/api';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkReplied = async (id: string) => {
    try {
      await api.put(`/contact/${id}`, { status: 'Replied' });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'Replied' } : m));
    } catch {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Admin Customer Messages" />

      <div>
        <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">
          Customer Inquiries &amp; Messages ({messages.length})
        </h1>
        <p className="text-xs text-gray-500">
          Messages received through store contact forms and customer support inquiries.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-gray-100 text-xs">
          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading inquiries...</p>
          ) : messages.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No contact messages received yet.</p>
          ) : (
            messages.map(m => (
              <div key={m._id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{m.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.status === 'New' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {m.status}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="font-semibold text-gray-800">{m.subject}</p>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-100">
                    {m.message}
                  </p>

                  <div className="flex items-center gap-4 text-gray-500 pt-1">
                    <a href={`tel:${m.phone}`} className="flex items-center gap-1 hover:text-[#F28C28]">
                      <Phone className="w-3.5 h-3.5 text-[#F28C28]" />
                      <span>{m.phone}</span>
                    </a>
                    {m.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{m.email}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {m.status !== 'Replied' && (
                    <button
                      onClick={() => handleMarkReplied(m._id)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Replied</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
