import API from './axios';

export interface OrderItem {
  menuItem: {
    _id: string;
    name: string;
    price: number;
    restaurant: {
      _id: string;
      name: string;
    };
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  restaurant: {
    _id: string;
    name: string;
    address: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  deliveryAddress: {
    street: string;
    city: string;
    postalCode?: string;
    instructions?: string;
  };
  paymentMethod: 'CASH' | 'CARD' | 'ONLINE';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  restaurant: string;
  items: {
    menuItem: string;
    quantity: number;
  }[];
  deliveryAddress: {
    street: string;
    city: string;
    postalCode?: string;
    instructions?: string;
  };
  paymentMethod: 'CASH' | 'CARD' | 'ONLINE';
}

export const orderApi = {
  // Place new order
  placeOrder: async (orderData: CreateOrderData): Promise<Order> => {
    const response = await API.post('/orders', orderData);
    return response.data.success ? response.data.data : response.data;
  },

  // Get user's orders
  getUserOrders: async (page: number = 1, limit: number = 10): Promise<{
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const response = await API.get(`/orders?page=${page}&limit=${limit}`);
    return response.data.success ? response.data : response.data;
  },

  // Get single order
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await API.get(`/orders/${orderId}`);
    return response.data.success ? response.data.data : response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await API.put(`/orders/${orderId}/cancel`);
    return response.data.success ? response.data.data : response.data;
  },

  // Track order
  trackOrder: async (orderId: string): Promise<{
    order: Order;
    tracking: {
      status: string;
      timestamp: string;
      location?: string;
      estimatedArrival?: string;
    }[];
  }> => {
    const response = await API.get(`/orders/${orderId}/track`);
    return response.data.success ? response.data.data : response.data;
  },

  // Rate order
  rateOrder: async (orderId: string, rating: number, review?: string): Promise<Order> => {
    const response = await API.post(`/orders/${orderId}/rate`, {
      rating,
      review
    });
    return response.data.success ? response.data.data : response.data;
  },
};
