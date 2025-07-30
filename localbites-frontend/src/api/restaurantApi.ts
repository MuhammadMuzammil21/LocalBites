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
}

export const restaurantApi = {
  // Search restaurants
  search: async (params: SearchParams): Promise<Restaurant[]> => {
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('q', params.q);
    if (params.location) queryParams.append('location', params.location);
    if (params.cuisine) queryParams.append('cuisine', params.cuisine);
    
    const response = await API.get(`/restaurants/search?${queryParams.toString()}`);
    return response.data;
  },

  // Get all restaurants
  getAll: async (): Promise<Restaurant[]> => {
    const response = await API.get('/restaurants');
    return response.data;
  },

  // Get restaurant by ID or slug
  getById: async (idOrSlug: string): Promise<Restaurant> => {
    const response = await API.get(`/restaurants/${idOrSlug}`);
    return response.data;
  },

  // Get nearby restaurants
  getNearby: async (lat: number, lng: number, radius: number = 5000): Promise<Restaurant[]> => {
    const response = await API.get(`/restaurants/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    return response.data;
  },
};
