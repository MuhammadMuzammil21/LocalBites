import API from './axios';

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  restaurant: string;
  image?: string;
  isAvailable: boolean;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemData {
  name: string;
  description?: string;
  price: number;
  category: string;
  restaurant: string;
  image?: string;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export const menuApi = {
  // Get menu items for a restaurant
  getMenuItems: async (restaurantId: string): Promise<MenuItem[]> => {
    const response = await API.get(`/menu/${restaurantId}`);
    return response.data.success ? response.data.data : response.data;
  },

  // Get single menu item
  getMenuItem: async (itemId: string): Promise<MenuItem> => {
    const response = await API.get(`/menu/item/${itemId}`);
    return response.data.success ? response.data.data : response.data;
  },

  // Create new menu item (for restaurant owners)
  createMenuItem: async (restaurantId: string, itemData: CreateMenuItemData): Promise<MenuItem> => {
    const response = await API.post(`/menu/${restaurantId}`, itemData);
    return response.data.success ? response.data.data : response.data;
  },

  // Update menu item
  updateMenuItem: async (itemId: string, itemData: Partial<CreateMenuItemData>): Promise<MenuItem> => {
    const response = await API.put(`/menu/item/${itemId}`, itemData);
    return response.data.success ? response.data.data : response.data;
  },

  // Delete menu item
  deleteMenuItem: async (itemId: string): Promise<void> => {
    const response = await API.delete(`/menu/item/${itemId}`);
    return response.data;
  },

  // Search menu items across restaurants
  searchMenuItems: async (query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    restaurant?: string;
  }): Promise<MenuItem[]> => {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.restaurant) params.append('restaurant', filters.restaurant);

    const response = await API.get(`/menu/search?${params.toString()}`);
    return response.data.success ? response.data.data : response.data;
  },
};
