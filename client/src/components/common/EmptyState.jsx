/* eslint-disable no-unused-vars */
export default function EmptyState({
  icon: IconComponent,
  title,
  description,
  action = null,
  className = "",
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <IconComponent className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
