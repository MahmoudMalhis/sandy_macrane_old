import { useState, useEffect } from "react";
import { settingsAPI } from "../api/settings";
import ContactHeroSection from "../components/contact/ContactHeroSection";
import ContactInfoCards from "../components/contact/ContactInfoCards";
import ContactForm from "../components/contact/ContactForm";
import CTASection from "../components/contact/CTASection";
import AdditionalInfoSection from "../components/contact/AdditionalInfoSection";
import ClosingMessage from "../components/contact/ClosingMessage";
import Loading from "../utils/LoadingSettings";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getPublic();

      if (response?.success) {
        // Extract contact info from settings
        const settings = response.data;

        setContactInfo({
          whatsapp:
            settings.contact_info?.whatsapp ||
            settings.whatsapp_owner ||
            "970599123456",
          email: settings.contact_info?.email || "sandy@example.com",
          address: settings.contact_info?.address || "نابلس، فلسطين",
          workingHours: {
            weekdays:
              settings.contact_info?.working_hours?.weekdays ||
              "الأحد - الخميس: 9:00 ص - 9:00 م",
            weekend:
              settings.contact_info?.working_hours?.weekend ||
              "الجمعة - السبت: 12:00 ظ - 6:00 م",
          },
          social: {
            facebook:
              settings.contact_info?.social?.facebook ||
              settings.social_links?.facebook ||
              "https://facebook.com/sandymacrame",
            instagram:
              settings.contact_info?.social?.instagram ||
              settings.social_links?.instagram ||
              "https://instagram.com/sandymacrame",
          },
        });
      } else {
        // Fallback to default data
        setContactInfo(getDefaultContactInfo());
      }
    } catch (error) {
      console.error("Error loading contact data:", error);
      // Use default data on error
      setContactInfo(getDefaultContactInfo());
    } finally {
      setLoading(false);
      setIsVisible(true);
    }
  };

  const getDefaultContactInfo = () => ({
    whatsapp: "970599123456",
    email: "sandy@example.com",
    address: "نابلس، فلسطين",
    workingHours: {
      weekdays: "الأحد - الخميس: 9:00 ص - 9:00 م",
      weekend: "الجمعة - السبت: 12:00 ظ - 6:00 م",
    },
    social: {
      facebook: "https://facebook.com/sandymacrame",
      instagram: "https://instagram.com/sandymacrame",
    },
  });

  if (loading || !contactInfo) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-beige py-12">
      <div className="container mx-auto px-4 mb-12">
        {/* قسم العنوان الرئيسي */}
        <ContactHeroSection isVisible={isVisible} />

        {/* القسم الرئيسي - معلومات التواصل ونموذج الاتصال */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* معلومات التواصل */}
          <ContactInfoCards isVisible={isVisible} contactInfo={contactInfo} />

          {/* نموذج التواصل */}
          <ContactForm isVisible={isVisible} contactInfo={contactInfo} />
        </div>

        {/* دعوة نهائية للعمل */}
        <CTASection isVisible={isVisible} contactInfo={contactInfo} />

        {/* قسم معلومات إضافية */}
        <AdditionalInfoSection isVisible={isVisible} />

        {/* رسالة ختامية */}
        <ClosingMessage isVisible={isVisible} />
      </div>
    </div>
  );
};

export default Contact;
