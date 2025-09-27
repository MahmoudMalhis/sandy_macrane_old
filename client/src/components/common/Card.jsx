// src/components/ui/Card.jsx
export default function Card({
  children,
  className = "",
  variant = "default",
}) {
  const variants = {
    default: "bg-white rounded-lg shadow-lg overflow-hidden",
    featured: "bg-white rounded-lg shadow-xl overflow-hidden relative",
    testimonial: "bg-white rounded-lg shadow-md p-6",
  };

  return <div className={`${variants[variant]} ${className}`}>{children}</div>;
}
