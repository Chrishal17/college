import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.model';
import Complaint from '../models/Complaint.model';
import Notification from '../models/Notification.model';
import { AuthRequest } from '../types';
import { calculatePagination } from '../utils/helpers';

// GET /api/students/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const student = await Student.findById(req.user?.id);
    if (!student) { res.status(404).json({ success: false, message: 'Student not found' }); return; }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get profile', error: (error as Error).message });
  }
};

// PUT /api/students/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, department, year, section, profilePicture } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.user?.id,
      { name, phone, department, year, section, profilePicture },
      { new: true, runValidators: true }
    );
    if (!student) { res.status(404).json({ success: false, message: 'Student not found' }); return; }
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: (error as Error).message });
  }
};

// PUT /api/students/password
export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const student = await Student.findById(req.user?.id).select('+password');
    if (!student) { res.status(404).json({ success: false, message: 'Student not found' }); return; }
    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) { res.status(400).json({ success: false, message: 'Current password is incorrect' }); return; }
    student.password = await bcrypt.hash(newPassword, 12);
    await student.save();
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update password', error: (error as Error).message });
  }
};

// GET /api/students/dashboard-stats
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const [total, pending, resolved, inProgress, critical, recentComplaints, latestNotification, unreadCount] = await Promise.all([
      Complaint.countDocuments({ studentId }),
      Complaint.countDocuments({ studentId, status: 'Pending' }),
      Complaint.countDocuments({ studentId, status: 'Resolved' }),
      Complaint.countDocuments({ studentId, status: { $in: ['In Progress', 'Assigned'] } }),
      Complaint.countDocuments({ studentId, priority: 'Critical', status: { $nin: ['Resolved', 'Closed'] } }),
      Complaint.find({ studentId }).sort({ createdAt: -1 }).limit(5),
      Notification.findOne({ studentId }).sort({ createdAt: -1 }),
      Notification.countDocuments({ studentId, read: false }),
    ]);

    // Calculate average resolution time
    const resolvedComplaints = await Complaint.find({ studentId, status: 'Resolved', resolvedAt: { $ne: null } });
    let avgResolutionTime = 0;
    if (resolvedComplaints.length > 0) {
      const totalHours = resolvedComplaints.reduce((acc, c) => {
        return acc + (new Date(c.resolvedAt!).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60);
      }, 0);
      avgResolutionTime = Math.round(totalHours / resolvedComplaints.length);
    }

    res.status(200).json({
      success: true,
      data: {
        totalComplaints: total, pending, resolved, inProgress, critical,
        avgResolutionTime: `${avgResolutionTime}h`,
        recentComplaints,
        latestNotification, unreadNotificationCount: unreadCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get dashboard stats', error: (error as Error).message });
  }
};
