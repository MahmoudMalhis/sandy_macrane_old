import { useState, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  Star,
  MessageSquare,
  Package,
} from "lucide-react";

/**
 * مركز الإشعارات - عرض التنبيهات والأنشطة المهمة
 */
export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // تحديث الإشعارات كل دقيقة
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      // في التطبيق الحقيقي، استبدل هذا بـ API call
      const mockNotifications = [
        {
          id: 1,
          type: "review",
          title: "تقييم جديد",
          message: "تقييم جديد من سارة أحمد - 5 نجوم",
          time: new Date(Date.now() - 5 * 60000),
          read: false,
          icon: Star,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
        },
        {
          id: 2,
          type: "inquiry",
          title: "استعلام جديد",
          message: "استعلام من محمد خالد عن مكرمية جدارية",
          time: new Date(Date.now() - 15 * 60000),
          read: false,
          icon: MessageSquare,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
        },
        {
          id: 3,
          type: "order",
          title: "طلب جديد",
          message: "طلب جديد بقيمة 350 ريال",
          time: new Date(Date.now() - 30 * 60000),
          read: true,
          icon: Package,
          color: "text-green-500",
          bgColor: "bg-green-50",
        },
        {
          id: 4,
          type: "alert",
          title: "تنبيه",
          message: "تذكير: 5 تقييمات تنتظر الموافقة",
          time: new Date(Date.now() - 60 * 60000),
          read: true,
          icon: AlertCircle,
          color: "text-orange-500",
          bgColor: "bg-orange-50",
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    const notif = notifications.find((n) => n.id === id);
    if (notif && !notif.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // بالثواني

    if (diff < 60) return "الآن";
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return `منذ ${Math.floor(diff / 86400)} يوم`;
  };

  return (
    <div className="relative" dir="rtl">
      {/* زر الإشعارات */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* بانل الإشعارات */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* قائمة الإشعارات */}
          <div className="absolute left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">الإشعارات</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  تعليم الكل كمقروء
                </button>
              )}
            </div>

            {/* قائمة الإشعارات */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell className="text-gray-300 mb-3" size={48} />
                  <p className="text-gray-500 text-center">
                    لا توجد إشعارات حالياً
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notif.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* أيقونة */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 ${notif.bgColor} rounded-lg flex items-center justify-center`}
                      >
                        <notif.icon className={notif.color} size={20} />
                      </div>

                      {/* المحتوى */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              {notif.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>

                          {/* زر حذف */}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {/* الوقت والحالة */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(notif.time)}
                          </span>

                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                            >
                              <Check size={12} />
                              تعليم كمقروء
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium py-2">
                  عرض جميع الإشعارات
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * مكون Toast للإشعارات المؤقتة
 */
export const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: {
      Icon: Check,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    error: {
      Icon: X,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    warning: {
      Icon: AlertCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    info: {
      Icon: Info,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  };

  const { Icon, color, bgColor, borderColor } = icons[type] || icons.info;

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${bgColor} ${borderColor} z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      dir="rtl"
    >
      <Icon className={color} size={20} />
      <p className="text-sm font-medium text-gray-900">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-gray-400 hover:text-gray-600"
      >
        <X size={16} />
      </button>
    </div>
  );
};

/**
 * Hook لإدارة Toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
};
