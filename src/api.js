import axios from "axios";

export const api = axios.create({
  baseURL: "https://vehicle-rental-backend-2egp.onrender.com/api",
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
  
  //"https://vehicle-rental-backend-mu.vercel.app/api",
  //http://localhost:5000/api
  // https://vehicle-rental-backend-2egp.onrender.com/
