import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Heart, MessageSquare, Check, ArrowRight } from 'lucide-react';
import { IProduct } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface QuickViewModalProps {
  product: IProduct | null;
  onClose: () => void;
  onQuoteRequest?: (product: IProduct) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onQuoteRequest
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(product.minimumOrderQuantity || 1);
  const [added, setAdded] = useState(false);

  const isFav = isInWishlist(product._id);

  const handleAdd = () => {
    if (product.isQuotationRequired) {
      onClose();
      if (onQuoteRequest) onQuoteRequest(product);
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  const handleWhatsApp = () => {
    const phone = '923013242408';
    const text = `Hello Al Mushtaq Building Material Store,\n\nI am inquiring about:\nProduct: ${product.name}\nSKU: ${product.sku}\nQuantity: ${quantity} ${product.unit}\n\nPlease confirm current wholesale price and delivery availability.\n\nThank you.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-900 bg-white/80 rounded-full z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-[#F9F9F8] p-4 flex items-center justify-center relative">
          <img
            src={product.thumbnail || product.images[0] || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="max-h-72 w-full object-cover rounded-lg shadow-xs"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span className="font-bold uppercase tracking-wider text-gray-700">{product.brand}</span>
              <span>·</span>
              <span>{product.category}</span>
              <span>·</span>
              <span className="font-mono text-gray-400">SKU: {product.sku}</span>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
              {product.name}
            </h2>

            {/* Price & Unit */}
            <div className="mb-4">
              {product.isQuotationRequired ? (
                <div>
                  <span className="text-lg font-bold text-[#F28C28]">Price on Request</span>
                  <p className="text-xs text-gray-500">Contact for daily market rates per {product.unit}</p>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900 tabular-nums">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    /{product.unit}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs. {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Key Specifications preview */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-4 bg-gray-50 p-2.5 rounded border border-gray-100 text-xs space-y-1">
                {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500">{key}:</span>
                    <span className="font-semibold text-gray-800">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            {/* Quantity Stepper (if fixed price) */}
            {!product.isQuotationRequired && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-700">Quantity ({product.unit}):</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(product.minimumOrderQuantity || 1, quantity - 1))}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {product.isQuotationRequired ? (
                <button
                  onClick={() => {
                    onClose();
                    if (onQuoteRequest) onQuoteRequest(product);
                  }}
                  className="bg-[#17191C] hover:bg-[#28323A] text-white text-xs font-bold py-2.5 px-3 rounded text-center"
                >
                  Request a Quote
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className={`text-xs font-bold py-2.5 px-3 rounded flex items-center justify-center gap-1.5 transition-colors ${
                    added ? 'bg-emerald-700 text-white' : 'bg-[#F28C28] hover:bg-[#d9771e] text-white'
                  }`}
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
                </button>
              )}

              <button
                onClick={handleWhatsApp}
                className="bg-[#28323A] hover:bg-[#17191C] text-white text-xs font-semibold py-2.5 px-3 rounded flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-[#F4B942]" />
                <span>WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                onClick={() => toggleWishlist(product)}
                className="text-gray-500 hover:text-red-500 flex items-center gap-1"
              >
                <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-red-500 fill-current' : ''}`} />
                <span>{isFav ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="font-bold text-[#F28C28] hover:underline flex items-center gap-1"
              >
                <span>Full Product Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
