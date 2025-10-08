/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Award } from "lucide-react";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

export default function AboutTeaser({ aboutData }) {
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("about-teaser");
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!aboutData) {
    return null;
  }

  const getIcon = (iconString) => {
    if (iconString && /\p{Emoji}/u.test(iconString)) {
      return <span className="text-2xl">{iconString}</span>;
    }
    const icons = {
      "صنع بحب": Heart,
      "تصاميم فريدة": Sparkles,
      "جودة عالية": Award,
    };
    const IconComponent = icons[iconString] || Heart;
    return <IconComponent size={20} />;
  };

  return (
    <section id="about-teaser" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <motion.h2
                className="text-3xl lg:text-4xl font-bold text-purple leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {aboutData.title}
              </motion.h2>
              {aboutData.subtitle && (
                <motion.p
                  className="text-lg text-pink font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {aboutData.subtitle}
                </motion.p>
              )}
              {aboutData.description && (
                <motion.p
                  className="text-gray-600 leading-relaxed text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {aboutData.description}
                </motion.p>
              )}
            </div>
            {aboutData.highlights && aboutData.highlights.length > 0 && (
              <motion.div
                className="grid gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {aboutData.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="bg-purple text-white p-3 rounded-full group-hover:bg-pink transition-colors duration-300">
                      {getIcon(highlight.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold text-purple text-lg mb-1">
                        {highlight.title}
                      </h3>
                      <p className="text-gray-600">{highlight.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {aboutData.button_text && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="transform hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={() => {
                    navigation("/about")
                  }}
                >
                  {aboutData.button_text}
                </Button>
              </motion.div>
            )}
          </motion.div>
          <motion.div
            className="relative order-first lg:order-last"
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={aboutData.image || "/images/default-about.jpg"}
                  alt="ساندي مكرمية"
                  className="w-full h-96 lg:h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-purple opacity-20"></div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green rounded-full opacity-30 animate-bounce"></div>
              <div className="absolute -inset-4 border-2 border-purple border-opacity-20 rounded-2xl -z-10"></div>
            </div>
            <motion.div
              className="absolute top-4 left-4 bg-pink text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              ✨ صنع بحب
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
