// lib/api.ts
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Biến để theo dõi số lần retry
let refreshRetryCount = 0;
const MAX_REFRESH_RETRIES = 1;

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

// Request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  const store = useAuthStore.getState();
  const { accessToken, refreshToken } = store;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (refreshToken) {
    config.headers['x-refresh-token'] = refreshToken;
  }

  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu đây là request refresh token, không retry
    const isRefreshRequest =
      await originalRequest.url?.includes('/auth/refreshAT');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      refreshRetryCount < MAX_REFRESH_RETRIES
    ) {
      originalRequest._retry = true;
      refreshRetryCount++;

      try {
        const success = await useAuthStore.getState().refreshAccessToken();
        console.log('success? ', success);
        if (success) {
          const { accessToken } = useAuthStore.getState();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
        throw new Error('Refresh token failed');
      } catch (refreshError) {
        useAuthStore.getState().clearTokens();
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response.data.error);
  },
);

// ✅ Đây là hàm mà Orval cần — nó nhận config và trả về promise
export const api = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance.request(config);
};
