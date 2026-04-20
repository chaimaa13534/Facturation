import axios from 'axios';

const API_URL = 'http://localhost:5000';


const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});


axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('JSON Server Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to JSON Server on port 5000. Make sure to run: npm run server');
    }
    return Promise.reject(error);
  }
);

export const jsonService = {
  getArticles: async () => {
    try {
      const response = await axiosInstance.get('/articles');
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error.message);
      return []; // Retourne un tableau vide en cas d'erreur
    }
  },
  
  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      return [];
    }
  },
  
  getParametres: async () => {
    try {
      const response = await axiosInstance.get('/parametres');
      return response.data;
    } catch (error) {
      console.error('Error fetching parametres:', error.message);
      return {};
    }
  }
};