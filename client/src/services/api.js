import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout on 401 from auth endpoints, not from match endpoints
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes("/auth/")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
