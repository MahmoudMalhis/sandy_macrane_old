import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;
    const errorMessage =
      error.response?.data?.message || error.message || "حدث خطأ غير متوقع";

    if (statusCode === 429) {
      console.warn("⏳ Rate limit exceeded - waiting before retry");
      
      if (!originalRequest._isRateLimitRetry) {
        originalRequest._isRateLimitRetry = true;
                await new Promise((resolve) => setTimeout(resolve, 15000));
                return Promise.reject({
          success: false,
          message: "تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً.",
          status: 429,
          shouldRetry: false,
        });
      }
    }
    if (statusCode === 401) {
      console.warn("Session expired - redirecting to login");
      localStorage.removeItem("authToken");

      if (
        window.location.pathname.startsWith("/admin") &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/admin/login";
      }
    }
    
    return Promise.reject({
      success: false,
      message: errorMessage,
      status: statusCode,
    });
  }
);

export const checkApiConnection = async () => {
  try {
    const response = await apiClient.get("/health");
    return {
      connected: true,
      status: response.status || "OK",
      timestamp: response.timestamp,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      baseURL: API_BASE_URL,
    };
  }
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("authToken", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("authToken");
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const isTokenValid = () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token format:", error);
    return false;
  }
};

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  environment: import.meta.env.MODE,
};
