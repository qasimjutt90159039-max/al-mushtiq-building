import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { SEO } from '../../components/SEO';
import api from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n} className="h-28 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const recentQuotes = data?.recentQuotes || [];
  const categoryCounts = data?.categoryCounts || {};

  const cards = [
    { title: 'Total Sales Revenue', value: `Rs. ${(stats.totalSales || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Store Orders', value: stats.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Active Catalog Products', value: stats.totalProducts || 0, icon: Package, color: 'text-[#F28C28]', bg: 'bg-orange-50' },
    { title: 'Customer Accounts', value: stats.totalCustomers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Pending Orders', value: stats.pendingOrders || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'New Quote Requests', value: stats.quoteRequests || 0, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Low Stock Alerts', value: stats.lowStock || 0, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Out of Stock Products', value: stats.outOfStock || 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }
  ];

  return (
    <div className="space-y-8">
      <SEO title="Admin Dashboard" />

      <div>
        <h1 className="font-display text-2xl font-black text-gray-900 tracking-tight">
          Store Operations Dashboard
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Real-time metrics for inventory, orders, customer quotations, and logistics in Rahim Yar Khan.
        </p>
      </div>

      {/* 8 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{card.title}</p>
                <p className="text-xl font-black text-gray-900 mt-1 tabular-nums">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Inventory Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-sm text-gray-900 mb-4">Inventory Distribution by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <div key={cat} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <span className="font-bold text-gray-900 text-sm block">{count as number}</span>
              <span className="text-[11px] text-gray-500 truncate block mt-0.5">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tables: Recent Orders & Recent Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-[#F28C28] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No orders placed yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 text-xs">
              {recentOrders.map((o: any) => (
                <div key={o._id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-gray-900">{o.orderNumber}</span>
                    <span className="text-gray-500 block">{o.customerName} · {o.phone}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 block tabular-nums">Rs. {o.total.toLocaleString()}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">Recent Quotation Requests</h3>
            <Link to="/admin/quotes" className="text-xs font-bold text-[#F28C28] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentQuotes.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No quote requests pending.</p>
          ) : (
            <div className="divide-y divide-gray-100 text-xs">
              {recentQuotes.map((q: any) => (
                <div key={q._id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">{q.productName || 'Materials'}</span>
                    <span className="text-gray-500 block">
                      {q.name} ({q.quantity} {q.unit}) · {q.deliveryLocation}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                      {q.status}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-1">{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
