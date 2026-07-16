import { Router } from 'express';
import { getProfile, updateProfile, updatePassword, getDashboardStats } from '../controllers/student.controller';
import { updateProfileValidation, updatePasswordValidation } from '../validators/student.validator';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorizeStudent } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeStudent);
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, validate, updateProfile);
router.put('/password', updatePasswordValidation, validate, updatePassword);
router.get('/dashboard-stats', getDashboardStats);

export default router;
