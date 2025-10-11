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
            settings.contact_info?.phone ||
            settings.whatsapp_owner,
          email: settings.contact_info?.email,
          address: settings.contact_info?.address,
          workingHours: {
            weekdays:
              settings.contact_info?.working_hours?.weekdays,
            weekend:
              settings.contact_info?.working_hours?.weekend ,
          },
          social: {
            facebook:
              settings.contact_info?.social?.facebook ||
              settings.social_links?.facebook ,
            instagram:
              settings.contact_info?.social?.instagram ||
              settings.social_links?.instagram ,
          },
        });
      } 
    } catch (error) {
      console.error("Error loading contact data:", error);
    } finally {
      setLoading(false);
      setIsVisible(true);
    }
  };

 

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
