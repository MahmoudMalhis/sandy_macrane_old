import { Star } from "lucide-react";

export default function StarRating({
  rating,
  size = 16,
  showNumber = false,
  interactive = false,
  onChange = null,
}) {
  const stars = [...Array(5)].map((_, i) => (
    <Star
      key={i}
      size={size}
      className={`${
        i < rating ? "text-yellow-500 fill-current" : "text-gray-300"
      } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
      onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
    />
  ));

  return (
    <div className="flex items-center gap-1">
      {stars}
      {showNumber && (
        <span className="text-sm text-gray-600 mr-2">({rating}/5)</span>
      )}
    </div>
  );
}
