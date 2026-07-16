import api from './api';

export const complaintService = {
  create: (formData: FormData) => api.post('/api/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyComplaints: (params?: Record<string, string>) => api.get('/api/complaints', { params }),
  getById: (complaintId: string) => api.get(`/api/complaints/${complaintId}`),
  addReply: (complaintId: string, message: string) => api.put(`/api/complaints/${complaintId}/reply`, { message }),
  acceptResolution: (complaintId: string) => api.put(`/api/complaints/${complaintId}/accept`),
  reopen: (complaintId: string, message?: string) => api.put(`/api/complaints/${complaintId}/reopen`, { message }),
};
