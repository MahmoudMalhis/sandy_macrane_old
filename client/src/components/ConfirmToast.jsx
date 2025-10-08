// client/src/components/common/ConfirmToast.jsx
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

export const confirmToast = ({
  message,
  onConfirm,
  onCancel = () => {},
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  type = "danger",
  icon: CustomIcon = null,
}) => {
  const Icon = CustomIcon || AlertTriangle;

  const iconColors = {
    danger: "text-red-500 bg-red-100",
    warning: "text-yellow-500 bg-yellow-100",
    info: "text-blue-500 bg-blue-100",
  };

  const buttonColors = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  const toastId = toast.custom(
    (t) => (
      <AnimatePresence>
        {t.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-md w-full bg-white shadow-2xl rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
          >
            {/* Header with colored bar */}
            <div
              className={`h-2 ${
                type === "danger"
                  ? "bg-red-500"
                  : type === "warning"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
            />

            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconColors[type]}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    تأكيد العملية
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {message}
                  </p>
                </div>

                {/* Close button */}
                <button
                  onClick={() => {
                    toast.dismiss(toastId);
                    onCancel();
                  }}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Action buttons */}
              <div className="mt-5 flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    toast.dismiss(toastId);
                    onCancel();
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    toast.dismiss(toastId);
                    onConfirm();
                  }}
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${buttonColors[type]}`}
                >
                  {confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    ),
    {
      duration: Infinity,
      position: "top-center",
    }
  );

  return toastId;
};

// Helper functions للاستخدام السريع
export const confirmDelete = (message, onConfirm, count = null) => {
  const displayMessage = count
    ? `هل تريد حذف ${count} ${message}؟`
    : `هل تريد حذف ${message}؟`;

  return confirmToast({
    message: displayMessage,
    onConfirm,
    confirmText: "حذف",
    cancelText: "إلغاء",
    type: "danger",
    icon: Trash2,
  });
};

export const confirmAction = (message, onConfirm, confirmText = "تأكيد") => {
  return confirmToast({
    message,
    onConfirm,
    confirmText,
    cancelText: "إلغاء",
    type: "warning",
  });
};
