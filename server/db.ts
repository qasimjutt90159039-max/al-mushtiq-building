import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  IUser,
  ICategory,
  IBrand,
  IProduct,
  IOrder,
  IQuoteRequest,
  IBulkOrder,
  IContactMessage,
  IReview,
  ISiteSettings
} from './types';
import { defaultCategories, defaultBrands, defaultSettings } from './data/seedData';
import { allProducts } from './data/allProducts';

interface DatabaseSchema {
  users: IUser[];
  categories: ICategory[];
  brands: IBrand[];
  products: IProduct[];
  orders: IOrder[];
  quotes: IQuoteRequest[];
  bulkOrders: IBulkOrder[];
  contactMessages: IContactMessage[];
  reviews: IReview[];
  settings: ISiteSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'app_db.json');

// In-memory working database state
let dbData: DatabaseSchema = {
  users: [],
  categories: [],
  brands: [],
  products: [],
  orders: [],
  quotes: [],
  bulkOrders: [],
  contactMessages: [],
  reviews: [],
  settings: defaultSettings
};

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function saveDatabase() {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving database to file:', err);
  }
}

export async function initDatabase() {
  ensureDataDirectory();

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      dbData = JSON.parse(content);
      console.log(`Loaded database from ${DB_FILE}`);
    } catch (err) {
      console.warn('Could not read existing DB file, re-initializing fresh database:', err);
    }
  }

  // Ensure default admin user exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@almushtaq.com';
  const existingAdmin = dbData.users.find(u => u.email.toLowerCase() === adminEmail.toLowerCase());
  if (!existingAdmin) {
    const rawPass = process.env.ADMIN_PASSWORD || 'admin_material_2026';
    const hashedPassword = await bcrypt.hash(rawPass, 10);
    const newAdmin: IUser & { passwordHash: string } = {
      _id: 'user-admin-1',
      name: 'Store Manager',
      email: adminEmail,
      phone: '+92 301 3242408',
      role: 'admin',
      address: {
        street: 'Manthar Road, Basti Manzoorabad Pull',
        city: 'Rahim Yar Khan',
        area: 'Manzoorabad',
        postalCode: '64200'
      },
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    (dbData.users as any).push(newAdmin);
  }

  // Ensure categories exist
  if (!dbData.categories || dbData.categories.length === 0) {
    dbData.categories = [...defaultCategories];
  }

  // Ensure brands exist
  if (!dbData.brands || dbData.brands.length === 0) {
    dbData.brands = [...defaultBrands];
  }

  // Ensure 100+ products exist
  if (!dbData.products || dbData.products.length < 80) {
    console.log(`Seeding all ${allProducts.length} building material products...`);
    dbData.products = [...allProducts];
  }

  // Ensure settings exist
  if (!dbData.settings || !dbData.settings.businessName) {
    dbData.settings = { ...defaultSettings };
  }

  saveDatabase();
  console.log(`Database ready. Products count: ${dbData.products.length}, Categories: ${dbData.categories.length}, Brands: ${dbData.brands.length}`);
}

// Database helper accessor methods
export const db = {
  get data() {
    return dbData;
  },
  users: {
    find: () => dbData.users,
    findById: (id: string) => dbData.users.find(u => u._id === id),
    findByEmail: (email: string) => dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
    create: (user: any) => {
      dbData.users.push(user);
      saveDatabase();
      return user;
    },
    update: (id: string, updates: Partial<IUser>) => {
      const index = dbData.users.findIndex(u => u._id === id);
      if (index !== -1) {
        dbData.users[index] = { ...dbData.users[index], ...updates, updatedAt: new Date().toISOString() };
        saveDatabase();
        return dbData.users[index];
      }
      return null;
    }
  },
  products: {
    find: (filterFn?: (p: IProduct) => boolean) => {
      if (filterFn) return dbData.products.filter(filterFn);
      return dbData.products;
    },
    findById: (id: string) => dbData.products.find(p => p._id === id),
    findBySlug: (slug: string) => dbData.products.find(p => p.slug === slug),
    create: (product: IProduct) => {
      dbData.products.unshift(product);
      saveDatabase();
      return product;
    },
    update: (id: string, updates: Partial<IProduct>) => {
      const index = dbData.products.findIndex(p => p._id === id);
      if (index !== -1) {
        dbData.products[index] = { ...dbData.products[index], ...updates, updatedAt: new Date().toISOString() };
        saveDatabase();
        return dbData.products[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = dbData.products.findIndex(p => p._id === id);
      if (index !== -1) {
        const removed = dbData.products.splice(index, 1);
        saveDatabase();
        return removed[0];
      }
      return null;
    }
  },
  categories: {
    find: () => dbData.categories.sort((a, b) => a.order - b.order),
    findBySlug: (slug: string) => dbData.categories.find(c => c.slug === slug),
    create: (cat: ICategory) => {
      dbData.categories.push(cat);
      saveDatabase();
      return cat;
    },
    update: (id: string, updates: Partial<ICategory>) => {
      const idx = dbData.categories.findIndex(c => c._id === id);
      if (idx !== -1) {
        dbData.categories[idx] = { ...dbData.categories[idx], ...updates };
        saveDatabase();
        return dbData.categories[idx];
      }
      return null;
    },
    delete: (id: string) => {
      const idx = dbData.categories.findIndex(c => c._id === id);
      if (idx !== -1) {
        const removed = dbData.categories.splice(idx, 1);
        saveDatabase();
        return removed[0];
      }
      return null;
    }
  },
  brands: {
    find: () => dbData.brands,
    findBySlug: (slug: string) => dbData.brands.find(b => b.slug === slug),
    create: (brand: IBrand) => {
      dbData.brands.push(brand);
      saveDatabase();
      return brand;
    },
    update: (id: string, updates: Partial<IBrand>) => {
      const idx = dbData.brands.findIndex(b => b._id === id);
      if (idx !== -1) {
        dbData.brands[idx] = { ...dbData.brands[idx], ...updates };
        saveDatabase();
        return dbData.brands[idx];
      }
      return null;
    },
    delete: (id: string) => {
      const idx = dbData.brands.findIndex(b => b._id === id);
      if (idx !== -1) {
        const removed = dbData.brands.splice(idx, 1);
        saveDatabase();
        return removed[0];
      }
      return null;
    }
  },
  orders: {
    find: (filterFn?: (o: IOrder) => boolean) => {
      if (filterFn) return dbData.orders.filter(filterFn);
      return dbData.orders;
    },
    findById: (id: string) => dbData.orders.find(o => o._id === id),
    findByOrderNumber: (num: string) => dbData.orders.find(o => o.orderNumber.toUpperCase() === num.trim().toUpperCase()),
    create: (order: IOrder) => {
      dbData.orders.unshift(order);
      saveDatabase();
      return order;
    },
    update: (id: string, updates: Partial<IOrder>) => {
      const idx = dbData.orders.findIndex(o => o._id === id);
      if (idx !== -1) {
        dbData.orders[idx] = { ...dbData.orders[idx], ...updates, updatedAt: new Date().toISOString() };
        saveDatabase();
        return dbData.orders[idx];
      }
      return null;
    }
  },
  quotes: {
    find: () => dbData.quotes,
    findById: (id: string) => dbData.quotes.find(q => q._id === id),
    create: (q: IQuoteRequest) => {
      dbData.quotes.unshift(q);
      saveDatabase();
      return q;
    },
    update: (id: string, updates: Partial<IQuoteRequest>) => {
      const idx = dbData.quotes.findIndex(q => q._id === id);
      if (idx !== -1) {
        dbData.quotes[idx] = { ...dbData.quotes[idx], ...updates, updatedAt: new Date().toISOString() };
        saveDatabase();
        return dbData.quotes[idx];
      }
      return null;
    },
    delete: (id: string) => {
      const idx = dbData.quotes.findIndex(q => q._id === id);
      if (idx !== -1) {
        const removed = dbData.quotes.splice(idx, 1);
        saveDatabase();
        return removed[0];
      }
      return null;
    }
  },
  bulkOrders: {
    find: () => dbData.bulkOrders,
    create: (bo: IBulkOrder) => {
      dbData.bulkOrders.unshift(bo);
      saveDatabase();
      return bo;
    }
  },
  contactMessages: {
    find: () => dbData.contactMessages,
    create: (msg: IContactMessage) => {
      dbData.contactMessages.unshift(msg);
      saveDatabase();
      return msg;
    },
    update: (id: string, updates: Partial<IContactMessage>) => {
      const idx = dbData.contactMessages.findIndex(m => m._id === id);
      if (idx !== -1) {
        dbData.contactMessages[idx] = { ...dbData.contactMessages[idx], ...updates };
        saveDatabase();
        return dbData.contactMessages[idx];
      }
      return null;
    }
  },
  reviews: {
    findByProductId: (productId: string) => dbData.reviews.filter(r => r.productId === productId && r.isApproved),
    create: (rev: IReview) => {
      dbData.reviews.unshift(rev);
      saveDatabase();
      return rev;
    }
  },
  settings: {
    get: () => dbData.settings,
    update: (newSettings: Partial<ISiteSettings>) => {
      dbData.settings = { ...dbData.settings, ...newSettings };
      saveDatabase();
      return dbData.settings;
    }
  }
};
