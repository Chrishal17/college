import { Request, Response } from 'express';
import Complaint from '../models/Complaint.model';
import Student from '../models/Student.model';
import Notification from '../models/Notification.model';
import { AuthRequest, ComplaintStatus } from '../types';
import { calculatePagination } from '../utils/helpers';
import { sendComplaintAssignedEmail, sendComplaintUpdatedEmail, sendComplaintResolvedEmail, sendComplaintClosedEmail } from '../services/email.service';

// GET /api/admin/dashboard
export const getDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalStudents, verifiedStudents, pendingStudents, totalComplaints,
      pendingComplaints, resolvedComplaints, criticalComplaints, todayComplaints,
      recentComplaints, recentStudents, categoryStats, departmentStats,
      priorityStats, monthlyStats,
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ verified: true }),
      Student.countDocuments({ verified: false }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: { $in: ['Pending', 'Assigned', 'In Progress', 'Reopened'] } }),
      Complaint.countDocuments({ status: { $in: ['Resolved', 'Closed'] } }),
      Complaint.countDocuments({ priority: 'Critical', status: { $nin: ['Resolved', 'Closed'] } }),
      Complaint.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      Complaint.find().sort({ createdAt: -1 }).limit(10).populate('studentId', 'name email department'),
      Student.find().sort({ createdAt: -1 }).limit(10),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $lookup: { from: 'students', localField: 'studentId', foreignField: '_id', as: 'student' } },
        { $unwind: '$student' },
        { $group: { _id: '$student.department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Complaint.aggregate([
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents, verifiedStudents, pendingStudents, totalComplaints,
        pendingComplaints, resolvedComplaints, criticalComplaints, todayComplaints,
        recentComplaints, recentStudents,
        charts: { categoryStats, departmentStats, priorityStats, monthlyStats },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard', error: (error as Error).message });
  }
};

// GET /api/admin/students
export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { search, department, verified, isActive, sort } = req.query;

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { registerNumber: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) filter.department = department;
    if (verified !== undefined) filter.verified = verified === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const sortStr = (sort as string) || '-createdAt';
    const total = await Student.countDocuments(filter);
    const { skip, totalPages } = calculatePagination(page, limit, total);
    const students = await Student.find(filter).sort(sortStr).skip(skip).limit(limit).select('-password');

    res.status(200).json({ success: true, data: students, pagination: { page, limit, total, totalPages } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch students', error: (error as Error).message });
  }
};

// GET /api/admin/students/:id
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) { res.status(404).json({ success: false, message: 'Student not found' }); return; }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student', error: (error as Error).message });
  }
};

// PUT /api/admin/students/:id/status
export const updateStudentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isActive } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password');
    if (!student) { res.status(404).json({ success: false, message: 'Student not found' }); return; }
    res.status(200).json({ success: true, message: `Student ${isActive ? 'activated' : 'suspended'} successfully`, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update student status', error: (error as Error).message });
  }
};

// DELETE /api/admin/students/:id
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) { res.status(404).json({ success: false, message: 'Student not found' }); return; }
    await Complaint.deleteMany({ studentId: req.params.id });
    await Notification.deleteMany({ studentId: req.params.id });
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete student', error: (error as Error).message });
  }
};

// GET /api/admin/complaints
export const getComplaints = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { status, category, priority, search, sort, studentId } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (studentId) filter.studentId = studentId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortStr = (sort as string) || '-createdAt';
    const total = await Complaint.countDocuments(filter);
    const { skip, totalPages } = calculatePagination(page, limit, total);
    const complaints = await Complaint.find(filter).sort(sortStr).skip(skip).limit(limit).populate('studentId', 'name email department rollNumber registerNumber phone');

    res.status(200).json({ success: true, data: complaints, pagination: { page, limit, total, totalPages } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaints', error: (error as Error).message });
  }
};

// GET /api/admin/complaints/:complaintId
export const getComplaintById = async (req: Request, res: Response): Promise<void> => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId }).populate('studentId', 'name email department rollNumber registerNumber phone collegeType year section');
    if (!complaint) { res.status(404).json({ success: false, message: 'Complaint not found' }); return; }
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaint', error: (error as Error).message });
  }
};

// PUT /api/admin/complaints/:complaintId/status
export const updateComplaintStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, adminRemarks, resolutionNotes, assignedStaff, estimatedCompletion } = req.body;
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!complaint) { res.status(404).json({ success: false, message: 'Complaint not found' }); return; }

    const previousStatus = complaint.status;
    complaint.status = status;
    if (adminRemarks) complaint.adminRemarks = adminRemarks;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    if (assignedStaff) complaint.assignedStaff = assignedStaff;
    if (estimatedCompletion) complaint.estimatedCompletion = new Date(estimatedCompletion);
    if (status === ComplaintStatus.RESOLVED) complaint.resolvedAt = new Date();
    if (status === ComplaintStatus.RESOLVED || status === ComplaintStatus.CLOSED) complaint.actualCompletion = new Date();

    complaint.timeline.push({
      status, message: `Status changed from ${previousStatus} to ${status}${adminRemarks ? `. ${adminRemarks}` : ''}`,
      updatedBy: 'admin', updatedAt: new Date(),
    } as any);
    await complaint.save();

    const student = await Student.findById(complaint.studentId);
    if (student) {
      if (status === ComplaintStatus.ASSIGNED && assignedStaff) {
        await sendComplaintAssignedEmail(student.email, student.name, complaint.complaintId, assignedStaff);
      } else if (status === ComplaintStatus.RESOLVED) {
        await sendComplaintResolvedEmail(student.email, student.name, complaint.complaintId, resolutionNotes || '', adminRemarks || '');
      } else {
        await sendComplaintUpdatedEmail(student.email, student.name, complaint.complaintId, status, adminRemarks || '');
      }
      await Notification.create({
        studentId: complaint.studentId,
        title: 'Complaint Updated',
        message: `Your complaint ${complaint.complaintId} status changed to ${status}.`,
      });
    }

    res.status(200).json({ success: true, message: 'Complaint status updated', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update complaint', error: (error as Error).message });
  }
};

// POST /api/admin/complaints/:complaintId/remark
export const addRemark = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!complaint) { res.status(404).json({ success: false, message: 'Complaint not found' }); return; }

    complaint.adminRemarks = complaint.adminRemarks ? `${complaint.adminRemarks}\n${message}` : message;
    complaint.timeline.push({
      status: complaint.status, message, updatedBy: 'admin', updatedAt: new Date(),
    } as any);
    await complaint.save();

    const student = await Student.findById(complaint.studentId);
    if (student) {
      await sendComplaintUpdatedEmail(student.email, student.name, complaint.complaintId, complaint.status, message);
      await Notification.create({
        studentId: complaint.studentId,
        title: 'New Remark Added',
        message: `Admin added a remark to complaint ${complaint.complaintId}.`,
      });
    }

    res.status(200).json({ success: true, message: 'Remark added', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add remark', error: (error as Error).message });
  }
};

// GET /api/admin/students/export/csv
export const exportStudentsCSV = async (_req: Request, res: Response): Promise<void> => {
  try {
    const students = await Student.find().select('-password').sort('-createdAt');
    const headers = 'Name,Email,Roll Number,Register Number,Department,Year,Section,Phone,Verified,Active\n';
    const csv = students.map(s =>
      `${s.name},${s.email},${s.rollNumber},${s.registerNumber},${s.department},${s.year},${s.section},${s.phone},${s.verified},${s.isActive}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    res.status(200).send(headers + csv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export CSV', error: (error as Error).message });
  }
};
