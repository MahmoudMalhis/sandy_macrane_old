// client/src/pages/admin/AdminHomeSettings.jsx - النسخة المحدثة للاتصال بالباك إند
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Save,
  Edit,
  Settings,
  Image,
  MessageSquare,
  Palette,
  Users,
  Smartphone,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Button from "../../components/common/Button";
import SliderSettings from "../../components/admin/settings/SliderSettings";
import AboutSettings from "../../components/admin/settings/AboutSettings";
import CTASettings from "../../components/admin/settings/CTASettings";
import AlbumsSettings from "../../components/admin/settings/AlbumsSettings";
import TestimonialsSettings from "../../components/admin/settings/TestimonialsSettings";
import WhatsAppSettings from "../../components/admin/settings/WhatsAppSettings";
import SEOSettings from "../../components/admin/settings/SEOSettings";
import { adminAPI } from "../../api/admin";
import Loading from "../../utils/Loading";
import SectionOrderSettings from "../../components/admin/settings/SectionOrderSettings";

export default function AdminHomeSettings() {
  const [activeTab, setActiveTab] = useState("slider");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homeSettings, setHomeSettings] = useState(null);

  // تحميل جميع إعدادات الصفحة الرئيسية
  useEffect(() => {
    const fetchHomeSettings = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getSettings();
        setHomeSettings(response.data);
      } catch (error) {
        console.error("Error fetching home settings:", error);
        toast.error("فشل في تحميل الإعدادات");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeSettings();
  }, []);

  const saveSection = async (sectionName, data) => {
    setSaving(true);
    try {
      let response;
      switch (sectionName) {
        case "slider":
          response = await adminAPI.updateHomeSlider(data);
          break;
        case "about":
          response = await adminAPI.updateHomeAbout(data);
          break;
        case "cta":
          response = await adminAPI.updateHomeCTA(data);
          break;
        case "albums":
          response = await adminAPI.updateHomeAlbums(data);
          break;
        case "testimonials":
          response = await adminAPI.updateHomeTestimonials(data);
          break;
        case "whatsapp":
          response = await adminAPI.updateHomeWhatsApp(data);
          break;
        case "home_sections":
          response = await adminAPI.updateHomeSections(data);
          break;
        case "seo":
          response = await adminAPI.updateSiteMeta(data);
          break;
        default:
          throw new Error(`Unknown section: ${sectionName}`);
      }
      if (response.success) {
        toast.success(
          `تم حفظ إعدادات ${getSectionArabicName(sectionName)} بنجاح`
        );
        const updatedSettings = await adminAPI.getSettings();
        setHomeSettings(updatedSettings.data);

        return true;
      } else {
        toast.error(response.message || "فشل في الحفظ");
        return false;
      }
    } catch (error) {
      console.error(`Error saving ${sectionName}:`, error);
      toast.error("حدث خطأ أثناء الحفظ");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event, fieldName, setValue) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صحيح");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }
    toast.loading("جاري رفع الصورة...", { id: fieldName });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await adminAPI.uploadFile(formData);
      if (response.success && response.data?.url) {
        setValue(fieldName, response.data.url);
        toast.success("تم رفع الصورة بنجاح", { id: fieldName });
      } else {
        throw new Error(response.message || "No URL in response");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("فشل في رفع الصورة", { id: fieldName });
    }
  };

  const getSectionArabicName = (sectionKey) => {
    const names = {
      slider: "السلايدر",
      about: "النبذة التعريفية",
      cta: "الدعوة لاتخاذ إجراء",
      albums: "الألبومات المميزة",
      testimonials: "التقييمات",
      whatsapp: "واتساب",
      seo: "SEO",
      home_sections: "ترتيب الأقسام",
    };
    return names[sectionKey] || sectionKey;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Settings className="w-8 h-8 text-purple mr-2" />
        إعدادات الصفحة الرئيسية
      </h1>

      <div className="flex mb-6 space-x-4 overflow-x-auto">
        <TabButton
          icon={<Image className="w-5 h-5" />}
          label="السلايدر"
          active={activeTab === "slider"}
          onClick={() => setActiveTab("slider")}
        />
        <TabButton
          icon={<MessageSquare className="w-5 h-5" />}
          label="النبذة التعريفية"
          active={activeTab === "about"}
          onClick={() => setActiveTab("about")}
        />
        <TabButton
          icon={<Palette className="w-5 h-5" />}
          label="الدعوة لاتخاذ إجراء"
          active={activeTab === "cta"}
          onClick={() => setActiveTab("cta")}
        />
        <TabButton
          icon={<Users className="w-5 h-5" />}
          label="الألبومات المميزة"
          active={activeTab === "albums"}
          onClick={() => setActiveTab("albums")}
        />
        <TabButton
          icon={<Edit className="w-5 h-5" />}
          label="التقييمات"
          active={activeTab === "testimonials"}
          onClick={() => setActiveTab("testimonials")}
        />
        <TabButton
          icon={<Smartphone className="w-5 h-5" />}
          label="واتساب"
          active={activeTab === "whatsapp"}
          onClick={() => setActiveTab("whatsapp")}
        />
        <TabButton
          icon={<ToggleLeft className="w-5 h-5" />}
          label="ترتيب الأقسام"
          active={activeTab === "home_sections"}
          onClick={() => setActiveTab("home_sections")}
        />
        <TabButton
          icon={<ToggleRight className="w-5 h-5" />}
          label="SEO"
          active={activeTab === "seo"}
          onClick={() => setActiveTab("seo")}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === "slider" && homeSettings && (
          <SliderSettings
            data={homeSettings}
            onSave={(data) => saveSection("slider", data)}
            saving={saving}
            onImageUpload={handleImageUpload}
          />
        )}
        {activeTab === "about" && homeSettings && (
          <AboutSettings
            data={homeSettings}
            onSave={(data) => saveSection("about", data)}
            saving={saving}
            onImageUpload={handleImageUpload}
          />
        )}
        {activeTab === "cta" && homeSettings && (
          <CTASettings
            data={homeSettings}
            onSave={(data) => saveSection("cta", data)}
            saving={saving}
            onImageUpload={handleImageUpload}
          />
        )}
        {activeTab === "albums" && homeSettings && (
          <AlbumsSettings
            data={homeSettings}
            onSave={(data) => saveSection("albums", data)}
            saving={saving}
          />
        )}
        {activeTab === "testimonials" && homeSettings && (
          <TestimonialsSettings
            data={homeSettings}
            onSave={(data) => saveSection("testimonials", data)}
            saving={saving}
          />
        )}
        {activeTab === "whatsapp" && homeSettings && (
          <WhatsAppSettings
            data={homeSettings}
            onSave={(data) => saveSection("whatsapp", data)}
            saving={saving}
          />
        )}
        {activeTab === "seo" && homeSettings && (
          <SEOSettings
            data={homeSettings}
            onSave={(data) => saveSection("seo", data)}
            saving={saving}
          />
        )}
        {activeTab === "home_sections" && homeSettings && (
          <SectionOrderSettings
            data={homeSettings}
            onSave={(data) => saveSection("home_sections", data)}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}

const TabButton = ({ icon, label, active, onClick }) => (
  <button
    className={`flex items-center px-4 py-2 rounded-lg border whitespace-nowrap ${
      active
        ? "bg-purple text-white border-purple"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
    } focus:outline-none`}
    onClick={onClick}
  >
    {icon}
    <span className="mr-2">{label}</span>
  </button>
);
