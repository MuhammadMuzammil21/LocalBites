// src/api/restaurantApi.ts
import axios from 'axios';

export const fetchRestaurants = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/restaurants`);
  return response.data;
};
