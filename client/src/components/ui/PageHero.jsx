// client/src/components/ui/PageHero.jsx
import AnimatedSection from "./AnimatedSection";

export default function PageHero({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundGradient = "from-purple to-pink",
  textColor = "white",
  showDivider = true,
  dividerColor = "bg-pink",
  className = "",
  children,
  actions,
  stats,
  overlay = true,
  height = "h-96 md:h-[500px] lg:h-[600px]",
}) {
  return (
    <div className={`relative ${height} overflow-hidden ${className}`}>
      {/* Background */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0">
            <img
              src={backgroundImage}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {overlay && (
            <>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient} opacity-50`}
              ></div>
              <div className="absolute inset-0 bg-black opacity-30"></div>
            </>
          )}
        </>
      )}

      {/* Content without background image */}
      {!backgroundImage && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient}`}
        ></div>
      )}

      {/* Main Content */}
      <div className="relative h-full flex items-center justify-center z-10">
        <div className="text-center px-4 max-w-5xl mx-auto">
          <AnimatedSection id="hero-content" direction="fade">
            {title && (
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-${textColor}`}
              >
                {title}
              </h1>
            )}

            {subtitle && (
              <p
                className={`text-lg md:text-xl lg:text-2xl mb-6 opacity-90 text-${textColor}`}
              >
                {subtitle}
              </p>
            )}

            {description && (
              <p
                className={`text-base md:text-lg mb-8 opacity-80 max-w-3xl mx-auto text-${textColor}`}
              >
                {description}
              </p>
            )}

            {showDivider && (
              <div
                className={`w-24 h-1 ${dividerColor} mx-auto mb-6 rounded-full`}
              ></div>
            )}

            {/* Actions */}
            {actions && (
              <div className="flex flex-wrap justify-center gap-4">
                {actions}
              </div>
            )}

            {/* Custom Children */}
            {children}

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white border-opacity-20">
                {stats.map((stat, index) => (
                  <div key={index} className={`text-${textColor}`}>
                    <div className="text-2xl md:text-3xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-6 right-6 w-20 h-20 border border-white opacity-20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-6 left-6 w-16 h-16 border border-white opacity-20 rounded-full animate-bounce"></div>
    </div>
  );
}
