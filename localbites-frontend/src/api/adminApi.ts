import API from './axios';
import { Order } from './orderApi';
import { Restaurant } from './restaurantApi';

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalRestaurants: number;
  totalUsers: number;
  ordersToday: number;
  revenueToday: number;
  averageOrderValue: number;
  topRestaurants: {
    restaurant: Restaurant;
    orderCount: number;
    revenue: number;
  }[];
}

export interface OrdersByDate {
  date: string;
  count: number;
  revenue: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminApi = {
  // Get all orders (admin only)
  getAllOrders: async (page: number = 1, limit: number = 20, filters?: {
    status?: string;
    restaurant?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.restaurant) params.append('restaurant', filters.restaurant);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const response = await API.get(`/admin/orders?${params.toString()}`);
    return response.data.success ? response.data : response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await API.put(`/admin/orders/${orderId}/status`, { status });
    return response.data.success ? response.data.data : response.data;
  },

  // Get admin statistics
  getStats: async (): Promise<AdminStats> => {
    const response = await API.get('/admin/stats');
    return response.data.success ? response.data.data : response.data;
  },

  // Get total orders
  getTotalOrders: async (): Promise<{ total: number; today: number }> => {
    const response = await API.get('/admin/stats/orders');
    return response.data.success ? response.data.data : response.data;
  },

  // Get total revenue
  getTotalRevenue: async (): Promise<{ total: number; today: number }> => {
    const response = await API.get('/admin/stats/revenue');
    return response.data.success ? response.data.data : response.data;
  },

  // Get orders by date
  getOrdersByDate: async (days: number = 30): Promise<OrdersByDate[]> => {
    const response = await API.get(`/admin/stats/orders-by-date?days=${days}`);
    return response.data.success ? response.data.data : response.data;
  },

  // Get orders by status
  getOrdersByStatus: async (): Promise<OrdersByStatus[]> => {
    const response = await API.get('/admin/stats/status');
    return response.data.success ? response.data.data : response.data;
  },

  // Get top restaurants
  getTopRestaurants: async (limit: number = 10): Promise<{
    restaurant: Restaurant;
    orderCount: number;
    revenue: number;
  }[]> => {
    const response = await API.get(`/admin/stats/top-restaurants?limit=${limit}`);
    return response.data.success ? response.data.data : response.data;
  },

  // Get all restaurants (admin management)
  getAllRestaurants: async (page: number = 1, limit: number = 20): Promise<{
    restaurants: Restaurant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const response = await API.get(`/admin/restaurants?page=${page}&limit=${limit}`);
    return response.data.success ? response.data : response.data;
  },

  // Approve/reject restaurant
  updateRestaurantStatus: async (restaurantId: string, isVerified: boolean): Promise<Restaurant> => {
    const response = await API.put(`/admin/restaurants/${restaurantId}/status`, { isVerified });
    return response.data.success ? response.data.data : response.data;
  },

  // Delete restaurant (admin only)
  deleteRestaurant: async (restaurantId: string): Promise<void> => {
    const response = await API.delete(`/admin/restaurants/${restaurantId}`);
    return response.data;
  },

  // Get all users (admin management)
  getAllUsers: async (page: number = 1, limit: number = 20): Promise<{
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const response = await API.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data.success ? response.data.data : response.data;
  },

  // Update user status
  updateUserStatus: async (userId: string, isActive: boolean): Promise<void> => {
    const response = await API.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId: string): Promise<void> => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  },
};
