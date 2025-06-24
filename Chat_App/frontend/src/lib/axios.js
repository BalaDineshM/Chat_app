import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chat-app-9qil.onrender.com/api",
  withCredentials: true,
});
