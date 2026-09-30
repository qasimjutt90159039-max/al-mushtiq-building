import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Layers,
  ArrowRight,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { IProduct } from '../types';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        setSearchResults(res.data.products || []);
        setSearchDropdownOpen(true);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchDropdownOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Brands', path: '/brands' },
    { name: 'Deals', path: '/deals' },
    { name: 'Request Quote', path: '/request-quote' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#17191C] text-gray-300 text-xs py-2 px-4 border-b border-[#28323A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F28C28]"></span>
            <span className="font-medium text-white">Quality Building Materials</span>
            <span className="text-gray-500">|</span>
            <span>Rahim Yar Khan, Pakistan</span>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <a
              href="tel:+923013242408"
              className="flex items-center gap-1.5 text-gray-300 hover:text-[#F28C28] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F28C28]" />
              <span className="font-semibold text-white">+92 301 3242408</span>
            </a>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <a
              href="https://wa.me/923013242408"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-[#F4B942] hover:underline font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#F28C28] rounded-md"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Logo />
        </div>

        {/* Center Search Bar */}
        <div ref={searchRef} className="hidden md:block flex-1 max-w-xl relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setSearchDropdownOpen(true)}
              placeholder="Search cement, tiles, pipes, paint, hardware, tools..."
              className="w-full bg-[#F6F7F8] border border-gray-300 focus:border-[#F28C28] focus:bg-white text-sm text-[#17191C] rounded-lg pl-4 pr-12 py-2.5 outline-none transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-[#F28C28]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#17191C] hover:bg-[#F28C28] text-white rounded-md transition-colors flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Instant Search Dropdown Preview */}
          {searchDropdownOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100">
              <div className="p-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 flex justify-between items-center">
                <span>Matching Products</span>
                {isSearching && <span className="text-[11px] text-[#F28C28]">Searching...</span>}
              </div>
              {searchResults.map(p => (
                <Link
                  key={p._id}
                  to={`/product/${p.slug}`}
                  onClick={() => setSearchDropdownOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={p.thumbnail || p.images[0] || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'}
                    alt={p.name}
                    className="w-10 h-10 object-contain rounded bg-gray-100 p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase">{p.brand} · {p.category}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {p.isQuotationRequired ? (
                      <span className="text-xs font-bold text-[#F28C28]">Quote</span>
                    ) : (
                      <span className="text-sm font-bold text-gray-900">Rs. {p.price.toLocaleString()} <span className="text-[11px] font-normal text-gray-500">/{p.unit}</span></span>
                    )}
                  </div>
                </Link>
              ))}
              <Link
                to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => setSearchDropdownOpen(false)}
                className="block p-2.5 text-center text-xs font-bold text-[#F28C28] hover:bg-orange-50 transition-colors"
              >
                View all results for "{searchQuery}" →
              </Link>
            </div>
          )}
        </div>

        {/* Right Actions: Account, Wishlist, Cart */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* User Account */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 text-gray-700 hover:text-[#F28C28] rounded-md transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#17191C] text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold hidden lg:inline max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden lg:inline" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-[#F28C28]"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#F28C28]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>My Account</span>
                    </Link>
                    <Link
                      to="/account/orders"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <ShoppingCart className="w-4 h-4 text-gray-500" />
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 p-2 text-gray-700 hover:text-[#F28C28] text-xs font-semibold"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 text-gray-700 hover:text-[#F28C28] transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {totalWishlist > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#F28C28] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalWishlist}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center gap-2 bg-[#17191C] hover:bg-[#28323A] text-white px-3.5 py-2 rounded-lg transition-colors shadow-xs"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-[#F28C28]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-[#F28C28] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* 3. DESKTOP NAVIGATION BAR */}
      <nav className="hidden lg:block bg-[#28323A] text-gray-200 border-t border-[#374151]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link
              to="/categories"
              className="flex items-center gap-2 bg-[#F28C28] hover:bg-[#d9771e] text-white px-4 py-2.5 text-xs font-bold tracking-wide transition-colors uppercase"
            >
              <Layers className="w-4 h-4" />
              <span>All Categories</span>
            </Link>

            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
                    active
                      ? 'text-[#F4B942] bg-[#17191C]'
                      : 'text-gray-300 hover:text-white hover:bg-[#1f282f]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <Link
            to="/bulk-order"
            className="text-xs font-bold text-[#F4B942] hover:text-white flex items-center gap-1.5 py-2 transition-colors"
          >
            <span>Contractor Bulk Procurement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed top-0 bottom-0 left-0 w-5/6 max-w-sm bg-white shadow-2xl z-50 flex flex-col overflow-y-auto">
            <div className="p-4 bg-[#17191C] text-white flex items-center justify-between border-b border-[#28323A]">
              <Logo variant="light" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search materials..."
                  className="w-full bg-white border border-gray-300 text-sm rounded-lg pl-3 pr-10 py-2 outline-none focus:border-[#F28C28]"
                />
                <button type="submit" className="absolute right-2 text-gray-500">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <div className="p-4 flex-1 divide-y divide-gray-100">
              <div className="py-2 space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-orange-50 hover:text-[#F28C28] rounded-md transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="py-3 space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Contractor &amp; Bulk</p>
                <Link
                  to="/bulk-order"
                  className="block px-3 py-2 text-sm font-semibold text-[#F28C28] hover:bg-orange-50 rounded-md"
                >
                  Contractor Bulk Order
                </Link>
                <Link
                  to="/request-quote"
                  className="block px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-orange-50 rounded-md"
                >
                  Request a Custom Quote
                </Link>
              </div>

              {isAdmin && (
                <div className="py-3">
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-white bg-[#17191C] rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#F28C28]" />
                    <span>Admin Dashboard</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Contact Quick Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 space-y-2">
              <p className="font-semibold text-gray-900">Al Mushtaq Building Material Store</p>
              <p>Manthar Road, Rahim Yar Khan</p>
              <a
                href="tel:+923013242408"
                className="flex items-center gap-1.5 font-bold text-[#F28C28] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+92 301 3242408</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
