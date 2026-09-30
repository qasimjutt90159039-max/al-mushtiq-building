import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, MessageSquare, Check, ArrowRight } from 'lucide-react';
import { IProduct } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: IProduct;
  onQuickView?: (product: IProduct) => void;
  onQuoteRequest?: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onQuoteRequest
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorite = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.isQuotationRequired) {
      if (onQuoteRequest) onQuoteRequest(product);
      return;
    }

    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phone = '923013242408';
    const text = `Hello Al Mushtaq Building Material Store,\n\nI am interested in:\nProduct: ${product.name}\nSKU: ${product.sku}\nUnit: ${product.unit}\n\nPlease confirm current price, stock and delivery availability.\n\nThank you.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Top Image Canvas */}
      <div className="relative aspect-4/3 bg-[#F9F9F8] overflow-hidden flex items-center justify-center p-4">
        {/* Subtle Discount or Quotation Tag */}
        {product.discountPercentage ? (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#D92D20] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
            -{product.discountPercentage}%
          </div>
        ) : product.isQuotationRequired ? (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#17191C] text-[#F4B942] text-[11px] font-bold px-2 py-0.5 rounded border border-[#28323A]">
            Quote Required
          </div>
        ) : product.isDeal ? (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#F28C28] text-white text-[11px] font-bold px-2 py-0.5 rounded">
            Special Deal
          </div>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 shadow-xs flex items-center justify-center transition-colors ${
            isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
          title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Product Visual */}
        <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.thumbnail || product.images[0] || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Graceful fallback to real construction material photograph
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Quick View Hover Action */}
        {onQuickView && (
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-gray-600" />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Brand / Category Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
            <span className="font-semibold text-gray-700 uppercase tracking-wider">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#F28C28] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Primary CTA */}
        <div className="pt-3 mt-2 border-t border-gray-100">
          <div className="flex items-baseline justify-between mb-3">
            {product.isQuotationRequired ? (
              <div>
                <span className="text-sm font-bold text-[#F28C28]">Price on Request</span>
                <span className="text-xs text-gray-500 block">Unit: {product.unit}</span>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-gray-900 tabular-nums">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 font-normal">
                    /{product.unit}
                  </span>
                </div>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through tabular-nums">
                    Rs. {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {/* In stock indicator */}
            <span className={`text-[11px] font-medium ${
              product.stock > 0 ? 'text-emerald-700' : 'text-red-600'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'On Order'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {product.isQuotationRequired ? (
              <button
                onClick={() => onQuoteRequest ? onQuoteRequest(product) : null}
                className="col-span-1 bg-[#17191C] hover:bg-[#28323A] text-white text-xs font-bold py-2 px-2.5 rounded transition-colors text-center truncate flex items-center justify-center gap-1"
              >
                <span>Get Quote</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`col-span-1 text-xs font-bold py-2 px-2.5 rounded transition-colors text-center truncate flex items-center justify-center gap-1.5 ${
                  addedAnimation
                    ? 'bg-emerald-700 text-white'
                    : product.stock <= 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#F28C28] hover:bg-[#d9771e] text-white shadow-xs'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleWhatsApp}
              className="col-span-1 bg-[#28323A] hover:bg-[#17191C] text-white text-xs font-semibold py-2 px-2 rounded transition-colors flex items-center justify-center gap-1 text-center truncate"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#F4B942]" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
