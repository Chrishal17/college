import { Router } from 'express';
import { getNotifications, markAllRead, markRead, deleteNotification } from '../controllers/notification.controller';
import { authenticate, authorizeStudent } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeStudent);
router.get('/', getNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);
router.delete('/:id', deleteNotification);

export default router;
