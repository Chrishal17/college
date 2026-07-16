import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.model';
import Admin from '../models/Admin.model';
import OTP from '../models/OTP.model';
import { AuthRequest, UserRole } from '../types';
import { generateToken } from '../utils/jwt';
import { createOTP, verifyOTP } from '../utils/otp';
import { sendOTPEmail, sendRegistrationSuccessEmail, sendPasswordResetEmail } from '../services/email.service';
import { config } from '../config/config';

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, rollNumber, registerNumber, collegeType, department, year, section, phone } = req.body;

    const existingStudent = await Student.findOne({ $or: [{ email }, { rollNumber }, { registerNumber }] });
    if (existingStudent) {
      res.status(409).json({ success: false, message: 'Student with this email, roll number, or register number already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const student = await Student.create({
      name, email, password: hashedPassword, rollNumber, registerNumber,
      collegeType, department, year: Number(year), section, phone, verified: false, isActive: true,
    });

    const otp = await createOTP(email);
    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email with the OTP sent.',
      data: { email: student.email, name: student.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: (error as Error).message });
  }
};

// POST /api/auth/verify-otp
export const verifyOTPHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }
    const student = await Student.findOneAndUpdate(
      { email, verified: false },
      { verified: true },
      { new: true }
    );
    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found or already verified' });
      return;
    }
    await sendRegistrationSuccessEmail(email, student.name);
    res.status(200).json({ success: true, message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'OTP verification failed', error: (error as Error).message });
  }
};

// POST /api/auth/resend-otp
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email, verified: false });
    if (!student) {
      res.status(404).json({ success: false, message: 'No unverified account found with this email' });
      return;
    }
    const otp = await createOTP(email);
    await sendOTPEmail(email, otp);
    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resend OTP', error: (error as Error).message });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Try student login
    const student = await Student.findOne({ email }).select('+password');
    if (student) {
      if (!student.verified) {
        res.status(403).json({ success: false, message: 'Please verify your email before logging in' });
        return;
      }
      if (!student.isActive) {
        res.status(403).json({ success: false, message: 'Your account has been suspended. Contact admin.' });
        return;
      }
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }
      const token = generateToken(student._id.toString(), student.email, UserRole.STUDENT);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: student._id, name: student.name, email: student.email, role: UserRole.STUDENT,
            department: student.department, year: student.year, verified: student.verified,
          },
        },
      });
      return;
    }

    // Try admin login
    const admin = await Admin.findOne({ email }).select('+password');
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }
      const token = generateToken(admin._id.toString(), admin.email, UserRole.ADMIN);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: { id: admin._id, name: admin.name, email: admin.email, role: UserRole.ADMIN },
        },
      });
      return;
    }

    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: (error as Error).message });
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    if (req.user.role === UserRole.ADMIN) {
      const admin = await Admin.findById(req.user.id);
      if (!admin) { res.status(404).json({ success: false, message: 'Admin not found' }); return; }
      res.status(200).json({ success: true, data: { id: admin._id, name: admin.name, email: admin.email, role: UserRole.ADMIN } });
      return;
    }
    const student = await Student.findById(req.user.id);
    if (!student) { res.status(404).json({ success: false, message: 'Student not found' }); return; }
    res.status(200).json({
      success: true,
      data: {
        id: student._id, name: student.name, email: student.email, role: UserRole.STUDENT,
        rollNumber: student.rollNumber, registerNumber: student.registerNumber, collegeType: student.collegeType,
        department: student.department, year: student.year, section: student.section, phone: student.phone,
        verified: student.verified, profilePicture: student.profilePicture, isActive: student.isActive,
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user info', error: (error as Error).message });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      res.status(404).json({ success: false, message: 'No account found with this email' });
      return;
    }
    const otp = await createOTP(email);
    await sendPasswordResetEmail(email, student.name, otp);
    res.status(200).json({ success: true, message: 'Password reset OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process request', error: (error as Error).message });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;
    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await Student.findOneAndUpdate({ email }, { password: hashedPassword });
    res.status(200).json({ success: true, message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password reset failed', error: (error as Error).message });
  }
};
