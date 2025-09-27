// client/src/components/ui/AnimatedSection.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up", // up, down, left, right, fade
  threshold = 0.1,
  once = true,
  as = "section",
  id,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const Component = motion[as];

  useEffect(() => {
    if (!id) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const element = document.getElementById(id);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [id, threshold, once]);

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 50 };
      case "down":
        return { opacity: 0, y: -50 };
      case "left":
        return { opacity: 0, x: -50 };
      case "right":
        return { opacity: 0, x: 50 };
      case "fade":
        return { opacity: 0 };
      case "scale":
        return { opacity: 0, scale: 0.9 };
      default:
        return { opacity: 0, y: 50 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      case "fade":
        return { opacity: 1 };
      case "scale":
        return { opacity: 1, scale: 1 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <Component
      id={id}
      initial={getInitialPosition()}
      animate={isVisible ? getAnimatePosition() : getInitialPosition()}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
