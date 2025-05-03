import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use Vite's env variable prefix
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;