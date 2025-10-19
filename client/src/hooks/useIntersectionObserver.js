import { useEffect, useRef, useState, useMemo } from "react";

export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);

  const observerOptions = useMemo(
    () => ({
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || "0px",
      root: options.root || null,
    }),
    [options.threshold, options.rootMargin, options.root]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, observerOptions);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [observerOptions]);

  return { isIntersecting, entry, elementRef };
};
