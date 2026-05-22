import axios from "axios";

export const api = axios.create({
  baseURL: "https://vehicle-rental-backend-beta.vercel.app/api",
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }


  } catch (err) {
    console.error("Token attach error:", err);
  }

  return config;
});
  
  
  //http://localhost:5000/api
  
