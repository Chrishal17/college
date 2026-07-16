import api from './api';

export const studentService = {
  getProfile: () => api.get('/api/students/profile'),
  updateProfile: (data: Record<string, unknown>) => api.put('/api/students/profile', data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) => api.put('/api/students/password', data),
  getDashboardStats: () => api.get('/api/students/dashboard-stats'),
};
