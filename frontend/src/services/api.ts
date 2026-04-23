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
  listUsers: (search?: string) => 
    apiClient.get('/auth/users', { params: search ? { search } : {} }),
};

export const documentAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  analyze: (
    documentId: string,
    filters?: {
      excludeQuotes?: boolean;
      excludeBibliography?: boolean;
      excludeSmallMatchesUnderWords?: number;
    }
  ) => apiClient.post(`/documents/${documentId}/analyze`, filters || {}),
  humanize: (documentId: string, data: any) =>
    apiClient.post(`/documents/${documentId}/humanize`, data),
  upsertFeedback: (
    documentId: string,
    feedback: {
      quickMarks?: string[];
      inlineComments?: Array<{ text: string; startIndex: number; endIndex: number }>;
      rubricScore?: number;
      audioFeedbackUrl?: string;
    }
  ) => apiClient.post(`/documents/${documentId}/feedback`, feedback),
  getDocument: (documentId: string) =>
    apiClient.get(`/documents/${documentId}`),
  listDocuments: () => apiClient.get('/documents'),
  deleteDocument: (documentId: string) =>
    apiClient.delete(`/documents/${documentId}`),
};

export const assignmentAPI = {
  create: (data: any) => apiClient.post('/assignments', data),
  list: () => apiClient.get('/assignments'),
  get: (assignmentId: string) => apiClient.get(`/assignments/${assignmentId}`),
  update: (assignmentId: string, data: any) =>
    apiClient.put(`/assignments/${assignmentId}`, data),
  delete: (assignmentId: string) => apiClient.delete(`/assignments/${assignmentId}`),
};

export const peerReviewAPI = {
  assign: (assignmentId: string, data: { reviewerId: string; revieweeDocumentId: string }) =>
    apiClient.post(`/peer-reviews/assignments/${assignmentId}`, data),
  listForAssignment: (assignmentId: string) =>
    apiClient.get(`/peer-reviews/assignments/${assignmentId}`),
  submit: (
    reviewId: string,
    data: {
      comments: Array<{ text: string; startIndex: number; endIndex: number }>;
      rubricScores: Array<{ criterionTitle: string; score: number; maxPoints: number }>;
    }
  ) => apiClient.post(`/peer-reviews/${reviewId}/submit`, data),
};

export default apiClient;
