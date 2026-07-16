import api from './api';

export const adminService = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getStudents: (params?: Record<string, string>) => api.get('/api/admin/students', { params }),
  getStudentById: (id: string) => api.get(`/api/admin/students/${id}`),
  updateStudentStatus: (id: string, isActive: boolean) => api.put(`/api/admin/students/${id}/status`, { isActive }),
  deleteStudent: (id: string) => api.delete(`/api/admin/students/${id}`),
  getComplaints: (params?: Record<string, string>) => api.get('/api/admin/complaints', { params }),
  getComplaintById: (complaintId: string) => api.get(`/api/admin/complaints/${complaintId}`),
  updateComplaintStatus: (complaintId: string, data: Record<string, unknown>) => api.put(`/api/admin/complaints/${complaintId}/status`, data),
  addRemark: (complaintId: string, message: string) => api.post(`/api/admin/complaints/${complaintId}/remark`, { message }),
  exportStudentsCSV: () => api.get('/api/admin/students/export/csv', { responseType: 'blob' }),
};
