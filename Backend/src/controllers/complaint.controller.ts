import { Request, Response } from 'express';
import Complaint from '../models/Complaint.model';
import Notification from '../models/Notification.model';
import Student from '../models/Student.model';
import { AuthRequest, ComplaintStatus } from '../types';
import { generateComplaintId, calculatePagination } from '../utils/helpers';
import { sendComplaintSubmittedEmail, sendComplaintUpdatedEmail, sendComplaintAssignedEmail, sendComplaintResolvedEmail, sendComplaintClosedEmail } from '../services/email.service';

// POST /api/complaints
export const createComplaint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, priority, location, isAnonymous } = req.body;
    const complaintId = generateComplaintId();
    const images = (req.files as Express.Multer.File[])?.map((f) => f.filename) || [];

    const complaint = await Complaint.create({
      complaintId, studentId: req.user?.id, title, description, category,
      priority: priority || 'Medium', location: location || {}, images,
      isAnonymous: isAnonymous || false, status: ComplaintStatus.PENDING,
      timeline: [{
        status: ComplaintStatus.PENDING, message: 'Complaint submitted',
        updatedBy: req.user?.id, updatedAt: new Date(),
      }],
    });

    const student = await Student.findById(req.user?.id);
    if (student) {
      await sendComplaintSubmittedEmail(student.email, student.name, complaintId, title);
      await Notification.create({
        studentId: req.user?.id,
        title: 'Complaint Submitted',
        message: `Your complaint ${complaintId} has been submitted successfully.`,
      });
    }

    res.status(201).json({ success: true, message: 'Complaint submitted successfully', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create complaint', error: (error as Error).message });
  }
};

// GET /api/complaints
export const getMyComplaints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { status, category, priority, search, sort } = req.query;

    const filter: Record<string, unknown> = { studentId: req.user?.id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
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
    const complaints = await Complaint.find(filter).sort(sortStr).skip(skip).limit(limit);

    res.status(200).json({
      success: true, data: complaints,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaints', error: (error as Error).message });
  }
};

// GET /api/complaints/:complaintId
export const getComplaintById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!complaint) { res.status(404).json({ success: false, message: 'Complaint not found' }); return; }
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch complaint', error: (error as Error).message });
  }
};

// PUT /api/complaints/:complaintId/reply
export const addReply = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!complaint) { res.status(404).json({ success: false, message: 'Complaint not found' }); return; }

    complaint.timeline.push({
      status: complaint.status,
      message,
      updatedBy: req.user?.id,
      updatedAt: new Date(),
    } as any);
    await complaint.save();

    res.status(200).json({ success: true, message: 'Reply added successfully', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add reply', error: (error as Error).message });
  }
};

// PUT /api/complaints/:complaintId/accept
export const acceptResolution = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!complaint) { res.status(404).json({ success: false, message: 'Complaint not found' }); return; }
    if (complaint.status !== ComplaintStatus.RESOLVED) {
      res.status(400).json({ success: false, message: 'Complaint is not in resolved status' }); return;
    }

    complaint.status = ComplaintStatus.CLOSED;
    complaint.timeline.push({
      status: ComplaintStatus.CLOSED, message: 'Resolution accepted by student',
      updatedBy: req.user?.id, updatedAt: new Date(),
    } as any);
    await complaint.save();

    const student = await Student.findById(complaint.studentId);
    if (student) {
      await sendComplaintClosedEmail(student.email, student.name, complaint.complaintId);
      await Notification.create({
        studentId: complaint.studentId,
        title: 'Complaint Closed',
        message: `Your complaint ${complaint.complaintId} has been closed.`,
      });
    }

    res.status(200).json({ success: true, message: 'Resolution accepted', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to accept resolution', error: (error as Error).message });
  }
};

// PUT /api/complaints/:complaintId/reopen
export const reopenComplaint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });
    if (!complaint) { res.status(404).json({ success: false, message: 'Complaint not found' }); return; }

    complaint.status = ComplaintStatus.REOPENED;
    complaint.timeline.push({
      status: ComplaintStatus.REOPENED, message: message || 'Complaint reopened by student',
      updatedBy: req.user?.id, updatedAt: new Date(),
    } as any);
    await complaint.save();

    res.status(200).json({ success: true, message: 'Complaint reopened', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reopen complaint', error: (error as Error).message });
  }
};
