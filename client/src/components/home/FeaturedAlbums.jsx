import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AlbumCard from "../common/AlbumCard";
import { sortAlbums, prepareAlbumImages } from "../../utils/albumUtils";
import useAppStore from "../../store/useAppStore";

export default function FeaturedAlbums({ albums = [], settings }) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { openLightbox } = useAppStore();

  const defaultSettings = {
    section_title: "منتجاتنا المميزة",
    section_description:
      "اكتشف أحدث إبداعاتنا من المكرمية والبراويز المصنوعة بعناية فائقة",
    button_text: "عرض جميع المنتجات",
    show_count: 6,
    sort_by: "view_count",
  };

  const albumsSettings = { ...defaultSettings, ...settings };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("featured-albums");
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const sortedAlbums = sortAlbums(
    albums,
    albumsSettings.sort_by,
    albumsSettings.show_count
  );

  const handleImageClick = (album, imageIndex = 0) => {
    const images = prepareAlbumImages(album);
    openLightbox(images, imageIndex);
  };

  const handleAlbumClick = (album) => {
    if (!album.slug) {
      console.error("Album missing slug:", album);
      return;
    }
    navigate(`/album/${album.slug}`);
  };

  const handleViewAll = () => {
    navigate("/gallery");
  };

  if (!sortedAlbums || sortedAlbums.length === 0) {
    return (
      <section id="featured-albums" className="py-16 lg:py-24 bg-beige">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-purple mb-4">
              {albumsSettings.section_title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {albumsSettings.section_description}
            </p>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
              <div className="text-gray-400 text-6xl mb-4">📷</div>
              <p className="text-gray-600">لا توجد ألبومات متاحة حالياً</p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-albums" className="py-16 lg:py-24 bg-beige">
      <div className="container mx-auto px-4">
        {/* العنوان والوصف */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-purple mb-4">
            {albumsSettings.section_title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {albumsSettings.section_description}
          </p>
          <div className="w-24 h-1 bg-pink mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* شبكة الألبومات */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAlbums.map((album, index) => (
            <AlbumCard
              key={album.id}
              album={album}
              index={index}
              isVisible={isVisible}
              onImageClick={handleImageClick}
              onAlbumClick={handleAlbumClick}
              variant="featured"
            />
          ))}
        </div>

        {/* زر عرض المزيد */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button
            onClick={handleViewAll}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-purple text-white rounded-full hover:bg-purple-hover transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="font-medium">{albumsSettings.button_text}</span>
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
