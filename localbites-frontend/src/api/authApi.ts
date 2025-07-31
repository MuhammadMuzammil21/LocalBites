import API from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'OWNER' | 'ADMIN';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export const authApi = {
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await API.post('/auth/login', credentials);
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
