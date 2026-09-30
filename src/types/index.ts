export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  unit: string;
  minimumOrderQuantity: number;
  stock: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Quote Required';
  lowStockThreshold?: number;
  images: string[];
  thumbnail: string;
  specifications: Record<string, string>;
  features: string[];
  weight?: string;
  dimensions?: string;
  color?: string;
  material?: string;
  warranty?: string;
  tags: string[];
  isFeatured: boolean;
  isDeal: boolean;
  isNewProduct: boolean;
  isQuotationRequired: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  image?: string;
  order: number;
  isActive: boolean;
  productCount?: number;
}

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
}

export interface ICartItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  stock: number;
  minimumOrderQuantity: number;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'contractor' | 'admin';
  address?: {
    street: string;
    city: string;
    area: string;
    postalCode?: string;
  };
}

export interface IOrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  total: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user?: string;
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: {
    street: string;
    area: string;
    city: string;
    postalCode?: string;
    deliveryInstructions?: string;
  };
  orderNotes?: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'WhatsApp / Phone Confirmation';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Dispatched' | 'Delivered' | 'Cancelled' | 'Returned';
  statusHistory: Array<{
    status: string;
    date: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface IQuoteRequest {
  _id: string;
  quoteNumber: string;
  name: string;
  phone: string;
  email?: string;
  productName?: string;
  productId?: string;
  quantity: number;
  unit: string;
  projectType: string;
  deliveryLocation: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Quoted' | 'Accepted' | 'Rejected' | 'Completed';
  adminNotes?: string;
  quotedAmount?: number;
  createdAt: string;
}

export interface ISiteSettings {
  businessName: string;
  subtitle: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  deliveryAreas: string[];
  deliveryFee: number;
  freeDeliveryThreshold: number;
  announcementBarText: string;
  heroHeading: string;
  heroSubheading: string;
  returnPolicy: string;
  warrantyPolicy: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
}
