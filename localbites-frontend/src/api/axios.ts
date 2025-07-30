import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export default api; 