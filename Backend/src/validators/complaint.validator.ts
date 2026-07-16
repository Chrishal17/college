import { body, query, param } from 'express-validator';

export const createComplaintValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ min: 10, max: 2000 }),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Valid priority required'),
  body('location.building').optional().trim(),
  body('location.floor').optional().trim(),
  body('location.roomNumber').optional().trim(),
  body('isAnonymous').optional().isBoolean(),
];

export const updateComplaintStatusValidation = [
  body('status').isIn(['Pending', 'Assigned', 'In Progress', 'Waiting for Student', 'Resolved', 'Closed', 'Rejected', 'Reopened']).withMessage('Valid status required'),
  body('adminRemarks').optional().trim(),
  body('resolutionNotes').optional().trim(),
  body('assignedStaff').optional().trim(),
  body('estimatedCompletion').optional().isISO8601(),
];

export const replyValidation = [
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
];

export const complaintQueryValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('status').optional().trim(),
  query('category').optional().trim(),
  query('priority').optional().trim(),
  query('search').optional().trim(),
  query('sort').optional().isIn(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'priority', '-priority', 'status', '-status']),
];
