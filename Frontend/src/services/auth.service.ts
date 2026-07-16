import api from './api';

export const authService = {
  register: (data: Record<string, unknown>) => api.post('/api/auth/register', data),
  verifyOTP: (email: string, otp: string) => api.post('/api/auth/verify-otp', { email, otp }),
  resendOTP: (email: string) => api.post('/api/auth/resend-otp', { email }),
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  getMe: () => api.get('/api/auth/me'),
  forgotPassword: (email: string) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (email: string, otp: string, newPassword: string) => api.post('/api/auth/reset-password', { email, otp, newPassword }),
};
