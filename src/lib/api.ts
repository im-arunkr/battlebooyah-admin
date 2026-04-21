import axios from "axios";

const api = axios.create({
  // Agar backend routes /api se start hote hain toh last me /api jor dena
  baseURL: "https://battlebooyah-backend.onrender.com", 
  //baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Token automatically har request ke header me jayega
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;