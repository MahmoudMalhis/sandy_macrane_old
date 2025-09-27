import { Eye, Edit, Trash2, Phone, CheckCircle, Clock } from "lucide-react";

export default function ActionButtons({ actions, itemId }) {
  const getIcon = (actionType) => {
    const icons = {
      view: Eye,
      edit: Edit,
      delete: Trash2,
      phone: Phone,
      approve: CheckCircle,
      process: Clock,
    };
    return icons[actionType] || Eye;
  };

  const getButtonClass = (actionType) => {
    const classes = {
      view: "text-blue-600 hover:text-blue-900",
      edit: "text-purple hover:text-purple-hover",
      delete: "text-red-600 hover:text-red-900",
      phone: "text-green-600 hover:text-green-900",
      approve: "text-green-600 hover:text-green-900",
      process: "text-orange-600 hover:text-orange-900",
    };
    return classes[actionType] || "text-gray-600 hover:text-gray-900";
  };

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => {
        const IconComponent = getIcon(action.type);
        return (
          <button
            key={index}
            onClick={() => action.onClick(itemId)}
            className={`p-1 rounded ${getButtonClass(action.type)}`}
            title={action.title}
          >
            <IconComponent size={16} />
          </button>
        );
      })}
    </div>
  );
}
