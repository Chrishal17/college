import { body, query, param } from 'express-validator';

export const updateProfileValidation = [
  body('phone').optional().trim().isMobilePhone('any').withMessage('Valid phone number required'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('department').optional().trim(),
  body('year').optional().isInt({ min: 1, max: 5 }),
  body('section').optional().trim(),
];

export const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

export const studentQueryValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('search').optional().trim(),
  query('department').optional().trim(),
  query('verified').optional().isBoolean().toBoolean(),
  query('isActive').optional().isBoolean().toBoolean(),
  query('sort').optional().trim(),
];
