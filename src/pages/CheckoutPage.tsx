import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, deliveryFee, discount, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    area: user?.address?.area || 'Manzoorabad',
    city: user?.address?.city || 'Rahim Yar Khan',
    postalCode: user?.address?.postalCode || '64200',
    deliveryInstructions: '',
    orderNotes: '',
    paymentMethod: 'Cash on Delivery' as 'Cash on Delivery' | 'Bank Transfer' | 'WhatsApp / Phone Confirmation'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <Link to="/shop" className="text-sm font-bold text-[#F28C28] hover:underline">
          Return to shop
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.phone || !formData.street) {
      setError('Please provide your full name, phone number, and delivery street address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        shippingAddress: {
          street: formData.street,
          area: formData.area,
          city: formData.city,
          postalCode: formData.postalCode,
          deliveryInstructions: formData.deliveryInstructions
        },
        orderNotes: formData.orderNotes,
        paymentMethod: formData.paymentMethod,
        userId: user?._id,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          sku: item.sku,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image
        }))
      };

      const res = await api.post('/orders', orderPayload);
      const createdOrder = res.data.order;
      clearCart();
      navigate('/order-success', { state: { order: createdOrder } });
    } catch (err: any) {
      setError(err.message || 'Your order could not be submitted. Please verify stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO title="Secure Checkout" description="Complete your building materials order with site delivery in Rahim Yar Khan." />

      <div className="mb-6">
        <Link to="/cart" className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Cart</span>
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Delivery &amp; Checkout
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Delivery Address & Details (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 space-y-6">
          <div>
            <h2 className="font-display text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              1. Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Muhammad Asif"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0301 1234567"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="For order receipts and invoices"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              2. Site Delivery Address (Rahim Yar Khan Area)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Street Address / Plot / Site Name *</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={e => setFormData({ ...formData, street: e.target.value })}
                  placeholder="e.g. Plot # 45, Street 4, Manthar Road"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Area / Colony *</label>
                <input
                  type="text"
                  required
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. Manzoorabad, Gulshan-e-Usman"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F28C28] bg-gray-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Unloading / Site Access Instructions</label>
                <input
                  type="text"
                  value={formData.deliveryInstructions}
                  onChange={e => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                  placeholder="e.g. Wide gate for Shahzore mini-truck; dump sand near east corner..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Order Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.orderNotes}
                  onChange={e => setFormData({ ...formData, orderNotes: e.target.value })}
                  placeholder="Any contractor purchase order reference number or specific requirements..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#F28C28]"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
              3. Payment Method
            </h2>
            <div className="space-y-3 mt-4 text-xs">
              <label className={`block p-3.5 rounded-lg border cursor-pointer transition-colors ${
                formData.paymentMethod === 'Cash on Delivery'
                  ? 'border-[#F28C28] bg-orange-50/40'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={formData.paymentMethod === 'Cash on Delivery'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                    className="text-[#F28C28] focus:ring-[#F28C28]"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block">Cash on Delivery (COD)</span>
                    <span className="text-gray-500">Pay cash directly to the driver upon material arrival and verification.</span>
                  </div>
                </div>
              </label>

              <label className={`block p-3.5 rounded-lg border cursor-pointer transition-colors ${
                formData.paymentMethod === 'Bank Transfer'
                  ? 'border-[#F28C28] bg-orange-50/40'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={formData.paymentMethod === 'Bank Transfer'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'Bank Transfer' })}
                    className="text-[#F28C28] focus:ring-[#F28C28]"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block">Bank Transfer (Meezan / HBL / UBL)</span>
                    <span className="text-gray-500">Store account details will be shared on confirmation; wire receipt required.</span>
                  </div>
                </div>
              </label>

              <label className={`block p-3.5 rounded-lg border cursor-pointer transition-colors ${
                formData.paymentMethod === 'WhatsApp / Phone Confirmation'
                  ? 'border-[#F28C28] bg-orange-50/40'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="WhatsApp / Phone Confirmation"
                    checked={formData.paymentMethod === 'WhatsApp / Phone Confirmation'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'WhatsApp / Phone Confirmation' })}
                    className="text-[#F28C28] focus:ring-[#F28C28]"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block">WhatsApp / Phone Confirmation</span>
                    <span className="text-gray-500">Our representative will call you before vehicle dispatch to finalize payment terms.</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-200 space-y-6 sticky top-28">
          <h2 className="font-display text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Order Review ({cart.length} Items)
          </h2>

          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 text-xs">
            {cart.map(item => (
              <div key={item.productId} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-gray-500">{item.quantity} {item.unit} × Rs. {item.price.toLocaleString()}</p>
                </div>
                <span className="font-bold text-gray-900 tabular-nums shrink-0">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-3 border-t border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-bold text-gray-900 tabular-nums">Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount Applied:</span>
                <span className="font-bold tabular-nums">-Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Site Delivery Fee:</span>
              <span className="font-bold text-gray-900 tabular-nums">
                {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 text-sm font-bold text-gray-900">
              <span>Final Total:</span>
              <span className="text-xl font-black text-[#F28C28] tabular-nums">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
          </button>

          <p className="text-[11px] text-gray-400 text-center leading-normal">
            By placing your order you confirm agreement to inspect materials on site before driver departure.
          </p>
        </div>
      </form>
    </div>
  );
};
