import { Router, Request, Response } from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import {
  createOrder,
  trackOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController';
import {
  createQuoteRequest,
  getAllQuotes,
  updateQuoteStatus,
  deleteQuote,
  createBulkOrder,
  getAllBulkOrders
} from '../controllers/quoteController';
import {
  register,
  login,
  getCurrentUser,
  updateProfile
} from '../controllers/authController';
import {
  getDashboardMetrics,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getSettings,
  updateSettings,
  submitContact,
  getContactMessages,
  updateContactMessage,
  getCustomers
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    store: 'Al Mushtaq Building Material Store',
    location: 'Rahim Yar Khan, Pakistan',
    time: new Date().toISOString()
  });
});

// Authentication
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getCurrentUser);
router.put('/auth/profile', authenticateToken, updateProfile);

// Products
router.get('/products', getProducts);
router.get('/products/slug/:slug', getProductBySlug);
router.get('/products/:id', getProductById);
router.post('/products', requireAdmin, createProduct);
router.put('/products/:id', requireAdmin, updateProduct);
router.delete('/products/:id', requireAdmin, deleteProduct);

// Categories
router.get('/categories', getCategories);
router.post('/categories', requireAdmin, createCategory);
router.put('/categories/:id', requireAdmin, updateCategory);
router.delete('/categories/:id', requireAdmin, deleteCategory);

// Brands
router.get('/brands', getBrands);
router.post('/brands', requireAdmin, createBrand);
router.put('/brands/:id', requireAdmin, updateBrand);
router.delete('/brands/:id', requireAdmin, deleteBrand);

// Orders
router.post('/orders', createOrder);
router.get('/orders/track', trackOrder);
router.get('/orders/my', authenticateToken, getMyOrders);
router.get('/orders', requireAdmin, getAllOrders);
router.put('/orders/:id/status', requireAdmin, updateOrderStatus);

// Quotations
router.post('/quotes', createQuoteRequest);
router.get('/quotes', requireAdmin, getAllQuotes);
router.put('/quotes/:id', requireAdmin, updateQuoteStatus);
router.delete('/quotes/:id', requireAdmin, deleteQuote);

// Bulk contractor orders
router.post('/bulk-orders', createBulkOrder);
router.get('/bulk-orders', requireAdmin, getAllBulkOrders);

// Contact messages
router.post('/contact', submitContact);
router.get('/contact', requireAdmin, getContactMessages);
router.put('/contact/:id', requireAdmin, updateContactMessage);

// Site settings
router.get('/settings', getSettings);
router.put('/settings', requireAdmin, updateSettings);

// Admin dashboard & customer list
router.get('/admin/dashboard', requireAdmin, getDashboardMetrics);
router.get('/admin/customers', requireAdmin, getCustomers);

// Coupons validation
router.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });

  const upper = String(code).trim().toUpperCase();
  if (upper === 'BUILD10') {
    const discount = Math.round((subtotal || 0) * 0.1);
    return res.json({ success: true, code: upper, discount, message: '10% Contractor discount applied!' });
  } else if (upper === 'WELCOME5') {
    const discount = Math.round((subtotal || 0) * 0.05);
    return res.json({ success: true, code: upper, discount, message: '5% Welcome discount applied!' });
  }
  return res.status(400).json({ success: false, message: 'Invalid or expired coupon code.' });
});

export default router;
