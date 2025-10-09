import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import ApplyNow from "../ApplyNow";
import { useNavigate } from "react-router-dom";

export default function DualCTA({ ctaData }) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const data = ctaData || {};

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("dual-cta");
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const CTACard = ({ ctaInfo, index, isCustom }) => {
    const [isHovered, setIsHovered] = useState(false);
    if (!ctaInfo) return null;

    return (
      <motion.div
        className="relative group"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105">
          <div className="absolute inset-0 pointer-events-none">
            {ctaInfo.image && (
              <img
                src={ctaInfo.image}
                alt={ctaInfo.title || ""}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            )}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                ctaInfo.bgColor ||
                (isCustom ? "from-purple to-pink" : "from-green to-purple")
              } opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
            ></div>
            <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-8 pointer-events-auto">
            {ctaInfo.icon && (
              <motion.div
                className="mb-6"
                animate={
                  isHovered
                    ? { scale: 1.2, rotate: 5 }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.3 }}
              >
                <div className="bg-opacity-20 backdrop-blur-sm p-4 rounded-full">
                  <ctaInfo.icon size={48} className="text-white" />
                </div>
              </motion.div>
            )}
            {ctaInfo.title && (
              <motion.h3
                className="text-2xl lg:text-3xl font-bold mb-3"
                animate={isHovered ? { y: -5 } : { y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {ctaInfo.title}
              </motion.h3>
            )}
            {ctaInfo.subtitle && (
              <motion.p
                className="text-lg lg:text-xl mb-4 opacity-90"
                animate={isHovered ? { y: -5 } : { y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {ctaInfo.subtitle}
              </motion.p>
            )}
            {ctaInfo.description && (
              <motion.p
                className="text-sm lg:text-base mb-8 opacity-80 max-w-sm"
                animate={
                  isHovered ? { y: -5, opacity: 1 } : { y: 0, opacity: 0.8 }
                }
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {ctaInfo.description}
              </motion.p>
            )}
            {(ctaInfo.button_text || isCustom) && (
              <motion.div
                animate={
                  isHovered ? { y: -10, scale: 1.05 } : { y: 0, scale: 1 }
                }
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {isCustom ? (
                  <ApplyNow />
                ) : (
                  <button
                    className="bg-white text-purple hover:bg-light-gray px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-300 flex items-center gap-3"
                    onClick={() => navigate("/gallery")}
                  >
                    <span>{ctaInfo.button_text}</span>
                    <ArrowLeft size={20} />
                  </button>
                )}
              </motion.div>
            )}
          </div>
          <div className="absolute top-4 right-4 pointer-events-none">
            <motion.div
              animate={
                isHovered
                  ? { scale: 1.2, opacity: 1 }
                  : { scale: 1, opacity: 0.7 }
              }
              transition={{ duration: 0.3 }}
            >
              <Sparkles size={24} className="text-white" />
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>{" "}
        </div>
      </motion.div>
    );
  };

  return (
    <section id="dual-cta" className="py-16 lg:py-24 bg-beige">
      <div className="container mx-auto px-4">
        {(data.section_title || data.section_description) && (
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {data.section_title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-purple mb-4">
                {data.section_title}
              </h2>
            )}
            {data.section_description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {data.section_description}
              </p>
            )}
            <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
          </motion.div>
        )}

        {(data.custom_design || data.gallery) && (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {data.custom_design && (
              <CTACard ctaInfo={data.custom_design} index={0} isCustom={true} />
            )}
            {data.gallery && (
              <CTACard ctaInfo={data.gallery} index={1} isCustom={false} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
