import { Router } from 'express';
import { register, verifyOTPHandler, resendOTP, login, getMe, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { registerValidation, loginValidation, verifyOTPValidation, forgotPasswordValidation, resetPasswordValidation } from '../validators/auth.validator';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/verify-otp', verifyOTPValidation, validate, verifyOTPHandler);
router.post('/resend-otp', forgotPasswordValidation, validate, resendOTP);
router.post('/login', loginValidation, validate, login);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);

export default router;
