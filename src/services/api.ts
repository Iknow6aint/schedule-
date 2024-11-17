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

  create: async (scheduleData: any) => {
    try {
      const response = await api.post('/schedules', scheduleData, {
        validateStatus: (status) => status < 500, // Allow non-fatal status codes to pass
      });
      console.log('Schedule created successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error; // Rethrow for caller handling
    }
  },

  update: async (id: number, scheduleData: any) => {
    try {
      const response = await api.put(`/schedules/${id}`, scheduleData, {
        validateStatus: (status) => status < 500,
      });
      console.log('Schedule updated successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      const response = await api.delete(`/schedules/${id}`, {
        validateStatus: (status) => status < 500,
      });
      console.log('Schedule deleted successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },

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