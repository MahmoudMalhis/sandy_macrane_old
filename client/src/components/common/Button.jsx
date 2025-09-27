export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-purple text-white hover:bg-purple-hover",
    secondary:
      "bg-white text-purple border-2 border-purple hover:bg-purple hover:text-white",
    outline:
      "border-2 border-purple text-purple hover:bg-purple hover:text-white",
    ghost: "text-purple hover:bg-purple hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-bold rounded-full 
        transition duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple
        ${variants[variant]} 
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && <span className="mr-2 animate-spin">⏳</span>}
      {children}
    </button>
  );
}
