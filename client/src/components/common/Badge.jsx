// src/components/ui/Badge.jsx
export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const variants = {
    new: "bg-pink text-white px-3 py-1 text-sm font-bold rounded-full",
    featured: "bg-green text-white px-3 py-1 text-sm font-bold rounded-full",
    category: "bg-light-gray text-gray-700 px-3 py-1 text-sm rounded-full",
  };

  return (
    <span className={`${variants[variant]} ${className}`}>{children}</span>
  );
}
