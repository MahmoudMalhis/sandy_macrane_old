import { useState, useEffect } from "react";
import { settingsAPI } from "../api/settings";
import { albumsAPI } from "../api/albums";
import { reviewsAPI } from "../api/reviews";
import HeroSlider from "../components/home/HeroSlider";
import AboutTeaser from "../components/home/AboutTeaser";
import FeaturedAlbums from "../components/home/FeaturedAlbums";
import TestimonialsSlider from "../components/home/TestimonialsSlider";
import DualCTA from "../components/home/DualCTA";
import { FloatingWhatsApp } from "../components/ui/WhatsAppIntegration";
import { useApi } from "../hooks/useApi";
import { useSEO } from "../hooks/useSEO";
import Loading from "../utils/Loading";
import Error from "../utils/Error";

export default function Home() {
  const [seoData, setSeoData] = useState(null);
  useSEO(seoData);

  const { data: settings, loading: settingsLoading } = useApi(
    () => settingsAPI.getPublic(),
    [],
    { immediate: true }
  );

  const { data: albums, loading: albumsLoading } = useApi(
    () => albumsAPI.getFeatured(6),
    [],
    { immediate: true }
  );

  const { data: reviews, loading: reviewsLoading } = useApi(
    () => reviewsAPI.getFeatured(4),
    [],
    { immediate: true }
  );

  const loading = settingsLoading || albumsLoading || reviewsLoading;

  useEffect(() => {
    if (settings?.site_meta) {
      setSeoData({
        title: settings.site_meta.title ,
        description: settings.site_meta.description,
        keywords: settings.site_meta.keywords,
      });
    }
  }, [settings]);

  const getSliderData = () => {
    if (!settings?.home_slider) return [];

    const slider = settings.home_slider;
    return [
      {
        id: 1,
        type: "macrame",
        title: slider.macrame?.title,
        subtitle: slider.macrame?.subtitle,
        buttonText: slider.macrame?.button_text,
        image: slider.macrame?.image,
        bgGradient: "from-purple to-pink",
      },
      {
        id: 2,
        type: "frames",
        title: slider.frames?.title,
        subtitle: slider.frames?.subtitle,
        buttonText: slider.frames?.button_text,
        image: slider.frames?.image,
        bgGradient: "from-green to-purple",
      },
    ].filter((slide) => slide.title); // فلترة الشرائح التي تحتوي على عنوان
  };

  const getSortedSections = () => {
    const sections = settings?.home_sections || {
      hero_slider: { enabled: true, order: 1 },
      about: { enabled: true, order: 2 },
      featured_albums: { enabled: true, order: 3 },
      testimonials: { enabled: true, order: 4 },
      dual_cta: { enabled: true, order: 5 },
    };

    return Object.entries(sections)
      .filter(([key, config]) => config.enabled && key !== "whatsapp_float")
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key]) => key);
  };

  const renderSection = (sectionType) => {
    switch (sectionType) {
      case "hero_slider":
        return <HeroSlider key="hero" sliderData={getSliderData()} />;

      case "about":
        return settings?.home_about ? (
          <AboutTeaser key="about" aboutData={settings.home_about} />
        ) : null;

      case "featured_albums":
        return albums?.length > 0 ? (
          <FeaturedAlbums
            key="albums"
            albums={albums}
            settings={settings?.home_albums}
          />
        ) : null;

      case "testimonials":
        return reviews?.length > 0 ? (
          <TestimonialsSlider
            key="testimonials"
            testimonials={reviews}
            settings={settings?.home_testimonials}
          />
        ) : null;

      case "dual_cta":
        return settings?.home_cta ? (
          <DualCTA key="cta" ctaData={settings.home_cta} />
        ) : null;

      default:
        return null;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!settings) {
    return <Error error="فشل في تحميل البيانات" />;
  }

  const sortedSections = getSortedSections();
  const whatsappSettings = {
    enabled: settings?.home_whatsapp?.enabled !== false,
    phoneNumber: settings?.whatsapp_owner || "970599123456",
    businessHours: settings?.home_whatsapp?.business_hours || {
      start: "09:00",
      end: "21:00",
      timezone: "Palestine",
    },
  };

  return (
    <div className="min-h-screen bg-beige">
      {sortedSections.map((sectionType) => renderSection(sectionType))}

      {settings?.home_sections?.whatsapp_float?.enabled &&
        whatsappSettings.enabled && (
          <FloatingWhatsApp
            phoneNumber={whatsappSettings.phoneNumber}
            businessHours={whatsappSettings.businessHours}
            enabled={true}
          />
        )}
    </div>
  );
}
