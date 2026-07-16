import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { AuthRequest, UserRole } from '../types';
import Student from '../models/Student.model';
import Admin from '../models/Admin.model';

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
      return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const authorizeAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== UserRole.ADMIN) {
      res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
      return;
    }
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      res.status(403).json({ success: false, message: 'Admin account not found.' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authorization error.' });
  }
};

export const authorizeStudent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== UserRole.STUDENT) {
      res.status(403).json({ success: false, message: 'Access denied. Students only.' });
      return;
    }
    const student = await Student.findById(req.user.id);
    if (!student) {
      res.status(403).json({ success: false, message: 'Student account not found.' });
      return;
    }
    if (!student.isActive) {
      res.status(403).json({ success: false, message: 'Account has been suspended.' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authorization error.' });
  }
};
