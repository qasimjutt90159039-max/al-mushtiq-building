import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle2, XCircle, Clock, Truck } from 'lucide-react';
import { SEO } from '../../components/SEO';
import api from '../../services/api';
import { IOrder } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus as any } : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus as any });
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || o.orderStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <SEO title="Admin Orders Management" />

      <div>
        <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">
          Customer Orders Management
        </h1>
        <p className="text-xs text-gray-500">
          Track customer orders, update dispatch logistics, and manage delivery statuses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search order #, customer or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-[#F28C28]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-semibold text-gray-500 whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-[#F28C28]"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Order #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Customer &amp; Phone</th>
                <th className="p-3.5">Site Location</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">Loading orders...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">No matching orders found.</td>
                </tr>
              ) : (
                filtered.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-gray-900">{o.orderNumber}</td>
                    <td className="p-3.5 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5">
                      <span className="font-semibold text-gray-900 block">{o.customerName}</span>
                      <span className="text-gray-400">{o.phone}</span>
                    </td>
                    <td className="p-3.5 text-gray-600 truncate max-w-xs">
                      {o.shippingAddress.area}, {o.shippingAddress.city}
                    </td>
                    <td className="p-3.5 font-bold text-gray-900 tabular-nums">
                      Rs. {o.total.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-gray-600">{o.paymentMethod}</td>
                    <td className="p-3.5">
                      <select
                        value={o.orderStatus}
                        onChange={e => handleStatusChange(o._id, e.target.value)}
                        className={`font-bold px-2 py-1 rounded text-[11px] border outline-none ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : o.orderStatus === 'Cancelled'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-base font-bold text-gray-900">{selectedOrder.orderNumber}</span>
                <p className="text-gray-500">Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="font-bold text-gray-400 hover:text-gray-800">✕</button>
            </div>

            <div className="bg-gray-50 p-3 rounded space-y-1">
              <p><span className="font-semibold text-gray-700">Customer:</span> {selectedOrder.customerName} ({selectedOrder.phone})</p>
              <p><span className="font-semibold text-gray-700">Email:</span> {selectedOrder.email || 'N/A'}</p>
              <p><span className="font-semibold text-gray-700">Delivery Address:</span> {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.area}, {selectedOrder.shippingAddress.city}</p>
              {selectedOrder.shippingAddress.deliveryInstructions && (
                <p><span className="font-semibold text-gray-700">Unloading Instructions:</span> {selectedOrder.shippingAddress.deliveryInstructions}</p>
              )}
              {selectedOrder.orderNotes && (
                <p><span className="font-semibold text-gray-700">Customer Notes:</span> {selectedOrder.orderNotes}</p>
              )}
            </div>

            <div className="space-y-2">
              <span className="font-bold text-gray-900 uppercase">Ordered Materials</span>
              <div className="divide-y divide-gray-100">
                {selectedOrder.items.map(it => (
                  <div key={it.productId} className="py-1.5 flex justify-between">
                    <span>{it.name} ({it.quantity} {it.unit})</span>
                    <span className="font-bold tabular-nums">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm">
              <span>Total Payable:</span>
              <span className="text-[#F28C28]">Rs. {selectedOrder.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
