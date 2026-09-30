import { Request, Response } from 'express';
import { db } from '../db';
import { IQuoteRequest, IBulkOrder } from '../types';

export function createQuoteRequest(req: Request, res: Response) {
  try {
    const {
      name,
      phone,
      email,
      productName,
      productId,
      quantity,
      unit,
      projectType,
      deliveryLocation,
      message
    } = req.body;

    if (!name || !phone || !quantity || !unit || !deliveryLocation) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, quantity, unit, and delivery location are required.'
      });
    }

    const currentQuotes = db.quotes.find();
    const count = currentQuotes.length + 1;
    const quoteNumber = `QTE-${new Date().getFullYear()}-${String(count).padStart(5, '0')}`;

    const newQuote: IQuoteRequest = {
      _id: 'qte-' + Date.now(),
      quoteNumber,
      name,
      phone,
      email: email || '',
      productName: productName || 'General Materials',
      productId: productId || '',
      quantity: Number(quantity) || 1,
      unit,
      projectType: projectType || 'Residential Construction',
      deliveryLocation,
      message: message || '',
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = db.quotes.create(newQuote);

    return res.status(201).json({
      success: true,
      quote: saved,
      message: 'Your quote request has been submitted successfully! Our team will contact you shortly.'
    });
  } catch (err: any) {
    console.error('Quote request error:', err);
    return res.status(500).json({ success: false, message: 'Invalid quotation request. Please try again.' });
  }
}

export function getAllQuotes(req: Request, res: Response) {
  try {
    const { status } = req.query;
    let quotes = db.quotes.find();
    if (status && typeof status === 'string' && status !== 'all') {
      quotes = quotes.filter(q => q.status.toLowerCase() === status.toLowerCase());
    }
    return res.json({ success: true, quotes });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to retrieve quotes.' });
  }
}

export function updateQuoteStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, adminNotes, quotedAmount } = req.body;

    const existing = db.quotes.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Quote request not found.' });
    }

    const updated = db.quotes.update(id, {
      status,
      adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
      quotedAmount: quotedAmount !== undefined ? Number(quotedAmount) : existing.quotedAmount
    });

    return res.json({ success: true, quote: updated, message: `Quotation status updated to ${status}.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update quote request.' });
  }
}

export function deleteQuote(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const removed = db.quotes.delete(id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Quote not found.' });
    }
    return res.json({ success: true, message: 'Quote request removed.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete quote.' });
  }
}

export function createBulkOrder(req: Request, res: Response) {
  try {
    const {
      customerName,
      phone,
      email,
      companyName,
      projectLocation,
      requiredDate,
      productsSummary,
      materialsList,
      notes
    } = req.body;

    if (!customerName || !phone || !projectLocation || !productsSummary) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, project location, and required products summary are required.'
      });
    }

    const ref = `BLK-${Date.now().toString().slice(-6)}`;
    const newBulkOrder: IBulkOrder = {
      _id: 'blk-' + Date.now(),
      referenceNumber: ref,
      customerName,
      phone,
      email: email || '',
      companyName: companyName || '',
      projectLocation,
      requiredDate: requiredDate || '',
      productsSummary,
      materialsList: materialsList || [],
      notes: notes || '',
      status: 'New',
      createdAt: new Date().toISOString()
    };

    const saved = db.bulkOrders.create(newBulkOrder);
    return res.status(201).json({
      success: true,
      bulkOrder: saved,
      message: 'Bulk contractor order request submitted. Reference: ' + ref
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to submit bulk order.' });
  }
}

export function getAllBulkOrders(req: Request, res: Response) {
  try {
    const bulkOrders = db.bulkOrders.find();
    return res.json({ success: true, bulkOrders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to load bulk orders.' });
  }
}
