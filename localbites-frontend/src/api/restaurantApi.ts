// src/api/restaurantApi.ts
import API from './axios';

export interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  cuisines?: string[];
  address?: {
    street?: string;
    city?: string;
    country?: string;
    area?: string;
  } | string;
  phone?: string;
  website?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  slug?: string;
  owner_id?: string;
  avg_rating?: number;
  review_count?: number;
  is_verified?: boolean;
  price_range?: string;
  images?: {
    cover?: string;
    gallery?: string[];
  };
  hours?: Record<string, string[]>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchParams {
  q?: string;
  location?: string;
  cuisine?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const restaurantApi = {
  // Search restaurants
  search: async (params: SearchParams): Promise<Restaurant[]> => {
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('q', params.q);
    if (params.location) queryParams.append('location', params.location);
    if (params.cuisine) queryParams.append('cuisine', params.cuisine);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await API.get(`/restaurants/search?${queryParams.toString()}`);
    
    // Handle both old and new API response formats
    if (response.data.success) {
      return response.data.data;
    }
    return response.data;
  },

  // Get all restaurants
  getAll: async (page: number = 1, limit: number = 20): Promise<ApiResponse<Restaurant[]>> => {
    const response = await API.get(`/restaurants?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get restaurant by ID or slug
  getById: async (idOrSlug: string): Promise<Restaurant> => {
    const response = await API.get(`/restaurants/${idOrSlug}`);
    
    // Handle both old and new API response formats
    if (response.data.success) {
      return response.data.data;
    }
    return response.data;
  },

  // Get nearby restaurants
  getNearby: async (lat: number, lng: number, radius: number = 5000): Promise<Restaurant[]> => {
    const response = await API.get(`/restaurants/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    
    // Handle both old and new API response formats
    if (response.data.success) {
      return response.data.data;
    }
    return response.data;
  },

  // Get GeoJSON data for map
  getGeoJSON: async (): Promise<any> => {
    const response = await API.get('/restaurants/geojson');
    
    // Handle both old and new API response formats
    if (response.data.success) {
      return response.data.data;
    }
    return response.data;
  },
};
