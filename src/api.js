import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically for every request
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ❌ DO NOT force Content-Type globally
    // Let browser decide (VERY IMPORTANT for FormData)

  } catch (err) {
    console.error("Token attach error:", err);
  }

  return config;
});
  
  //"https://vehicle-rental-backend-mu.vercel.app/api",
  //http://localhost:5000/api
