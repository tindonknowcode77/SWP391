// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "https://localhost:7246/api",
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
  withCredentials: false,
});

axiosClient.interceptors.request.use(
  (config) => {
    // Sau này sẽ cấu hình tuỳ theo BE nha
    // const token = localStorage.getItem('access_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
