// client/src/api/config.js - مُحدث ومُصحح
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// إضافة token interceptor للطلبات الخارجة
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

// إضافة response interceptor للطلبات الداخلة
apiClient.interceptors.response.use(
  (response) => {
    // إرجاع البيانات مباشرة إذا كانت الاستجابة ناجحة
    return response.data;
  },
  (error) => {
    // معالجة أخطاء HTTP
    const errorMessage =
      error.response?.data?.message || error.message || "حدث خطأ غير متوقع";
    const statusCode = error.response?.status;

    // معالجة أخطاء خاصة
    if (statusCode === 401) {
      // انتهاء صلاحية الجلسة
      console.warn("Session expired - redirecting to login");
      localStorage.removeItem("authToken");

      // توجيه المستخدم لصفحة تسجيل الدخول
      if (
        window.location.pathname.startsWith("/admin") &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/admin/login";
      }
    } else if (statusCode === 403) {
      console.error("Access forbidden - insufficient permissions");
    } else if (statusCode === 404) {
      console.error("Resource not found");
    } else if (statusCode === 429) {
      console.error("Too many requests - rate limit exceeded");
    } else if (statusCode >= 500) {
      console.error("Server error occurred");
    }

    // طباعة تفاصيل الخطأ في وضع التطوير
    if (import.meta.env.DEV) {
      console.error("API Error Details:", {
        url: error.config?.url,
        method: error.config?.method,
        status: statusCode,
        message: errorMessage,
        data: error.response?.data,
      });
    }

    // إرجاع خطأ منسق
    const formattedError = {
      success: false,
      message: errorMessage,
      status: statusCode,
      data: error.response?.data,
    };

    return Promise.reject(formattedError);
  }
);

// دالة مساعدة لفحص حالة الاتصال
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

// دالة مساعدة لإعادة تعيين التوكن
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("authToken", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("authToken");
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// دالة مساعدة للحصول على التوكن الحالي
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// دالة مساعدة لفحص صحة التوكن
export const isTokenValid = () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // فحص أساسي لصيغة JWT
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // فك تشفير payload
    const payload = JSON.parse(atob(parts[1]));

    // فحص انتهاء الصلاحية
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token format:", error);
    return false;
  }
};

// تصدير معلومات الإعداد
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  environment: import.meta.env.MODE,
};
