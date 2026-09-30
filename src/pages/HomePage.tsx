import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  FileText,
  PhoneCall,
  Layers,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Wrench,
  Grid,
  Paintbrush
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { QuoteModal } from '../components/QuoteModal';
import api from '../services/api';
import { IProduct, ICategory } from '../types';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [cementProducts, setCementProducts] = useState<IProduct[]>([]);
  const [plumbingProducts, setPlumbingProducts] = useState<IProduct[]>([]);
  const [tileProducts, setTileProducts] = useState<IProduct[]>([]);
  const [paintProducts, setPaintProducts] = useState<IProduct[]>([]);
  const [hardwareProducts, setHardwareProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<IProduct | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [featRes, cemRes, plmRes, tilRes, pntRes, hrdRes, catRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?category=cement&limit=4'),
          api.get('/products?category=plumbing&limit=4'),
          api.get('/products?category=tiles&limit=4'),
          api.get('/products?category=paints&limit=4'),
          api.get('/products?category=hardware&limit=4'),
          api.get('/categories')
        ]);

        setFeaturedProducts(featRes.data.products || []);
        setCementProducts(cemRes.data.products || []);
        setPlumbingProducts(plmRes.data.products || []);
        setTileProducts(tilRes.data.products || []);
        setPaintProducts(pntRes.data.products || []);
        setHardwareProducts(hrdRes.data.products || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openQuoteForProduct = (p: IProduct) => {
    setQuoteProduct(p);
    setIsQuoteOpen(true);
  };

  return (
    <div className="space-y-16 pb-16">
      <SEO
        title="Quality Building Materials in Rahim Yar Khan"
        description="Premium Portland cement, Grade 60 steel rebars, bricks, sand, tiles, paint, plumbing & hardware supplies in Rahim Yar Khan. Bulk quotes available."
      />

      {/* 1. HERO SECTION */}
      <section className="relative bg-[#17191C] text-white overflow-hidden border-b border-[#28323A]">
        {/* Subtle Background Blueprint Grid */}
        <div className="absolute inset-0 bg-blueprint opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#28323A] border border-[#374151] text-xs font-semibold text-[#F4B942]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F28C28]"></span>
                <span>Serving builders, contractors and homeowners in Rahim Yar Khan</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-balance">
                Build Strong. <br />
                <span className="text-[#F28C28]">Build Better.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed text-pretty">
                Quality building materials, hardware and construction supplies for your next project. From foundations to finishing touches.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-6 py-3.5 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
                >
                  <span>Shop Materials</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/request-quote"
                  className="px-6 py-3.5 bg-[#28323A] hover:bg-[#323e48] border border-[#4B5563] text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-2 shrink-0"
                >
                  <span>Request a Quote</span>
                </Link>

                <a
                  href="https://wa.me/923013242408"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#F4B942] hover:underline flex items-center gap-1.5 pl-2"
                >
                  <span>Direct WhatsApp: +92 301 3242408</span>
                </a>
              </div>

              {/* Trust Attributes */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#28323A] text-xs text-gray-400">
                <div>
                  <p className="font-bold text-white text-sm">100+ Products</p>
                  <p>In-Stock Materials</p>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Site Delivery</p>
                  <p>Rahim Yar Khan &amp; Area</p>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Contractor Rates</p>
                  <p>Daily Project Quotes</p>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#28323A] shadow-2xl bg-[#0F1113]">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
                  alt="Al Mushtaq Construction Materials Depot Rahim Yar Khan"
                  className="w-full h-auto aspect-16/9 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs font-bold tracking-widest text-[#F28C28] uppercase">Civil Building Depot</p>
                    <p className="font-display font-bold text-lg">Al Mushtaq Building Material Store</p>
                    <p className="text-xs text-gray-300">Basti Manzoorabad Pull, Manthar Road</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES HORIZONTAL STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Explore raw materials, plumbing, finishes and hardware</p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-[#F28C28] hover:underline flex items-center gap-1"
          >
            <span>View All 20 Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {categories.slice(0, 12).map(cat => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="bg-white p-3.5 rounded-xl border border-gray-200 hover:border-[#F28C28] hover:shadow-md transition-all text-center group flex flex-col items-center justify-center space-y-2.5 overflow-hidden"
            >
              <div className="w-14 h-14 rounded-lg bg-[#F6F7F8] group-hover:ring-2 group-hover:ring-[#F28C28]/40 overflow-hidden flex items-center justify-center transition-all">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#17191C] group-hover:text-[#F28C28]">
                    <Layers className="w-6 h-6" />
                  </div>
                )}
              </div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#F28C28] transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-gray-400">
                {cat.productCount ? `${cat.productCount} items` : 'Browse'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">Curated Selection</span>
            <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight">
              Featured Materials &amp; Supplies
            </h2>
          </div>
          <Link
            to="/shop?featured=true"
            className="text-xs font-bold text-gray-700 hover:text-[#F28C28] flex items-center gap-1"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="h-72 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={p => setQuickViewProduct(p)}
                onQuoteRequest={openQuoteForProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. CEMENT & STRUCTURAL CONSTRUCTION SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#17191C] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden mb-6">
          <div className="max-w-xl space-y-2 relative z-10">
            <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider">Foundation &amp; Masonry</span>
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
              Cement &amp; Structural Materials
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Grade 53 Portland cement (DG Khan, Bestway, Maple Leaf, Lucky), first-class clay bricks, and ASTM Grade 60 steel rebars.
            </p>
          </div>
          <Link
            to="/shop?category=cement"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C28] hover:underline"
          >
            <span>View All Cement &amp; Structural Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {cementProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={p => setQuickViewProduct(p)}
              onQuoteRequest={openQuoteForProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. PLUMBING & PIPES SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">Water Supply &amp; Drainage</span>
            <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight">
              Plumbing, PVC &amp; PPR Piping
            </h2>
          </div>
          <Link to="/shop?category=plumbing" className="text-xs font-bold text-[#F28C28] hover:underline flex items-center gap-1">
            <span>Explore Plumbing</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {plumbingProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={p => setQuickViewProduct(p)}
              onQuoteRequest={openQuoteForProduct}
            />
          ))}
        </div>
      </section>

      {/* 6. TILES & FLOORING SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">Interior &amp; Exterior Finishes</span>
            <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight">
              Tiles &amp; Flooring Collections
            </h2>
          </div>
          <Link to="/shop?category=tiles" className="text-xs font-bold text-[#F28C28] hover:underline flex items-center gap-1">
            <span>Explore Tiles</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {tileProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={p => setQuickViewProduct(p)}
              onQuoteRequest={openQuoteForProduct}
            />
          ))}
        </div>
      </section>

      {/* 7. PAINTS & FINISHING SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">Wall Protection</span>
            <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight">
              Paints &amp; Protective Coatings
            </h2>
          </div>
          <Link to="/shop?category=paints" className="text-xs font-bold text-[#F28C28] hover:underline flex items-center gap-1">
            <span>Explore Paints</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {paintProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={p => setQuickViewProduct(p)}
              onQuoteRequest={openQuoteForProduct}
            />
          ))}
        </div>
      </section>

      {/* 8. HARDWARE & TOOLS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">Hand &amp; Power Tools</span>
            <h2 className="font-display text-2xl font-bold text-gray-900 tracking-tight">
              Hardware, Fasteners &amp; Tools
            </h2>
          </div>
          <Link to="/shop?category=hardware" className="text-xs font-bold text-[#F28C28] hover:underline flex items-center gap-1">
            <span>Explore Hardware</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {hardwareProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={p => setQuickViewProduct(p)}
              onQuoteRequest={openQuoteForProduct}
            />
          ))}
        </div>
      </section>

      {/* 9. PROFESSIONAL CTA SECTION: "Planning a Construction Project?" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#28323A] rounded-2xl p-8 sm:p-12 text-white border border-[#374151] shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F4B942]">
              Contractors · Builders · Homeowners
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Planning a Construction Project?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Send us your required materials and quantities and contact our team for availability and quotation. We provide custom volume pricing on cement bags, rebar steel, crushed aggregate, and sanitary fixtures.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/request-quote"
                className="px-6 py-3.5 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Request a Quote</span>
              </Link>

              <a
                href="https://wa.me/923013242408?text=Hello%20Al%20Mushtaq%2C%20I%20am%20planning%20a%20construction%20project%20in%20Rahim%20Yar%20Khan%20and%20need%20a%20quote."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#17191C] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 border border-gray-700"
              >
                <span>WhatsApp Us</span>
              </a>

              <Link
                to="/bulk-order"
                className="text-xs font-bold text-[#F4B942] hover:underline"
              >
                Bulk Contractor Form →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. WHY CHOOSE US (Section 58) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Why Choose Al Mushtaq
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Reliable building material supplier serving clients in and around Rahim Yar Khan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#F28C28] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-bold text-sm text-gray-900">Wide Product Selection</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Explore materials and supplies for different construction requirements from foundation cement to electrical gear.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#F28C28] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-bold text-sm text-gray-900">Easy Ordering</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Browse products and send your order or inquiry online with straightforward checkout and order tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#F28C28] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-bold text-sm text-gray-900">Bulk Requests</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Submit larger project requirements for quotation with customized unit specifications (Bag, Ton, Box, Cft).
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#F28C28] flex items-center justify-center font-bold">
              04
            </div>
            <h3 className="font-bold text-sm text-gray-900">Direct Support</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Contact the store directly for price and availability confirmation via phone or WhatsApp at +92 301 3242408.
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onQuoteRequest={openQuoteForProduct}
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
