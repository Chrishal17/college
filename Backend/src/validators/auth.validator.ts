import { body } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').optional().custom((value, { req }) => {
    if (value && value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  body('registerNumber').trim().notEmpty().withMessage('Register number is required'),
  body('collegeType').isIn(['Engineering', 'Technology']).withMessage('Valid college type is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('year').custom((value) => {
    const num = Number(value);
    if (isNaN(num) || num < 1 || num > 5) throw new Error('Year must be between 1 and 5');
    return true;
  }),
  body('section').trim().notEmpty().withMessage('Section is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required').isLength({ min: 7, max: 15 }).withMessage('Valid phone number required'),
];

export const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const verifyOTPValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits').isNumeric(),
];

export const forgotPasswordValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
];

export const resetPasswordValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits').isNumeric(),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
