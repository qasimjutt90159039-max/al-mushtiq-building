import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

// Store Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { BrandsPage } from './pages/BrandsPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { ComparePage } from './pages/ComparePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { RequestQuotePage } from './pages/RequestQuotePage';
import { BulkOrderPage } from './pages/BulkOrderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminQuotesPage } from './pages/admin/AdminQuotesPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBrandsPage } from './pages/admin/AdminBrandsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F8] text-[#17191C]">
      {!isAdminPath && <Header />}
      <div className="flex-1">{children}</div>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <WhatsAppFloatingButton />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <AppLayout>
                <Routes>
                  {/* Public Storefront */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/deals" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/brands" element={<BrandsPage />} />
                  <Route path="/request-quote" element={<RequestQuotePage />} />
                  <Route path="/bulk-order" element={<BulkOrderPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/account/orders" element={<AccountPage />} />

                  {/* Admin Authentication */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />

                  {/* Admin Dashboard & Management Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="categories" element={<AdminCategoriesPage />} />
                    <Route path="brands" element={<AdminBrandsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="quotes" element={<AdminQuotesPage />} />
                    <Route path="messages" element={<AdminMessagesPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AppLayout>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
