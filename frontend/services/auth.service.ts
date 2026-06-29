import api from '../lib/api';
import { LoginForm, RegisterClientForm, RegisterPartnerForm, User, Partner } from '../types';

/**
 * Helper to store tokens after authentication.
 * Sets access_token in localStorage AND as a cookie (for middleware).
 * Stores refresh_token in localStorage for silent refresh.
 */
function storeTokens(data: { accessToken?: string; refreshToken?: string }) {
  if (typeof window === 'undefined') return;

  if (data.accessToken) {
    localStorage.setItem('access_token', data.accessToken);
    // Set cookie for Next.js middleware to read (7 day max-age, will be refreshed)
    document.cookie = `access_token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
  if (data.refreshToken) {
    localStorage.setItem('refresh_token', data.refreshToken);
  }
}

export const AuthService = {
  login: async (data: LoginForm) => {
    const response = await api.post('/auth/login', data);
    const result = response.data.data;
    storeTokens(result);
    return result;
  },

  registerClient: async (data: RegisterClientForm) => {
    const response = await api.post('/auth/register/client', data);
    // Registration no longer returns tokens — account must be verified via OTP first
    return response.data.data ?? response.data;
  },

  registerPartner: async (data: RegisterPartnerForm) => {
    const response = await api.post('/auth/register/partner', data);
    // Registration no longer returns tokens — account must be verified via OTP first
    return response.data.data ?? response.data;
  },

  verifyEmail: async (data: { email: string; code: string }) => {
    const response = await api.post('/auth/verify-email', data);
    // Returns { accessToken, refreshToken, user } — caller stores tokens
    return response.data?.data ?? response.data;
  },

  resendVerification: async (data: { email: string }) => {
    const response = await api.post('/auth/resend-verification', data);
    return response.data;
  },

  getProfile: async (): Promise<User & { partner?: Partner }> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data);
    return response.data?.data ?? response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },

  changePassword: async (data: any) => {
    const response = await api.put('/users/change-password', data);
    return response.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: { token: string; password: string; confirmPassword: string }) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.put('/users/profile/avatar', formData);
    return response.data?.data ?? response.data;
  },
};
