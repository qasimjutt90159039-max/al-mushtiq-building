import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'al_mushtaq_super_secret_jwt_key_2026';

export interface AuthRequest extends Request {
  user?: any;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = db.users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Session expired or invalid token. Please log in again.' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  authenticateToken(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    }
    next();
  });
}
