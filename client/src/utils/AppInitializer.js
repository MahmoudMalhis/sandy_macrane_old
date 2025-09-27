// client/src/utils/AppInitializer.js - إعداد التطبيق وإدارة البيانات الأولية
import { checkApiConnection } from "../api/config";
import useAuthStore from "../api/useAuthStore";
import { toast } from "react-hot-toast";

class AppInitializer {
  static initialized = false;
  static initializationPromise = null;

  // تهيئة التطبيق
  static async initialize() {
    // منع التهيئة المتعددة
    if (this.initialized) return true;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  static async _performInitialization() {
    try {
      console.log("🚀 Initializing Sandy Macrame App...");

      // 1. فحص الاتصال بالـ API
      const connectionStatus = await this._checkApiConnection();
      if (!connectionStatus.success) {
        throw new Error("Failed to connect to API");
      }

      // 2. تهيئة store المصادقة
      await this._initializeAuth();

      // 3. تحميل الإعدادات العامة (إذا لزم الأمر)
      await this._loadAppSettings();

      // 4. إعداد معالجات الأخطاء العامة
      this._setupGlobalErrorHandlers();

      // 5. إعداد اللغة والتوطين
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

  // فحص الاتصال بالـ API
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

  // تهيئة المصادقة
  static async _initializeAuth() {
    try {
      console.log("🔐 Initializing authentication...");
      const authStore = useAuthStore.getState();
      await authStore.initialize();
      console.log("✅ Authentication initialized");
    } catch (error) {
      console.error("❌ Authentication initialization failed:", error);
      // لا نرمي خطأ هنا لأن فشل المصادقة لا يجب أن يوقف التطبيق
    }
  }

  // تحميل الإعدادات العامة
  static async _loadAppSettings() {
    try {
      console.log("⚙️ Loading app settings...");

      // يمكن إضافة تحميل الإعدادات العامة هنا
      // مثل إعدادات الموقع، الألوان، الخطوط، إلخ

      console.log("✅ App settings loaded");
    } catch (error) {
      console.warn("⚠️ Failed to load app settings:", error);
      // الإعدادات اختيارية، لا نرمي خطأ
    }
  }

  // إعداد معالجات الأخطاء العامة
  static _setupGlobalErrorHandlers() {
    // معالج الأخطاء غير المعالجة
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled Promise Rejection:", event.reason);

      // عرض رسالة خطأ للمستخدم في حالات معينة
      if (event.reason?.message?.includes("Network Error")) {
        toast.error("فقدان الاتصال بالإنترنت");
      } else if (event.reason?.status === 500) {
        toast.error("حدث خطأ في الخادم");
      }
    });

    // معالج الأخطاء JavaScript
    window.addEventListener("error", (event) => {
      console.error("JavaScript Error:", event.error);
    });

    console.log("✅ Global error handlers setup");
  }

  // إعداد اللغة والتوطين
  static _setupLocalization() {
    // إعداد اتجاه النص للعربية
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");

    // إعداد الخطوط العربية
    document.documentElement.style.fontFamily =
      "Cairo, Tajawal, Arial, sans-serif";

    console.log("✅ Localization setup complete");
  }

  // معالجة أخطاء التهيئة
  static _handleInitializationError(error) {
    // عرض رسالة خطأ للمستخدم
    if (error.message.includes("API")) {
      toast.error("فشل الاتصال بالخادم");
    } else {
      toast.error("حدث خطأ في تحميل التطبيق");
    }

    // يمكن إضافة منطق إضافي هنا مثل:
    // - تسجيل الأخطاء في خدمة مراقبة
    // - عرض صفحة خطأ مخصصة
    // - محاولة الإعادة التلقائية
  }

  // فحص ما إذا كان التطبيق مُهيأ
  static isInitialized() {
    return this.initialized;
  }

  // إعادة تهيئة التطبيق (في حالة الحاجة)
  static async reinitialize() {
    console.log("🔄 Reinitializing app...");
    this.initialized = false;
    this.initializationPromise = null;
    return this.initialize();
  }

  // تنظيف الموارد عند إغلاق التطبيق
  static cleanup() {
    console.log("🧹 Cleaning up app resources...");

    // تنظيف المتغيرات
    this.initialized = false;
    this.initializationPromise = null;

    // يمكن إضافة تنظيف إضافي هنا
    console.log("✅ Cleanup complete");
  }
}

export default AppInitializer;
