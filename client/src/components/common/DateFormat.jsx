import { Calendar } from 'lucide-react';

export default function DateFormat  ({ 
  date, 
  showIcon = true, 
  format = "full", 
  className = "" 
}) {
  const formatDate = (dateString, formatType) => {
    const dateObj = new Date(dateString);
    
    switch (formatType) {
      case "short":
        return dateObj.toLocaleDateString("ar", {
          month: "short",
          day: "numeric"
        });
      case "medium":
        return dateObj.toLocaleDateString("ar", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      case "full":
        return dateObj.toLocaleDateString("ar", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      default:
        return dateObj.toLocaleDateString("ar");
    }
  };

  return (
    <div className={`flex items-center gap-1 text-sm text-gray-500 ${className}`}>
      {showIcon && <Calendar size={16} className="text-gray-400" />}
      {formatDate(date, format)}
    </div>
  );
};
