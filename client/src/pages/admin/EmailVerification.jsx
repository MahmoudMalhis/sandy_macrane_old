// client/src/pages/admin/EmailVerification.jsx - مُصحح
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth";
import Button from "../../components/common/Button";

export default function EmailVerification() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("رابط التفعيل غير صحيح");
        return;
      }

      try {
        console.log("Verifying token:", token);
        const response = await authAPI.verifyEmail(token);
        console.log("Verification response:", response);

        setStatus("success");
        setMessage(
          response.data?.message || response.message || "تم تفعيل الحساب بنجاح"
        );

        // تأخير قبل التوجه لصفحة تسجيل الدخول
        setTimeout(() => {
          navigate("/admin/login", {
            state: {
              message: "تم تفعيل الحساب بنجاح، يمكنك تسجيل الدخول الآن",
            },
          });
        }, 3000);
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("error");

        if (error.message?.includes("Invalid or expired")) {
          setMessage("رابط التفعيل غير صحيح أو منتهي الصلاحية");
        } else {
          setMessage(error.message || "فشل في تفعيل الحساب");
        }
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleResendEmail = async () => {
    if (!email) {
      alert("يرجى إدخال بريدك الإلكتروني");
      return;
    }

    setIsResending(true);
    try {
      await authAPI.resendVerificationEmail({ email });
      alert("تم إرسال رسالة التفعيل مرة أخرى، تحقق من بريدك الإلكتروني");
    } catch (error) {
      alert(error.message || "فشل في إرسال رسالة التفعيل");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-beige flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <img
          src="/logo.jpg"
          alt="Sandy Macrame"
          className="h-20 w-20 rounded-full mx-auto mb-6"
        />

        {status === "loading" && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              جاري تفعيل الحساب...
            </h2>
            <p className="text-gray-600">
              يرجى الانتظار بينما نقوم بتفعيل حسابك
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-green-600 mb-4">
              تم التفعيل بنجاح!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700 text-sm">
                ستتم إعادة توجيهك لصفحة تسجيل الدخول خلال ثواني...
              </p>
            </div>
            <Link
              to="/admin/login"
              className="bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-hover transition-colors inline-block"
            >
              تسجيل الدخول الآن
            </Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-xl font-bold text-red-600 mb-4">
              فشل في التفعيل
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>

            {/* خيارات حل المشكلة */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                يمكنك المحاولة مرة أخرى:
              </h3>

              <div className="space-y-3">
                <div>
                  <input
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-lg text-sm"
                  />
                </div>

                <Button
                  onClick={handleResendEmail}
                  loading={isResending}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  {isResending
                    ? "جاري الإرسال..."
                    : "إعادة إرسال رسالة التفعيل"}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/admin/setup"
                className="block bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-hover transition-colors"
              >
                إنشاء حساب جديد
              </Link>
              <Link
                to="/admin/login"
                className="block text-purple hover:underline"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
