import { Request, Response } from 'express';
import { db } from '../db';
import { IOrder, IOrderItem } from '../types';
import { AuthRequest } from '../middleware/authMiddleware';

let orderCounter = 1;

function generateOrderNumber(): string {
  const currentOrders = db.orders.find();
  const nextNum = currentOrders.length + 1;
  const padded = String(nextNum).padStart(6, '0');
  const year = new Date().getFullYear();
  return `AMS-${year}-${padded}`;
}

export function createOrder(req: Request, res: Response) {
  try {
    const {
      customerName,
      phone,
      email,
      shippingAddress,
      orderNotes,
      items,
      paymentMethod = 'Cash on Delivery',
      userId
    } = req.body;

    if (!customerName || !phone || !shippingAddress || !shippingAddress.street || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, phone number, delivery address, and cart items are required.'
      });
    }

    // Backend validates and recalculates all item prices and totals
    let calculatedSubtotal = 0;
    const validatedItems: IOrderItem[] = [];

    for (const item of items) {
      const product = db.products.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name || item.productId} is no longer available.`
        });
      }

      if (product.isQuotationRequired) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" requires a price quotation. Please submit a quote request.`
        });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available stock: ${product.stock} ${product.unit}.`
        });
      }

      const itemTotal = product.price * qty;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        unit: product.unit,
        quantity: qty,
        image: product.thumbnail || (product.images && product.images[0]) || '/images/products/cement-bag.svg',
        total: itemTotal
      });

      // Deduct stock
      db.products.update(product._id, {
        stock: product.stock - qty,
        stockStatus: (product.stock - qty) <= 0 ? 'Out of Stock' : (product.stock - qty) <= 10 ? 'Low Stock' : 'In Stock'
      });
    }

    const settings = db.settings.get();
    const deliveryFee = calculatedSubtotal >= (settings.freeDeliveryThreshold || 50000) ? 0 : (settings.deliveryFee || 1500);
    const finalTotal = calculatedSubtotal + deliveryFee;

    const newOrder: IOrder = {
      _id: 'ord-' + Date.now(),
      orderNumber: generateOrderNumber(),
      user: userId,
      customerName,
      phone,
      email: email || '',
      shippingAddress: {
        street: shippingAddress.street,
        area: shippingAddress.area || '',
        city: shippingAddress.city || 'Rahim Yar Khan',
        postalCode: shippingAddress.postalCode || '64200',
        deliveryInstructions: shippingAddress.deliveryInstructions || ''
      },
      orderNotes: orderNotes || '',
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount: 0,
      deliveryFee,
      total: finalTotal,
      paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          date: new Date().toISOString(),
          note: 'Order placed by customer via store checkout.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedOrder = db.orders.create(newOrder);

    return res.status(201).json({
      success: true,
      message: 'Your order has been placed successfully!',
      order: savedOrder
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return res.status(500).json({ success: false, message: 'Your order could not be submitted. Please try again.' });
  }
}

export function trackOrder(req: Request, res: Response) {
  try {
    const { orderNumber, phone } = req.query;
    if (!orderNumber || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Order number and phone number are required to track your order.'
      });
    }

    const cleanNum = String(orderNumber).trim().toUpperCase();
    const cleanPhone = String(phone).replace(/[^0-9]/g, '');

    const order = db.orders.findByOrderNumber(cleanNum);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No order found with this order number. Please verify and try again.'
      });
    }

    const orderPhoneClean = order.phone.replace(/[^0-9]/g, '');
    if (!orderPhoneClean.includes(cleanPhone) && !cleanPhone.includes(orderPhoneClean)) {
      return res.status(404).json({
        success: false,
        message: 'The phone number provided does not match the order records.'
      });
    }

    return res.json({
      success: true,
      order
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to track order at this moment.' });
  }
}

export function getMyOrders(req: AuthRequest, res: Response) {
  try {
    const userId = req.user._id;
    const orders = db.orders.find(o => o.user === userId || (req.user.email && o.email === req.user.email));
    return res.json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to load orders.' });
  }
}

export function getAllOrders(req: Request, res: Response) {
  try {
    const { status, search } = req.query;
    let orders = db.orders.find();

    if (status && typeof status === 'string' && status !== 'all') {
      orders = orders.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }

    return res.json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to retrieve orders.' });
  }
}

export function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const existing = db.orders.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const statusHistory = [...(existing.statusHistory || [])];
    statusHistory.push({
      status,
      date: new Date().toISOString(),
      note: note || `Order status updated to ${status}`
    });

    const updated = db.orders.update(id, {
      orderStatus: status,
      statusHistory
    });

    return res.json({ success: true, order: updated, message: `Order status updated to ${status}.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
}
