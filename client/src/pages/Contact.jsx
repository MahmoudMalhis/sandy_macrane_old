import { usePublicSettings } from "../hooks/queries/useSettings";
import ContactHeroSection from "../components/contact/ContactHeroSection";
import ContactInfoCards from "../components/contact/ContactInfoCards";
import ContactForm from "../components/contact/ContactForm";
import CTASection from "../components/contact/CTASection";
import AdditionalInfoSection from "../components/contact/AdditionalInfoSection";
import ClosingMessage from "../components/contact/ClosingMessage";
import Loading from "../utils/LoadingSettings";

const Contact = () => {
const { data: settings, isLoading: loading, isSuccess } = usePublicSettings();
const isVisible = isSuccess;
const contactInfo = settings
  ? {
      whatsapp: settings.contact_info?.phone || settings.whatsapp_owner,
      email: settings.contact_info?.email,
      address: settings.contact_info?.address,
      workingHours: {
        weekdays: settings.contact_info?.working_hours?.weekdays,
        weekend: settings.contact_info?.working_hours?.weekend,
      },
      social: {
        facebook:
          settings.contact_info?.social?.facebook ||
          settings.social_links?.facebook,
        instagram:
          settings.contact_info?.social?.instagram ||
          settings.social_links?.instagram,
      },
    }
    : null;
  
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-beige py-12">
      <div className="container mx-auto px-4 mb-12">
        <ContactHeroSection isVisible={isVisible} />
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <ContactInfoCards isVisible={isVisible} contactInfo={contactInfo} />
          <ContactForm isVisible={isVisible} contactInfo={contactInfo} />
        </div>
        <CTASection isVisible={isVisible} contactInfo={contactInfo} />
        <AdditionalInfoSection isVisible={isVisible} />
        <ClosingMessage isVisible={isVisible} />
      </div>
    </div>
  );
};

export default Contact;
