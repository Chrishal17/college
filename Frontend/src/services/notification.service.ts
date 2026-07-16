import api from './api';

export const notificationService = {
  getNotifications: () => api.get('/api/notifications'),
  markRead: (id: string) => api.put(`/api/notifications/${id}/read`),
  markAllRead: () => api.put('/api/notifications/read-all'),
  deleteNotification: (id: string) => api.delete(`/api/notifications/${id}`),
};
