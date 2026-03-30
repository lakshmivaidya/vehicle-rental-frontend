import axios from "axios";

export const api = axios.create({
  baseURL: "https://vehicle-rental-backend-mu.vercel.app/api",
});