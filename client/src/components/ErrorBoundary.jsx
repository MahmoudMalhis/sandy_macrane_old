import { Component } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
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

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 ErrorBoundary caught an error:", error);
    console.error("📍 Error Info:", errorInfo);

    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  getErrorMessage() {
    const { error } = this.state;

    if (!error) return "حدث خطأ غير متوقع";

    if (error.name === "ChunkLoadError" || error.message?.includes("chunk")) {
      return "فشل تحميل جزء من التطبيق. قد يكون هناك تحديث جديد.";
    }

    if (
      error.message?.includes("Network") ||
      error.message?.includes("fetch")
    ) {
      return "فشل الاتصال بالخادم. تحقق من اتصالك بالإنترنت.";
    }

    return error.message || "حدث خطأ غير متوقع";
  }

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

    if (!hasError) {
      return children;
    }

    if (fallback) {
      return typeof fallback === "function"
        ? fallback(this.state.error, this.handleReset)
        : fallback;
    }

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
