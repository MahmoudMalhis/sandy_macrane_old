
import { checkApiConnection } from "../api/config";
import useAuthStore from "../api/useAuthStore";
import { toast } from "react-hot-toast";

class AppInitializer {
  static eventHandlers = new Map();
  static initialized = false;
  static initializationPromise = null;

  static async initialize() {
    if (this.initialized) return true;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  static async _performInitialization() {
    try {
      const connectionStatus = await this._checkApiConnection();
      if (!connectionStatus.success) {
        throw new Error("Failed to connect to API");
      }

      await this._initializeAuth();

      await this._loadAppSettings();

      this._setupGlobalErrorHandlers();

      this._setupLocalization();

      console.log("✅ App initialized successfully");
      this.initialized = true;
      return { success: true };
    } catch (error) {
      console.error("❌ App initialization failed:", error);
      this._handleInitializationError(error);
      return { success: false, error: error.message };
    }
  }

  static async _checkApiConnection() {
    try {
      console.log("🔍 Checking API connection...");
      const status = await checkApiConnection();

      if (status.connected) {
        console.log("✅ API connection successful");
        return { success: true, status };
      } else {
        console.error("❌ API connection failed:", status);
        return { success: false, error: status.error };
      }
    } catch (error) {
      console.error("❌ API connection error:", error);
      return { success: false, error: error.message };
    }
  }

  static async _initializeAuth() {
    try {
      console.log("🔐 Initializing authentication...");
      const authStore = useAuthStore.getState();
      await authStore.initialize();
      console.log("✅ Authentication initialized");
    } catch (error) {
      console.error("❌ Authentication initialization failed:", error);
    }
  }

  static async _loadAppSettings() {
    try {
      console.log("⚙️ Loading app settings...");

      console.log("✅ App settings loaded");
    } catch (error) {
      console.warn("⚠️ Failed to load app settings:", error);
    }
  }

  static _setupGlobalErrorHandlers() {
    const unhandledRejectionHandler = (event) => {
      console.error("Unhandled Promise Rejection:", event.reason);
      if (event.reason?.message?.includes("Network Error")) {
        toast.error("فقدان الاتصال بالإنترنت");
      } else if (event.reason?.status === 500) {
        toast.error("حدث خطأ في الخادم");
      }
    };
    const errorHandler = (event) => {
      console.error("JavaScript Error:", event.error);
    };
    this.eventHandlers.set("unhandledrejection", unhandledRejectionHandler);
    this.eventHandlers.set("error", errorHandler);
    window.addEventListener("unhandledrejection", unhandledRejectionHandler);
    window.addEventListener("error", errorHandler);
  }

  static _setupLocalization() {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");

    document.documentElement.style.fontFamily =
      "Cairo, Tajawal, Arial, sans-serif";

    console.log("✅ Localization setup complete");
  }

  static _handleInitializationError(error) {
    if (error.message.includes("API")) {
      toast.error("فشل الاتصال بالخادم");
    } else {
      toast.error("حدث خطأ في تحميل التطبيق");
    }
  }

  static isInitialized() {
    return this.initialized;
  }

  static async reinitialize() {
    console.log("🔄 Reinitializing app...");
    this.initialized = false;
    this.initializationPromise = null;
    return this.initialize();
  }

  static cleanup() {
    console.log("🧹 Cleaning up app resources...");

    this.initialized = false;
    this.initializationPromise = null;

    console.log("✅ Cleanup complete");
  }
}

export default AppInitializer;
