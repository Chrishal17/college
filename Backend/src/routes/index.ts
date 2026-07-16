import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import complaintRoutes from './complaint.routes';
import adminRoutes from './admin.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/students', studentRoutes);
router.use('/api/complaints', complaintRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/notifications', notificationRoutes);

export default router;
