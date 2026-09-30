import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Scale,
  MessageSquare,
  Truck,
  ShieldCheck,
  CheckCircle,
  FileText,
  Star,
  ChevronRight,
  Share2,
  ArrowRight
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { ProductCard } from '../components/ProductCard';
import { QuoteModal } from '../components/QuoteModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import api from '../services/api';
import { IProduct } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'features' | 'delivery' | 'reviews'>('specs');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Review submission
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await api.get(`/products/slug/${slug}`);
        const p: IProduct = res.data.product;
        setProduct(p);
        setSelectedImage(p.thumbnail || p.images[0] || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80');
        setQuantity(p.minimumOrderQuantity || 1);
        setRelatedProducts(res.data.related || []);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-8">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-500">The construction material you are looking for is currently unavailable or moved.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 bg-[#F28C28] text-white font-bold text-xs rounded-lg">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product._id);
  const isCompared = isInCompare(product._id);

  const handleAddToCart = () => {
    if (product.isQuotationRequired) {
      setQuoteModalOpen(true);
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (product.isQuotationRequired) {
      setQuoteModalOpen(true);
      return;
    }
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleWhatsApp = () => {
    const text = `Hello Al Mushtaq Building Material Store,\n\nI am interested in ordering:\nProduct: ${product.name}\nSKU: ${product.sku}\nQuantity: ${quantity} ${product.unit}\n\nPlease confirm availability and delivery to my site in Rahim Yar Khan.\n\nThank you.`;
    window.open(`https://wa.me/923013242408?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setReviewSuccess(true);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      <SEO
        title={`${product.name} | ${product.brand}`}
        description={`${product.name} - ${product.shortDescription}. Available for delivery in Rahim Yar Khan.`}
      />

      {/* Breadcrumb path */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/shop" className="hover:text-gray-900">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to={`/shop?category=${encodeURIComponent(product.category.toLowerCase())}`} className="hover:text-gray-900">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 bg-[#F9F9F8] rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center p-6">
            {product.discountPercentage && (
              <span className="absolute top-4 left-4 bg-[#D92D20] text-white text-xs font-bold px-2.5 py-1 rounded">
                -{product.discountPercentage}% OFF
              </span>
            )}
            <img
              src={selectedImage}
              alt={product.name}
              className="max-h-96 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-lg border p-1 bg-white shrink-0 overflow-hidden transition-all ${
                    selectedImage === img ? 'border-[#F28C28] ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Contiguous Purchase Module (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-bold uppercase tracking-wider text-gray-800">{product.brand}</span>
              <span className="font-mono text-gray-400">SKU: {product.sku}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Reviews Count */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount || 12} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            {product.isQuotationRequired ? (
              <div className="space-y-1">
                <span className="text-2xl font-black text-[#F28C28]">Price on Request</span>
                <p className="text-xs text-gray-600">
                  Bulk materials such as sand, gravel, and steel rebar fluctuate with wholesale daily rates. Click below for an instant quotation.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900 tabular-nums">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-gray-600">
                    /{product.unit}
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through tabular-nums">
                      Rs. {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Sold strictly by <span className="font-semibold text-gray-800">{product.unit}</span>. Inclusive of local yard handling.
                </p>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">Stock Availability:</span>
              <span className={`font-bold ${
                product.stock > 0 ? 'text-emerald-700' : 'text-red-600'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} ${product.unit} available)` : 'Backordered'}
              </span>
            </div>
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Quantity picker & primary purchase triggers */}
          <div className="space-y-4 pt-2">
            {!product.isQuotationRequired && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Quantity ({product.unit}):
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(product.minimumOrderQuantity || 1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={product.minimumOrderQuantity || 1}
                    max={product.stock}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-14 text-center text-xs font-bold py-2 outline-none tabular-nums"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.isQuotationRequired ? (
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="w-full bg-[#17191C] hover:bg-[#28323A] text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#F4B942]" />
                  <span>Request Bulk Quote</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`w-full font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs ${
                      added
                        ? 'bg-emerald-700 text-white'
                        : product.stock <= 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#F28C28] hover:bg-[#d9771e] text-white'
                    }`}
                  >
                    {added ? <CheckCircle className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                    <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="w-full bg-[#17191C] hover:bg-[#28323A] text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Buy Now</span>
                  </button>
                </>
              )}
            </div>

            {/* WhatsApp direct inquiry */}
            <button
              onClick={handleWhatsApp}
              className="w-full bg-[#28323A] hover:bg-[#17191C] text-white font-bold py-3 px-4 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#F4B942]" />
              <span>Inquire via WhatsApp (+92 301 3242408)</span>
            </button>

            {/* Wishlist & Compare action links */}
            <div className="flex items-center justify-between text-xs pt-2 text-gray-600">
              <button
                onClick={() => toggleWishlist(product)}
                className="hover:text-red-500 flex items-center gap-1.5 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
                <span>{isFavorite ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => addToCompare(product)}
                className="hover:text-[#F28C28] flex items-center gap-1.5 transition-colors"
              >
                <Scale className="w-4 h-4" />
                <span>{isCompared ? 'Remove from Compare' : 'Compare Specifications'}</span>
              </button>
            </div>
          </div>

          {/* Delivery & Assurance bullet cards */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 text-xs">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900">Site Offloading</p>
                <p className="text-gray-500 text-[11px]">Direct dumper or pickup to site in Rahim Yar Khan</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900">Quality Verified</p>
                <p className="text-gray-500 text-[11px]">Tested structural standards &amp; fresh batches</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Tabs */}
      <div className="pt-8 border-t border-gray-200">
        <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'desc', label: 'Description' },
            { id: 'features', label: 'Features & Applications' },
            { id: 'delivery', label: 'Delivery & Offloading' },
            { id: 'reviews', label: `Reviews (${product.reviewCount || 12})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#F28C28] text-[#F28C28]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 text-xs">
                {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-gray-500">{key}</span>
                    <span className="col-span-2 font-medium text-gray-900">{val}</span>
                  </div>
                ))}
                {product.unit && (
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-gray-500">Standard Sales Unit</span>
                    <span className="col-span-2 font-medium text-gray-900">{product.unit}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-gray-500">Weight / Packaging</span>
                    <span className="col-span-2 font-medium text-gray-900">{product.weight}</span>
                  </div>
                )}
                {product.material && (
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-gray-500">Primary Material</span>
                    <span className="col-span-2 font-medium text-gray-900">{product.material}</span>
                  </div>
                )}
                {product.warranty && (
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-gray-500">Warranty Standard</span>
                    <span className="col-span-2 font-medium text-gray-900">{product.warranty}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'desc' && (
            <div className="max-w-3xl text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
              <p>{product.description}</p>
              <p>
                Stored and handled under sheltered dry warehousing at Al Mushtaq Building Material Store depot on Manthar Road, Rahim Yar Khan.
              </p>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="max-w-3xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">Key Features:</h4>
              <ul className="space-y-2 text-xs text-gray-700">
                {product.features && product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="max-w-3xl text-xs text-gray-700 space-y-3">
              <p className="font-bold text-gray-900">Site Delivery Terms (Rahim Yar Khan Area)</p>
              <p>
                Materials can be dispatched by Shahzore, Mazda, Tractor Trolley, or Hydraulic Dumper depending on the order tonnage.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Delivery available to Rahim Yar Khan City, Manthar Road, Sadiqabad, Khanpur, and adjacent industrial zones.</li>
                <li>Ensure access road is suitable for heavy vehicle clearance and site offloading.</li>
                <li>Orders over Rs. 50,000 may qualify for free delivery threshold in central zones.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-8">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold text-sm text-gray-900 mb-3">Leave a Customer Review</h4>
                {reviewSuccess ? (
                  <p className="text-xs text-emerald-700 font-semibold">Thank you for your feedback! Your review has been recorded.</p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Your Rating</label>
                      <select
                        value={reviewRating}
                        onChange={e => setReviewRating(Number(e.target.value))}
                        className="border border-gray-300 rounded px-3 py-1.5 bg-white"
                      >
                        <option value="5">5 Stars - Excellent Quality</option>
                        <option value="4">4 Stars - Very Good</option>
                        <option value="3">3 Stars - Average</option>
                        <option value="2">2 Stars - Below Expectation</option>
                        <option value="1">1 Star - Poor</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={e => setReviewName(e.target.value)}
                          placeholder="e.g. Tariq Mehmood"
                          className="w-full border border-gray-300 rounded px-3 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Review Headline</label>
                        <input
                          type="text"
                          value={reviewTitle}
                          onChange={e => setReviewTitle(e.target.value)}
                          placeholder="e.g. Great concrete workability"
                          className="w-full border border-gray-300 rounded px-3 py-1.5"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Detailed Review *</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Write your honest feedback regarding material quality and packaging..."
                        className="w-full border border-gray-300 rounded px-3 py-1.5"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#17191C] hover:bg-[#28323A] text-white font-bold rounded text-xs"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-gray-900">
              Related Materials in {product.category}
            </h3>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category.toLowerCase())}`}
              className="text-xs font-bold text-[#F28C28] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Quote Modal */}
      <QuoteModal
        product={product}
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
};
