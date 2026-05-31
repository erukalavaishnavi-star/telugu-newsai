import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
  AuthTokens,
  GenerateRequest,
  GeneratedContent,
  HistoryResponse,
  DashboardStats,
  ApiResponse,
} from '@/types';

const baseURL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001') + '/api/v1';

const api = axios.create({
  baseURL,
  timeout: 90000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (!path.startsWith('/auth')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? err.message ?? 'Request failed';
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthTokens> => {
    const res = await api.post<ApiResponse<AuthTokens>>('/auth/login', { email, password });
    return res.data.data;
  },

  signup: async (payload: {
    email: string;
    password: string;
    name: string;
    orgName?: string;
  }): Promise<AuthTokens> => {
    const res = await api.post<ApiResponse<AuthTokens>>('/auth/signup', payload);
    return res.data.data;
  },

  refresh: async (refreshToken: string): Promise<{ token: string }> => {
    const res = await api.post<ApiResponse<{ token: string }>>('/auth/refresh', { refreshToken });
    return res.data.data;
  },
};

export const generateApi = {
  generate: async (payload: GenerateRequest): Promise<GeneratedContent> => {
    const res = await api.post<ApiResponse<GeneratedContent>>('/generate', payload);
    return res.data.data;
  },
};

export const historyApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<HistoryResponse> => {
    const res = await api.get<ApiResponse<HistoryResponse>>('/history', { params });
    return res.data.data;
  },

  getById: async (id: string): Promise<GeneratedContent> => {
    const res = await api.get<ApiResponse<GeneratedContent>>(`/history/${id}`);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/history/${id}`);
  },
};

export const statsApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const res = await api.get<ApiResponse<DashboardStats>>('/stats');
    return res.data.data;
  },
};

export default api;
