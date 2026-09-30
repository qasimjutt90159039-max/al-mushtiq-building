import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { IUser } from '../types';
import { AuthRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'al_mushtaq_super_secret_jwt_key_2026';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, phone, street, city, area } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and phone number are required.' });
    }

    const existingUser = db.users.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: IUser & { passwordHash: string } = {
      _id: 'usr-' + Date.now(),
      name,
      email: email.toLowerCase().trim(),
      phone,
      role: 'customer',
      address: {
        street: street || '',
        city: city || 'Rahim Yar Khan',
        area: area || '',
        postalCode: '64200'
      },
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.users.create(newUser);

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: safeUser
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create account.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = db.users.findByEmail(email) as any;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: safeUser
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
}

export function getCurrentUser(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }
  const { passwordHash: _, ...safeUser } = req.user;
  return res.json({ success: true, user: safeUser });
}

export function updateProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user._id;
    const { name, phone, address } = req.body;

    const updated = db.users.update(userId, {
      name,
      phone,
      address
    });

    return res.json({ success: true, user: updated, message: 'Profile updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}
