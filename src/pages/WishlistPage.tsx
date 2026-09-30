import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <SEO title="My Wishlist" />
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Save materials you need for your ongoing or upcoming construction projects here to review prices and specifications.
        </p>
        <Link
          to="/shop"
          className="inline-block px-5 py-2.5 bg-[#F28C28] text-white font-bold text-xs rounded-lg"
        >
          Explore Materials
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SEO title="Saved Materials (Wishlist)" description="Review your saved construction materials and easily move them to cart." />

      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Saved Materials ({wishlist.length})
          </h1>
          <p className="text-xs text-gray-500">Materials saved for future project procurement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map(product => (
          <div key={product._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col p-4 space-y-3">
            <div className="aspect-4/3 bg-[#F9F9F8] rounded-lg p-3 flex items-center justify-center relative">
              <img
                src={product.thumbnail || product.images[0] || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 text-gray-400 hover:text-red-500 rounded-full shadow-xs"
                title="Remove from wishlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400">{product.brand} · {product.category}</span>
                <Link to={`/product/${product.slug}`}>
                  <h3 className="text-xs font-bold text-gray-900 hover:text-[#F28C28] line-clamp-2 mt-0.5">
                    {product.name}
                  </h3>
                </Link>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  {product.isQuotationRequired ? (
                    <span className="text-xs font-bold text-[#F28C28]">Quote Required</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-900 tabular-nums">
                      Rs. {product.price.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">/{product.unit}</span>
                    </span>
                  )}
                </div>

                {!product.isQuotationRequired && (
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      removeFromWishlist(product._id);
                    }}
                    className="p-2 bg-[#F28C28] hover:bg-[#d9771e] text-white rounded-lg"
                    title="Move to cart"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
