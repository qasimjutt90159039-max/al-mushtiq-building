import { Request, Response } from 'express';
import { db } from '../db';
import { ICategory, IBrand } from '../types';

export function getDashboardMetrics(req: Request, res: Response) {
  try {
    const products = db.products.find();
    const orders = db.orders.find();
    const quotes = db.quotes.find();
    const users = db.users.find();

    const totalSales = orders.reduce((sum, o) => {
      if (o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Returned') {
        return sum + (o.total || 0);
      }
      return sum;
    }, 0);

    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)).length;
    const outOfStockCount = products.filter(p => p.stock === 0 && !p.isQuotationRequired).length;
    const quoteRequestsCount = quotes.filter(q => q.status === 'New').length;

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    for (const p of products) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }

    // Recent orders
    const recentOrders = orders.slice(0, 6);

    // Recent quotes
    const recentQuotes = quotes.slice(0, 6);

    return res.json({
      success: true,
      stats: {
        totalSales,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: users.filter(u => u.role !== 'admin').length,
        pendingOrders,
        quoteRequests: quoteRequestsCount,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount
      },
      categoryCounts,
      recentOrders,
      recentQuotes
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to load dashboard metrics.' });
  }
}

// Categories
export function getCategories(req: Request, res: Response) {
  const cats = db.categories.find();
  const products = db.products.find();
  const withCounts = cats.map(c => ({
    ...c,
    productCount: products.filter(p => p.category.toLowerCase() === c.name.toLowerCase() || p.category.toLowerCase() === c.slug.toLowerCase()).length
  }));
  return res.json({ success: true, categories: withCounts });
}

export function createCategory(req: Request, res: Response) {
  const { name, description, iconName, order } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name is required.' });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newCat: ICategory = {
    _id: 'cat-' + Date.now(),
    name,
    slug,
    description: description || '',
    iconName: iconName || 'Layers',
    order: Number(order) || 99,
    isActive: true
  };
  const saved = db.categories.create(newCat);
  return res.status(201).json({ success: true, category: saved });
}

export function updateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const updated = db.categories.update(id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Category not found.' });
  return res.json({ success: true, category: updated });
}

export function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;
  const removed = db.categories.delete(id);
  if (!removed) return res.status(404).json({ success: false, message: 'Category not found.' });
  return res.json({ success: true, message: 'Category deleted.' });
}

// Brands
export function getBrands(req: Request, res: Response) {
  const brands = db.brands.find();
  const products = db.products.find();
  const withCounts = brands.map(b => ({
    ...b,
    productCount: products.filter(p => p.brand.toLowerCase() === b.name.toLowerCase() || p.brand.toLowerCase() === b.slug.toLowerCase()).length
  }));
  return res.json({ success: true, brands: withCounts });
}

export function createBrand(req: Request, res: Response) {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Brand name is required.' });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newBrand: IBrand = {
    _id: 'brand-' + Date.now(),
    name,
    slug,
    description: description || '',
    isActive: true
  };
  const saved = db.brands.create(newBrand);
  return res.status(201).json({ success: true, brand: saved });
}

export function updateBrand(req: Request, res: Response) {
  const { id } = req.params;
  const updated = db.brands.update(id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Brand not found.' });
  return res.json({ success: true, brand: updated });
}

export function deleteBrand(req: Request, res: Response) {
  const { id } = req.params;
  const removed = db.brands.delete(id);
  if (!removed) return res.status(404).json({ success: false, message: 'Brand not found.' });
  return res.json({ success: true, message: 'Brand deleted.' });
}

// Site Settings
export function getSettings(req: Request, res: Response) {
  return res.json({ success: true, settings: db.settings.get() });
}

export function updateSettings(req: Request, res: Response) {
  const updated = db.settings.update(req.body);
  return res.json({ success: true, settings: updated, message: 'Site settings updated successfully.' });
}

// Contact messages
export function submitContact(req: Request, res: Response) {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Name, phone, and message are required.' });
  }
  const msg = db.contactMessages.create({
    _id: 'msg-' + Date.now(),
    name,
    email: email || '',
    phone,
    subject: subject || 'General Store Inquiry',
    message,
    status: 'New',
    createdAt: new Date().toISOString()
  });
  return res.status(201).json({ success: true, message: 'Your message has been sent successfully.', contact: msg });
}

export function getContactMessages(req: Request, res: Response) {
  return res.json({ success: true, messages: db.contactMessages.find() });
}

export function updateContactMessage(req: Request, res: Response) {
  const { id } = req.params;
  const updated = db.contactMessages.update(id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Message not found.' });
  return res.json({ success: true, message: updated });
}

// Customers List
export function getCustomers(req: Request, res: Response) {
  const users = db.users.find().map(u => {
    const { passwordHash, ...safe } = u as any;
    const userOrders = db.orders.find(o => Boolean(o.user === u._id || (u.email && o.email === u.email)));
    return {
      ...safe,
      ordersCount: userOrders.length,
      totalSpent: userOrders.reduce((sum, o) => sum + (o.total || 0), 0)
    };
  });
  return res.json({ success: true, customers: users });
}
