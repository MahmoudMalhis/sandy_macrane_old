// client/src/pages/admin/Login.jsx - مُصحح
import { Link, Navigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Button from "../../components/common/Button";
import { useEffect, useState } from "react";
import { authAPI } from "../../api/auth";
import useAuthStore from "../../api/useAuthStore";
import { requestNotificationPermission } from '../../config/firebase';
import { adminAPI } from '../../api/admin';

export default function AdminLogin() {
  const { isAuthenticated, login, loading: authLoading } = useAuthStore();
  const [needsSetup, setNeedsSetup] = useState(null);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await authAPI.checkSetupStatus();

        const needsSetup = response.data?.needsSetup ?? false;
        setNeedsSetup(needsSetup);
      } catch (error) {
        console.error("Error checking setup:", error);
        setNeedsSetup(false);
      } finally {
        setCheckingSetup(false);
      }
    };

    checkSetup();
  }, []);

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple mx-auto mb-4"></div>
          <div>جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (needsSetup) {
    return <Navigate to="/admin/setup" replace />;
  }

  const from = location.state?.from?.pathname || "/admin";
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

const onSubmit = async (data) => {
  const result = await login(data);

  if (result.success) {
    toast.success("تم تسجيل الدخول بنجاح");

    try {
      const fcmToken = await requestNotificationPermission();
      if (fcmToken) {
        await adminAPI.saveFcmToken(fcmToken);
        console.log("✅ FCM token saved successfully");
      } else {
        console.log("⚠️ User denied notification permission");
      }
    } catch (error) {
      console.error("❌ Failed to setup notifications:", error);
    }
  } else {
    if (result.error?.includes("verify your email")) {
      toast.error("يرجى تفعيل بريدك الإلكتروني قبل تسجيل الدخول");
      setShowResendEmail(true);
    } else {
      toast.error(result.error || "فشل تسجيل الدخول");
    }
  }
};

  const handleResendVerification = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("يرجى إدخال بريدك الإلكتروني أولاً");
      return;
    }

    setIsResending(true);
    try {
      await authAPI.resendVerificationEmail({ email });
      toast.success("تم إرسال رسالة التفعيل، تحقق من بريدك الإلكتروني");
      setShowResendEmail(false);
    } catch (error) {
      toast.error(error.message || "فشل في إرسال رسالة التفعيل");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-beige flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/logo.jpg"
            alt="Sandy Macrame"
            className="h-20 w-20 rounded-full mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-purple">لوحة التحكم</h1>
          <p className="text-gray-600">ساندي مكرمية</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              {...register("email", {
                required: "البريد الإلكتروني مطلوب",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "بريد إلكتروني غير صحيح",
                },
              })}
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="admin@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              {...register("password", {
                required: "كلمة المرور مطلوبة",
                minLength: {
                  value: 6,
                  message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                },
              })}
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={authLoading}
            className="w-full"
            disabled={authLoading}
          >
            {authLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        {/* خيار إعادة إرسال رسالة التفعيل */}
        {showResendEmail && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              حسابك غير مفعل
            </h3>
            <p className="text-yellow-700 text-sm mb-3">
              يبدو أن حسابك غير مفعل. هل تريد إعادة إرسال رسالة التفعيل؟
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleResendVerification}
                loading={isResending}
                variant="secondary"
                size="sm"
              >
                {isResending ? "جاري الإرسال..." : "إعادة الإرسال"}
              </Button>
              <Button
                onClick={() => setShowResendEmail(false)}
                variant="outline"
                size="sm"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-purple hover:text-purple-hover hover:underline">
          <Link to="/admin/setup">إنشاء حساب جديد؟</Link>
        </div>
      </div>
    </div>
  );
}
