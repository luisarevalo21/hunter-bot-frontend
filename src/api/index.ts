import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 60000, // 60 second timeout to account for server wake-up time
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === "ECONNABORTED") {
      error.message = "The request took too long. The server might be waking up, please try again.";
    }
    return Promise.reject(error);
  }
);

export default api;
