import { Request, Response } from 'express';
import { db } from '../db';
import { IProduct } from '../types';

export function getProducts(req: Request, res: Response) {
  try {
    const {
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      unit,
      material,
      stockStatus,
      featured,
      deal,
      isNew,
      sort,
      page = '1',
      limit = '20'
    } = req.query;

    let items = db.products.find();

    // Category filter
    if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
      const catSlug = category.toLowerCase().trim();
      const catObj = db.categories.findBySlug(catSlug);
      const catName = catObj ? catObj.name.toLowerCase() : catSlug;
      items = items.filter(p => p.category.toLowerCase() === catName || p.category.toLowerCase() === catSlug);
    }

    // Brand filter
    if (brand && typeof brand === 'string' && brand.toLowerCase() !== 'all') {
      const brandSlug = brand.toLowerCase().trim();
      const brandObj = db.brands.findBySlug(brandSlug);
      const brandName = brandObj ? brandObj.name.toLowerCase() : brandSlug;
      items = items.filter(p => p.brand.toLowerCase() === brandName || p.brand.toLowerCase() === brandSlug);
    }

    // Search filter across name, brand, SKU, category, material, tags
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Price filters
    if (minPrice && !isNaN(Number(minPrice))) {
      items = items.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      items = items.filter(p => p.price <= Number(maxPrice));
    }

    // Unit filter
    if (unit && typeof unit === 'string' && unit.toLowerCase() !== 'all') {
      items = items.filter(p => p.unit.toLowerCase() === unit.toLowerCase());
    }

    // Material filter
    if (material && typeof material === 'string') {
      items = items.filter(p => p.material && p.material.toLowerCase().includes(material.toLowerCase()));
    }

    // Stock status filter
    if (stockStatus && typeof stockStatus === 'string') {
      items = items.filter(p => p.stockStatus.toLowerCase() === stockStatus.toLowerCase());
    }

    // Featured / Deal / New flags
    if (featured === 'true') {
      items = items.filter(p => p.isFeatured);
    }
    if (deal === 'true') {
      items = items.filter(p => p.isDeal);
    }
    if (isNew === 'true') {
      items = items.filter(p => p.isNewProduct);
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        items.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
        break;
      case 'newest':
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    const total = items.length;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = items.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      products: paginatedItems
    });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ success: false, message: 'Unable to load products. Please try again.' });
  }
}

export function getProductBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const product = db.products.findBySlug(slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Get related products from same category
    const related = db.products.find(p => p.category === product.category && p._id !== product._id).slice(0, 4);

    return res.json({
      success: true,
      product,
      related
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to load product details.' });
  }
}

export function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = db.products.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    return res.json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to load product.' });
  }
}

export function createProduct(req: Request, res: Response) {
  try {
    const body = req.body;
    if (!body.name || !body.category || !body.sku || !body.unit) {
      return res.status(400).json({ success: false, message: 'Product name, SKU, category, and unit are required.' });
    }

    // Check unique SKU
    const existing = db.products.find(p => p.sku.toLowerCase() === body.sku.toLowerCase());
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'SKU must be unique. A product with this SKU already exists.' });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newProduct: IProduct = {
      _id: 'prod-' + Date.now(),
      name: body.name,
      slug,
      sku: body.sku.toUpperCase(),
      brand: body.brand || 'Al Mushtaq',
      category: body.category,
      subcategory: body.subcategory || '',
      description: body.description || '',
      shortDescription: body.shortDescription || '',
      price: Number(body.price) || 0,
      oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
      discountPercentage: body.discountPercentage ? Number(body.discountPercentage) : undefined,
      unit: body.unit,
      minimumOrderQuantity: Number(body.minimumOrderQuantity) || 1,
      stock: Number(body.stock) || 0,
      stockStatus: body.stockStatus || (Number(body.stock) > 0 ? 'In Stock' : 'Out of Stock'),
      lowStockThreshold: Number(body.lowStockThreshold) || 10,
      images: body.images && body.images.length > 0 ? body.images : ['/images/products/cement-bag.svg'],
      thumbnail: body.thumbnail || (body.images && body.images[0]) || '/images/products/cement-bag.svg',
      specifications: body.specifications || {},
      features: body.features || [],
      weight: body.weight || '',
      dimensions: body.dimensions || '',
      color: body.color || '',
      material: body.material || '',
      warranty: body.warranty || '',
      tags: body.tags || [],
      isFeatured: Boolean(body.isFeatured),
      isDeal: Boolean(body.isDeal),
      isNewProduct: Boolean(body.isNewProduct),
      isQuotationRequired: Boolean(body.isQuotationRequired),
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = db.products.create(newProduct);
    return res.status(201).json({ success: true, product: saved, message: 'Product created successfully.' });
  } catch (err: any) {
    console.error('Error creating product:', err);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
}

export function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = db.products.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const updated = db.products.update(id, req.body);
    return res.json({ success: true, product: updated, message: 'Product updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
}

export function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const removed = db.products.delete(id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
}
