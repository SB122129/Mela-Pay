import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Courses API
export const coursesAPI = {
  getAll: (params) => api.get('/api/mela/courses', { params }),
  getById: (id) => api.get(`/api/mela/courses/${id}`),
  getFeatured: () => api.get('/api/mela/courses/featured'),
  search: (query) => api.get('/api/mela/courses/search', { params: { q: query } }),
  getStats: () => api.get('/api/mela/courses/stats'),
};

// Payments API
export const paymentsAPI = {
  create: (data) => api.post('/api/mela/payments/create', data),
  getStatus: (id) => api.get(`/api/mela/payments/${id}`),
  simulate: (id) => api.post(`/api/mela/payments/${id}/simulate`),
};

// Admin API
export const adminAPI = {
  login: (credentials) => api.post('/api/mela/admin/login', credentials),
  getDashboard: () => api.get('/api/mela/admin/dashboard'),
  getPayments: (params) => api.get('/api/mela/admin/payments', { params }),
  getAnalytics: (params) => api.get('/api/mela/admin/analytics', { params }),
};

// Auth API
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/api/auth/profile'),
  getPurchasedCourses: () => api.get('/api/auth/courses'),
};

export default api;
