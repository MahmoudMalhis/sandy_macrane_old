/* eslint-disable no-unused-vars */
import { CheckCircle, Clock, EyeOff, AlertTriangle, X } from "lucide-react";
import Badge from "./Badge";

export default function StatusBadge({ status, type = "default" }) {
  const getStatusConfig = () => {
    const configs = {
      // For albums/general content
      published: {
        variant: "featured",
        text: "منشور",
        icon: CheckCircle,
        color: "text-green-600",
      },
      draft: {
        variant: "new",
        text: "مسودة",
        icon: Clock,
        color: "text-orange-600",
      },
      pending: {
        variant: "new",
        text: "مراجعة",
        icon: Clock,
        color: "text-orange-600",
      },
      hidden: {
        variant: "category",
        text: "مخفي",
        icon: EyeOff,
        color: "text-gray-600",
      },

      // For inquiries/orders
      new: {
        variant: "new",
        text: "جديد",
        icon: AlertTriangle,
        color: "text-orange-600",
      },
      in_progress: {
        variant: "featured",
        text: "قيد المعالجة",
        icon: Clock,
        color: "text-blue-600",
      },
      completed: {
        variant: "featured",
        text: "مكتمل",
        icon: CheckCircle,
        color: "text-green-600",
      },
      cancelled: {
        variant: "category",
        text: "ملغي",
        icon: X,
        color: "text-red-600",
      },
    };

    return configs[status] || configs.pending;
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center gap-1 ${config.color}`}>
      <IconComponent size={14} />
      <Badge variant={config.variant}>{config.text}</Badge>
    </div>
  );
}
