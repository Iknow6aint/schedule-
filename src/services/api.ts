/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://schedule-app-73c2.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints for authentication
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; name: string }) =>
    api.post('/auth/register', userData),
  resetPassword: (email: string) =>
    api.post('/auth/reset-password', { email }),
};

// API endpoints for schedules
export const schedulesApi = {
  getAll: () => api.get('/schedules'),
  getById: (id: number) => api.get(`/schedules/${id}`),
  create: (scheduleData: any) => api.post('/schedules', scheduleData),
  update: (id: number, scheduleData: any) =>
    api.put(`/schedules/${id}`, scheduleData),
  delete: (id: number) => api.delete(`/schedules/${id}`),
  getStats: () => api.get('/schedules/stats'),
};

// API endpoints for notifications
export const notificationsApi = {
  getCustomers: () => api.get('/notifications/customers'),
  sendCustomNotification: (data: {
    customerIds: string[];
    message: string;
    channel: 'email' | 'sms' | 'whatsapp';
  }) => api.post('/notifications/send', data),
  getHistory: () => api.get('/notifications/history'),
};

export default api;