import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
};

export const documentAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  analyze: (documentId: string) =>
    apiClient.post(`/documents/${documentId}/analyze`),
  humanize: (documentId: string, data: any) =>
    apiClient.post(`/documents/${documentId}/humanize`, data),
  getDocument: (documentId: string) =>
    apiClient.get(`/documents/${documentId}`),
  listDocuments: () => apiClient.get('/documents'),
  deleteDocument: (documentId: string) =>
    apiClient.delete(`/documents/${documentId}`),
};

export default apiClient;
