// client/src/components/StatCard.jsx
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  icon: Icon,
  title,
  value,
  subtext,
  color = "bg-purple",
  trend,
  loading = false,
}) {
  // تحديد اتجاه التغيير
  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.direction === "up" ? (
      <TrendingUp size={16} className="text-green-500" />
    ) : (
      <TrendingDown size={16} className="text-red-500" />
    );
  };

  const getTrendColor = () => {
    if (!trend) return "";
    return trend.direction === "up" ? "text-green-500" : "text-red-500";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
          <div className={`${color} w-12 h-12 rounded-full`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {trend.value}%
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-2">{subtext}</p>
        </div>

        <div className={`${color} p-3 rounded-full flex-shrink-0`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

// مكون StatCard مع رسم بياني صغير
export function StatCardWithChart({
  icon: Icon,
  title,
  value,
  subtext,
  color = "bg-purple",
  chartData = [],
  loading = false,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className={`${color} w-10 h-10 rounded-full`}></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-20 mb-3"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const maxValue = Math.max(...chartData);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`${color} p-2 rounded-full`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>

      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-sm text-gray-500 mb-4">{subtext}</p>

      {/* رسم بياني صغير */}
      {chartData.length > 0 && (
        <div className="flex items-end justify-between h-16 gap-1">
          {chartData.map((val, index) => (
            <div
              key={index}
              className={`flex-1 ${color} rounded-t transition-all duration-300 hover:opacity-80`}
              style={{
                height: `${(val / maxValue) * 100}%`,
                minHeight: "4px",
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

// مكون StatCard بسيط بدون أيقونة
export function SimpleStatCard({ title, value, subtext, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtext}</p>
    </div>
  );
}
