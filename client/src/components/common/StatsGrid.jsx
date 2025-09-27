export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p
                className={`text-3xl font-bold ${
                  stat.valueColor || "text-gray-800"
                }`}
              >
                {stat.value}
              </p>
              {stat.subtext && (
                <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
              )}
            </div>
            <div className={`${stat.iconBg} p-3 rounded-full`}>
              <stat.icon size={24} className="text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
