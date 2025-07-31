export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
  token: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  image: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
  phone: string;
  hours: {
    [key: string]: string;
  };
  isOpen: boolean;
  featured: boolean;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurant: string;
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  restaurant: Restaurant;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}
