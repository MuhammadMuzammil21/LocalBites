import API from './axios';
import { User, AuthResponse, ForgotPasswordData, ResetPasswordData } from '../types';

export const authApi = {
  // Register new user
  register: async (userData: { name: string; email: string; password: string; role?: 'USER' | 'OWNER' | 'ADMIN' }): Promise<AuthResponse> => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await API.post('/auth/forgotpassword', data);
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, data: ResetPasswordData): Promise<AuthResponse> => {
    const response = await API.put(`/auth/resetpassword/${token}`, data);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await API.get('/auth/me');
    return response.data.success ? response.data.data : response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await API.put('/auth/profile', userData);
    return response.data.success ? response.data.data : response.data;
  },
};
