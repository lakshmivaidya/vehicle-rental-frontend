import axios from "axios";

// Backend URL on Vercel
export const api = axios.create({
  baseURL: "https://vehicle-rental-backend-sandy.vercel.app/api",
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
