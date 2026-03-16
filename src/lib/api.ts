import axios from "axios";

const api = axios.create({
  // Yahan apna Render ka backend URL dalo 
  // (e.g., https://battlebooyah-backend.onrender.com/api)
  baseURL: "https://battlebooyah-backend.onrender.com/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Har request ke saath token bhejne ke liye
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;