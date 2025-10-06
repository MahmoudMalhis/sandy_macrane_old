// client/src/components/ErrorBoundary.jsx
import { Component } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

/**
 * ErrorBoundary Component
 * يلتقط الأخطاء في React component tree ويعرض UI بديل
 *
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  /**
   * يتم استدعاؤه عندما يحدث خطأ في أي component child
   */
  static getDerivedStateFromError(error) {
    // تحديث الـ state ليعرض fallback UI في الـ render التالي
    return {
      hasError: true,
      error,
    };
  }

  /**
   * يتم استدعاؤه بعد التقاط الخطأ
   * مفيد لتسجيل الأخطاء في خدمات المراقبة
   */
  componentDidCatch(error, errorInfo) {
    // تسجيل الخطأ
    console.error("🚨 ErrorBoundary caught an error:", error);
    console.error("📍 Error Info:", errorInfo);

    // تحديث state مع معلومات الخطأ
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // يمكنك إرسال الخطأ لخدمة مراقبة مثل Sentry
    // logErrorToService(error, errorInfo);
  }

  /**
   * إعادة تعيين الـ error state
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * إعادة تحميل الصفحة
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * العودة للصفحة الرئيسية
   */
  handleGoHome = () => {
    window.location.href = "/";
  };

  /**
   * تحديد نوع الخطأ وعرض رسالة مناسبة
   */
  getErrorMessage() {
    const { error } = this.state;

    if (!error) return "حدث خطأ غير متوقع";

    // أخطاء Lazy Loading
    if (error.name === "ChunkLoadError" || error.message?.includes("chunk")) {
      return "فشل تحميل جزء من التطبيق. قد يكون هناك تحديث جديد.";
    }

    // أخطاء Network
    if (
      error.message?.includes("Network") ||
      error.message?.includes("fetch")
    ) {
      return "فشل الاتصال بالخادم. تحقق من اتصالك بالإنترنت.";
    }

    // أخطاء عامة
    return error.message || "حدث خطأ غير متوقع";
  }

  /**
   * عرض معلومات تقنية للمطورين (development mode فقط)
   */
  renderDevInfo() {
    const { error, errorInfo } = this.state;
    const isDev = import.meta.env.DEV;

    if (!isDev) return null;

    return (
      <details className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
        <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
          تفاصيل تقنية (للمطورين فقط)
        </summary>
        <div className="space-y-4 text-sm">
          <div>
            <strong className="text-red-600">Error:</strong>
            <pre className="mt-2 p-2 bg-red-50 rounded overflow-auto text-xs">
              {error?.toString()}
            </pre>
          </div>
          {errorInfo && (
            <div>
              <strong className="text-red-600">Component Stack:</strong>
              <pre className="mt-2 p-2 bg-red-50 rounded overflow-auto text-xs">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
          {error?.stack && (
            <div>
              <strong className="text-red-600">Stack Trace:</strong>
              <pre className="mt-2 p-2 bg-red-50 rounded overflow-auto text-xs">
                {error.stack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  }

  render() {
    const { hasError, errorCount } = this.state;
    const { children, fallback } = this.props;

    // إذا لم يحدث خطأ، عرض children بشكل طبيعي
    if (!hasError) {
      return children;
    }

    // إذا تم تمرير fallback مخصص، استخدمه
    if (fallback) {
      return typeof fallback === "function"
        ? fallback(this.state.error, this.handleReset)
        : fallback;
    }

    // عرض UI الافتراضي للخطأ
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* أيقونة الخطأ */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* عنوان الخطأ */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            عذراً، حدث خطأ!
          </h1>

          {/* رسالة الخطأ */}
          <p className="text-lg text-gray-600 mb-8">{this.getErrorMessage()}</p>

          {/* عداد الأخطاء (إذا حدث أكثر من خطأ) */}
          {errorCount > 1 && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ حدثت {errorCount} أخطاء. قد تحتاج لإعادة تحميل الصفحة.
              </p>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* زر إعادة المحاولة */}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple text-white rounded-lg hover:bg-purple-hover transition-colors duration-200 font-semibold"
            >
              <RefreshCcw size={20} />
              إعادة المحاولة
            </button>

            {/* زر إعادة تحميل الصفحة */}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
            >
              <RefreshCcw size={20} />
              إعادة التحميل
            </button>

            {/* زر العودة للرئيسية */}
            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-beige text-gray-800 rounded-lg hover:bg-beige/80 transition-colors duration-200 font-semibold"
            >
              <Home size={20} />
              العودة للرئيسية
            </button>
          </div>

          {/* معلومات إضافية للمساعدة */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              إذا استمرت المشكلة، يرجى تحديث المتصفح أو{" "}
              <a
                href="/contact"
                className="text-purple hover:underline font-semibold"
              >
                التواصل معنا
              </a>
            </p>
          </div>

          {/* معلومات تقنية (Development Mode) */}
          {this.renderDevInfo()}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
