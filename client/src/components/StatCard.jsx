import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { Sparkline } from "./ChartComponents";

/**
 * بطاقة إحصائيات محسّنة وقابلة لإعادة الاستخدام
 */
export default function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  trendLabel = "مقارنة بالشهر الماضي",
  color = "purple",
  loading = false,
  sparklineData = null,
  onClick = null,
  actionLabel = null,
}) {
  // ألوان حسب النوع
  const colorClasses = {
    purple: {
      icon: "text-purple-600",
      bg: "bg-purple-100",
      gradient: "from-purple-500 to-purple-600",
      ring: "ring-purple-200",
    },
    blue: {
      icon: "text-blue-600",
      bg: "bg-blue-100",
      gradient: "from-blue-500 to-blue-600",
      ring: "ring-blue-200",
    },
    green: {
      icon: "text-green-600",
      bg: "bg-green-100",
      gradient: "from-green-500 to-green-600",
      ring: "ring-green-200",
    },
    orange: {
      icon: "text-orange-600",
      bg: "bg-orange-100",
      gradient: "from-orange-500 to-orange-600",
      ring: "ring-orange-200",
    },
    red: {
      icon: "text-red-600",
      bg: "bg-red-100",
      gradient: "from-red-500 to-red-600",
      ring: "ring-red-200",
    },
    yellow: {
      icon: "text-yellow-600",
      bg: "bg-yellow-100",
      gradient: "from-yellow-500 to-yellow-600",
      ring: "ring-yellow-200",
    },
  };

  const colors = colorClasses[color] || colorClasses.purple;

  // تحديد أيقونة وألوان الاتجاه
  const getTrendInfo = () => {
    if (trend === undefined || trend === null) {
      return {
        Icon: Minus,
        color: "text-gray-500",
        bg: "bg-gray-100",
        label: "لا يوجد تغيير",
      };
    }

    if (trend > 0) {
      return {
        Icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-100",
        label: "زيادة",
      };
    }

    if (trend < 0) {
      return {
        Icon: TrendingDown,
        color: "text-red-600",
        bg: "bg-red-100",
        label: "انخفاض",
      };
    }

    return {
      Icon: Minus,
      color: "text-gray-500",
      bg: "bg-gray-100",
      label: "ثابت",
    };
  };

  const trendInfo = getTrendInfo();

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
        {trend !== undefined && (
          <div className="mt-4 h-4 bg-gray-200 rounded w-32"></div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ${
        onClick ? "cursor-pointer hover:scale-105" : ""
      }`}
      onClick={onClick}
      dir="rtl"
    >
      <div className="flex items-start justify-between mb-4">
        {/* النص والقيمة */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
            <Icon size={18} />
            <span className="font-medium">{title}</span>
          </div>

          <div className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
            {typeof value === "number" ? value.toLocaleString("ar-SA") : value}
          </div>

          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>

        {/* الأيقونة */}
        <div className={`${colors.bg} p-3 rounded-xl ring-4 ${colors.ring}`}>
          <Icon className={colors.icon} size={28} strokeWidth={2.5} />
        </div>
      </div>

      {/* Sparkline Chart */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="mb-3 -mx-2">
          <Sparkline
            data={sparklineData}
            color={colors.icon.replace("text-", "#").replace("-600", "")}
          />
        </div>
      )}

      {/* الاتجاه */}
      {trend !== undefined && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className={`${trendInfo.bg} p-1.5 rounded-lg`}>
              <trendInfo.Icon className={trendInfo.color} size={16} />
            </div>
            <span className={`text-sm font-semibold ${trendInfo.color}`}>
              {trend !== 0 && (trend > 0 ? "+" : "")}
              {Math.abs(trend)}%
            </span>
          </div>
          <span className="text-xs text-gray-500">{trendLabel}</span>
        </div>
      )}

      {/* زر الإجراء */}
      {actionLabel && onClick && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            className={`flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${colors.gradient} text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 w-full justify-center`}
          >
            {actionLabel}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * بطاقة إحصائيات مصغرة
 */
export function MiniStatCard({ icon: Icon, label, value, color = "purple" }) {
  const colorClasses = {
    purple: "text-purple-600 bg-purple-100",
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    orange: "text-orange-600 bg-orange-100",
    red: "text-red-600 bg-red-100",
  };

  const colors = colorClasses[color] || colorClasses.purple;

  return (
    <div
      className="bg-white rounded-lg shadow p-4 flex items-center gap-3"
      dir="rtl"
    >
      <div className={`${colors} p-2 rounded-lg`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString("ar-SA") : value}
        </p>
      </div>
    </div>
  );
}

/**
 * بطاقة إحصائيات بتدرج لوني
 */
export function GradientStatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  gradient = "from-purple-500 to-blue-500",
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <Icon size={18} />
            <span className="font-medium">{title}</span>
          </div>

          <div className="text-4xl font-bold mb-1">
            {typeof value === "number" ? value.toLocaleString("ar-SA") : value}
          </div>

          {subtitle && <div className="text-sm text-white/70">{subtitle}</div>}
        </div>

        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
          <Icon size={28} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

/**
 * بطاقة مقارنة
 */
export function ComparisonStatCard({
  icon: Icon,
  title,
  currentValue,
  previousValue,
  currentLabel = "الحالي",
  previousLabel = "السابق",
  color = "purple",
}) {
  const difference = currentValue - previousValue;
  const percentage =
    previousValue !== 0 ? ((difference / previousValue) * 100).toFixed(1) : 0;

  const colorClasses = {
    purple: { icon: "text-purple-600", bg: "bg-purple-100" },
    blue: { icon: "text-blue-600", bg: "bg-blue-100" },
    green: { icon: "text-green-600", bg: "bg-green-100" },
  };

  const colors = colorClasses[color] || colorClasses.purple;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" dir="rtl">
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
        <Icon size={18} />
        <span className="font-medium">{title}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">{currentLabel}</p>
          <p className="text-2xl font-bold text-gray-900">
            {currentValue.toLocaleString("ar-SA")}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">{previousLabel}</p>
          <p className="text-2xl font-bold text-gray-400">
            {previousValue.toLocaleString("ar-SA")}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {difference > 0 ? (
            <TrendingUp className="text-green-600" size={16} />
          ) : difference < 0 ? (
            <TrendingDown className="text-red-600" size={16} />
          ) : (
            <Minus className="text-gray-500" size={16} />
          )}
          <span
            className={`text-sm font-semibold ${
              difference > 0
                ? "text-green-600"
                : difference < 0
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {difference > 0 && "+"}
            {difference.toLocaleString("ar-SA")}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {percentage > 0 && "+"}
          {percentage}%
        </span>
      </div>
    </div>
  );
}
