import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    couponCode,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = await applyCoupon(inputCoupon);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setInputCoupon('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <SEO title="Your Cart is Empty" />
        <div className="w-16 h-16 rounded-full bg-orange-50 text-[#F28C28] flex items-center justify-center mx-auto">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          You haven't added any construction supplies to your cart yet. Explore our cement, steel, bricks, tiles, and hardware catalog.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs"
        >
          Explore Materials Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO title="Shopping Cart" description="Review selected building materials, calculate subtotal and proceed to checkout." />

      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Order Shopping Bag
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {cart.length} unique material item{cart.length > 1 ? 's' : ''} in your order
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:underline"
        >
          Clear Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items Table / List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          {cart.map(item => (
            <div key={item.productId} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'}
                  alt={item.name}
                  className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-1.5 shrink-0 border border-gray-100"
                />
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {item.brand} · SKU: {item.sku}
                  </span>
                  <Link to={`/product/${item.slug}`}>
                    <h3 className="text-sm font-semibold text-gray-900 hover:text-[#F28C28] transition-colors truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Rs. {item.price.toLocaleString()} /{item.unit}
                  </p>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0">
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right min-w-[90px]">
                  <p className="text-sm font-bold text-gray-900 tabular-nums">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-gray-400">{item.quantity} {item.unit}</span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 space-y-6">
          <h2 className="font-display text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Order Summary
          </h2>

          {/* Coupon Code Form */}
          <div>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon (e.g. BUILD10)"
                value={inputCoupon}
                onChange={e => setInputCoupon(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#F28C28]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#17191C] hover:bg-[#28323A] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Apply
              </button>
            </form>
            {couponMsg && (
              <p className={`text-[11px] mt-1.5 font-medium ${couponMsg.error ? 'text-red-600' : 'text-emerald-700'}`}>
                {couponMsg.text}
              </p>
            )}
            {couponCode && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded mt-2 border border-emerald-200">
                <span className="font-semibold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Code: {couponCode}
                </span>
                <button onClick={removeCoupon} className="text-red-600 font-bold hover:underline text-[11px]">
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Materials Subtotal:</span>
              <span className="font-bold text-gray-900 tabular-nums">Rs. {subtotal.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon Discount:</span>
                <span className="font-bold tabular-nums">-Rs. {discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Site Delivery Estimate:</span>
              <span className="font-bold text-gray-900 tabular-nums">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700">FREE (Bulk Threshold)</span>
                ) : (
                  `Rs. ${deliveryFee.toLocaleString()}`
                )}
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              * Free local delivery on orders exceeding Rs. 50,000 in Rahim Yar Khan.
            </p>

            <div className="flex justify-between items-baseline pt-3 border-t border-gray-200 text-sm font-bold text-gray-900">
              <span>Total Payable:</span>
              <span className="text-xl font-black text-[#F28C28] tabular-nums">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Checkout Proceed Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/shop"
            className="block text-center text-xs font-semibold text-gray-500 hover:text-gray-900"
          >
            ← Continue Shopping Materials
          </Link>
        </div>
      </div>
    </div>
  );
};
