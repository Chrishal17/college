import { Router } from 'express';
import { createComplaint, getMyComplaints, getComplaintById, addReply, acceptResolution, reopenComplaint } from '../controllers/complaint.controller';
import { createComplaintValidation, replyValidation, complaintQueryValidation } from '../validators/complaint.validator';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorizeStudent } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authenticate, authorizeStudent);
router.post('/', upload.array('images', 5), createComplaintValidation, validate, createComplaint);
router.get('/', complaintQueryValidation, validate, getMyComplaints);
router.get('/:complaintId', getComplaintById);
router.put('/:complaintId/reply', replyValidation, validate, addReply);
router.put('/:complaintId/accept', acceptResolution);
router.put('/:complaintId/reopen', reopenComplaint);

export default router;
