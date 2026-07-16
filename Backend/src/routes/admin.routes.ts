import { Router } from 'express';
import {
  getDashboard, getStudents, getStudentById, updateStudentStatus, deleteStudent,
  getComplaints, getComplaintById, updateComplaintStatus, addRemark, exportStudentsCSV,
} from '../controllers/admin.controller';
import { updateComplaintStatusValidation, replyValidation } from '../validators/complaint.validator';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorizeAdmin);
router.get('/dashboard', getDashboard);
router.get('/students', getStudents);
router.get('/students/export/csv', exportStudentsCSV);
router.get('/students/:id', getStudentById);
router.put('/students/:id/status', updateStudentStatus);
router.delete('/students/:id', deleteStudent);
router.get('/complaints', getComplaints);
router.get('/complaints/:complaintId', getComplaintById);
router.put('/complaints/:complaintId/status', updateComplaintStatusValidation, validate, updateComplaintStatus);
router.post('/complaints/:complaintId/remark', replyValidation, validate, addRemark);

export default router;
