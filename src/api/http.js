// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "https://localhost:7246/api",
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (nếu có) để gửi trong header
    const user = localStorage.getItem('hivAppUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    // Log response để debug
    console.log('API response:', response.data);
    return response.data;
  },
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
