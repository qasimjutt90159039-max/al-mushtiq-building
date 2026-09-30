import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, RefreshCw, Search } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { QuoteModal } from '../components/QuoteModal';
import api from '../services/api';
import { IProduct, ICategory, IBrand } from '../types';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL params
  const categoryParam = searchParams.get('category') || 'all';
  const brandParam = searchParams.get('brand') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const unitParam = searchParams.get('unit') || 'all';
  const featuredParam = searchParams.get('featured') || '';
  const dealParam = searchParams.get('deal') || '';
  const isNewParam = searchParams.get('isNew') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Price range state
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Mobile drawer filter
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<IProduct | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  // Load categories and brands
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.categories || []));
    api.get('/brands').then(res => setBrands(res.data.brands || []));
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const query = new URLSearchParams(searchParams);
        query.set('limit', '16');
        const res = await api.get(`/products?${query.toString()}`);
        setProducts(res.data.products || []);
        setTotalProducts(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('minPrice', minPrice);
    else next.delete('minPrice');

    if (maxPrice) next.set('maxPrice', maxPrice);
    else next.delete('maxPrice');

    next.set('page', '1');
    setSearchParams(next);
  };

  const resetAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchParams(new URLSearchParams());
  };

  const availableUnits = ['Bag', 'Ton', 'Box', '1000 Pcs', '100 Cu.Ft', 'Gallon', 'Drum (16L)', 'Length', 'Coil (90m)', 'Piece', 'Set', 'Packet', 'Pair', 'Roll'];

  const FilterSidebar = () => (
    <div className="space-y-6 text-xs text-gray-700">
      {/* Active filters clear */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <span className="font-bold uppercase tracking-wider text-gray-900 text-sm">Filters</span>
        <button
          onClick={resetAllFilters}
          className="text-[#F28C28] hover:underline flex items-center gap-1 font-semibold"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2.5">Category</h4>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-2">
          <button
            onClick={() => updateFilter('category', 'all')}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
              categoryParam === 'all' ? 'bg-[#17191C] text-white font-bold' : 'hover:bg-gray-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map(c => (
            <button
              key={c._id}
              onClick={() => updateFilter('category', c.slug)}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                categoryParam.toLowerCase() === c.slug.toLowerCase()
                  ? 'bg-[#17191C] text-white font-bold'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="truncate">{c.name}</span>
              {c.productCount !== undefined && (
                <span className="text-[11px] opacity-70 ml-2">{c.productCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2.5">Brand</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
          <button
            onClick={() => updateFilter('brand', 'all')}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
              brandParam === 'all' ? 'bg-[#17191C] text-white font-bold' : 'hover:bg-gray-100'
            }`}
          >
            <span>All Brands</span>
          </button>
          {brands.map(b => (
            <button
              key={b._id}
              onClick={() => updateFilter('brand', b.slug)}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                brandParam.toLowerCase() === b.slug.toLowerCase()
                  ? 'bg-[#17191C] text-white font-bold'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="truncate">{b.name}</span>
              {b.productCount !== undefined && (
                <span className="text-[11px] opacity-70 ml-2">{b.productCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2.5">Price Range (PKR)</h4>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#F28C28]"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#F28C28]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#28323A] hover:bg-[#17191C] text-white font-bold py-1.5 rounded text-xs transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Unit of Measure Filter */}
      <div>
        <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2.5">Sold By Unit</h4>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => updateFilter('unit', 'all')}
            className={`px-2.5 py-1 rounded text-xs font-medium border ${
              unitParam === 'all'
                ? 'bg-[#17191C] text-white border-[#17191C]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            All
          </button>
          {availableUnits.map(u => (
            <button
              key={u}
              onClick={() => updateFilter('unit', u)}
              className={`px-2.5 py-1 rounded text-xs font-medium border ${
                unitParam.toLowerCase() === u.toLowerCase()
                  ? 'bg-[#F28C28] text-white border-[#F28C28]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Badges Filter */}
      <div className="pt-2 border-t border-gray-200 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featuredParam === 'true'}
            onChange={e => updateFilter('featured', e.target.checked ? 'true' : '')}
            className="rounded text-[#F28C28] focus:ring-[#F28C28]"
          />
          <span className="font-medium text-gray-700">Featured Materials Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={dealParam === 'true'}
            onChange={e => updateFilter('deal', e.target.checked ? 'true' : '')}
            className="rounded text-[#F28C28] focus:ring-[#F28C28]"
          />
          <span className="font-medium text-gray-700">Discounted Deals Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="Shop Building Materials & Construction Hardware"
        description="Browse all construction supplies in Rahim Yar Khan. Filter by category, brand, price and unit."
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="font-display text-3xl font-black text-gray-900 tracking-tight">
            Materials &amp; Supplies Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing <span className="font-bold text-gray-900">{totalProducts}</span> products available for site delivery in Rahim Yar Khan
          </p>
        </div>

        {/* Right Sort Controls + Mobile Filter trigger */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:border-gray-400"
          >
            <Filter className="w-4 h-4 text-[#F28C28]" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600 hidden sm:inline">Sort:</span>
            <select
              value={sortParam}
              onChange={e => updateFilter('sort', e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-medium text-gray-800 outline-none focus:border-[#F28C28]"
            >
              <option value="featured">Featured Materials</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block lg:col-span-1 bg-white p-5 rounded-xl border border-gray-200 h-fit sticky top-28">
          <FilterSidebar />
        </div>

        {/* Right Products Content */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="h-80 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-[#F28C28] flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900">No Products Found</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                No materials matched your filter combination. Try clearing some filters or searching with general terms like "cement", "pipe", or "paint".
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-[#17191C] hover:bg-[#28323A] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={p => setQuickViewProduct(p)}
                    onQuoteRequest={p => {
                      setQuoteProduct(p);
                      setIsQuoteOpen(true);
                    }}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-200">
                  <button
                    disabled={pageParam <= 1}
                    onClick={() => updateFilter('page', String(pageParam - 1))}
                    className="px-3 py-1.5 text-xs font-bold rounded border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      onClick={() => updateFilter('page', String(num))}
                      className={`w-8 h-8 text-xs font-bold rounded transition-colors ${
                        pageParam === num
                          ? 'bg-[#17191C] text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    disabled={pageParam >= totalPages}
                    onClick={() => updateFilter('page', String(pageParam + 1))}
                    className="px-3 py-1.5 text-xs font-bold rounded border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed top-0 bottom-0 left-0 w-5/6 max-w-xs bg-white p-5 overflow-y-auto shadow-2xl z-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-900">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <FilterSidebar />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full bg-[#F28C28] text-white font-bold py-2.5 rounded text-xs"
            >
              Show {totalProducts} Results
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onQuoteRequest={p => {
          setQuoteProduct(p);
          setIsQuoteOpen(true);
        }}
      />

      <QuoteModal
        product={quoteProduct}
        isOpen={isQuoteOpen}
        onClose={() => {
          setIsQuoteOpen(false);
          setQuoteProduct(null);
        }}
      />
    </div>
  );
};
