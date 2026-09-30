import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Phone, MessageSquare, Truck, Copy } from 'lucide-react';
import { SEO } from '../components/SEO';
import { IOrder } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const order: IOrder | undefined = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const copyOrderNum = () => {
    navigator.clipboard.writeText(order.orderNumber);
    alert(`Order Number ${order.orderNumber} copied to clipboard!`);
  };

  const handleWhatsApp = () => {
    const text = `Hello Al Mushtaq Building Material Store,\n\nI just placed order: ${order.orderNumber} for Rs. ${order.total.toLocaleString()}.\nCustomer: ${order.customerName}\nPhone: ${order.phone}\nDelivery Address: ${order.shippingAddress.street}, ${order.shippingAddress.area}, Rahim Yar Khan.\n\nPlease confirm processing and dispatch schedule.\n\nThank you.`;
    window.open(`https://wa.me/923013242408?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <SEO title={`Order Confirmed #${order.orderNumber}`} />

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Order Placed Successfully</span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Your building materials order has been recorded in our dispatch system.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-left">
            <span className="text-gray-400 block uppercase font-bold text-[10px]">Your Order Number</span>
            <span className="font-mono text-lg font-black text-gray-900 tracking-wider">{order.orderNumber}</span>
          </div>

          <button
            onClick={copyOrderNum}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 rounded-lg text-gray-700 font-semibold"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Number</span>
          </button>
        </div>

        {/* Order Summary receipt */}
        <div className="border border-gray-100 rounded-xl p-4 text-left divide-y divide-gray-100 text-xs">
          <div className="py-2 flex justify-between">
            <span className="text-gray-500">Delivery Address:</span>
            <span className="font-semibold text-gray-900 text-right">
              {order.shippingAddress.street}, {order.shippingAddress.area}, {order.shippingAddress.city}
            </span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-gray-500">Contact Phone:</span>
            <span className="font-semibold text-gray-900">{order.phone}</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-gray-500">Payment Option:</span>
            <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-gray-500">Items Ordered:</span>
            <span className="font-semibold text-gray-900">{order.items.length} Material Types</span>
          </div>
          <div className="py-2 flex justify-between items-baseline text-sm font-bold pt-3">
            <span>Total Payable Amount:</span>
            <span className="text-lg text-[#F28C28] font-black tabular-nums">
              Rs. {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleWhatsApp}
            className="w-full sm:w-auto px-5 py-3 bg-[#16803C] hover:bg-[#126b32] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Order Summary via WhatsApp</span>
          </button>

          <Link
            to={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&phone=${encodeURIComponent(order.phone)}`}
            className="w-full sm:w-auto px-5 py-3 bg-[#17191C] hover:bg-[#28323A] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-[#F4B942]" />
            <span>Track Order Status</span>
          </Link>
        </div>

        <div>
          <Link to="/" className="text-xs font-semibold text-gray-500 hover:text-gray-900">
            Return to Store Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
