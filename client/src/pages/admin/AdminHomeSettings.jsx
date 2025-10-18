import { useState } from "react";
import {
  useAdminSettings,
  useUpdateHomeSlider,
  useUpdateHomeAbout,
  useUpdateHomeCTA,
  useUpdateHomeAlbums,
  useUpdateHomeTestimonials,
  useUpdateHomeWhatsApp,
  useUpdateHomeSections,
  useUpdateSiteMeta,
  useUploadFile,
} from "../../hooks/queries/useSettings";
import { toast } from "react-hot-toast";
import {
  Edit,
  Settings,
  Image,
  MessageSquare,
  Palette,
  Users,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import SliderSettings from "../../components/admin/settings/SliderSettings";
import AboutSettings from "../../components/admin/settings/AboutSettings";
import CTASettings from "../../components/admin/settings/CTASettings";
import AlbumsSettings from "../../components/admin/settings/AlbumsSettings";
import TestimonialsSettings from "../../components/admin/settings/TestimonialsSettings";
import SEOSettings from "../../components/admin/settings/SEOSettings";
import Loading from "../../utils/Loading";
import SectionOrderSettings from "../../components/admin/settings/SectionOrderSettings";

export default function AdminHomeSettings() {
  const [activeTab, setActiveTab] = useState("slider");

  const { data: homeSettings, isLoading: loading } = useAdminSettings();

  const updateSliderMutation = useUpdateHomeSlider();
  const updateAboutMutation = useUpdateHomeAbout();
  const updateCTAMutation = useUpdateHomeCTA();
  const updateAlbumsMutation = useUpdateHomeAlbums();
  const updateTestimonialsMutation = useUpdateHomeTestimonials();
  const updateWhatsAppMutation = useUpdateHomeWhatsApp();
  const updateSectionsMutation = useUpdateHomeSections();
  const updateSiteMetaMutation = useUpdateSiteMeta();
  const uploadFileMutation = useUploadFile();

  // تجميع جميع mutations في كائن واحد
  const mutations = {
    slider: updateSliderMutation,
    about: updateAboutMutation,
    cta: updateCTAMutation,
    albums: updateAlbumsMutation,
    testimonials: updateTestimonialsMutation,
    whatsapp: updateWhatsAppMutation,
    home_sections: updateSectionsMutation,
    seo: updateSiteMetaMutation,
  };

  const saving =
    updateSliderMutation.isPending ||
    updateAboutMutation.isPending ||
    updateCTAMutation.isPending ||
    updateAlbumsMutation.isPending ||
    updateTestimonialsMutation.isPending ||
    updateWhatsAppMutation.isPending ||
    updateSectionsMutation.isPending ||
    updateSiteMetaMutation.isPending;

  const saveSection = (sectionName, data) => {
    const mutation = mutations[sectionName];

    if (!mutation) {
      toast.error(`قسم غير معروف: ${sectionName}`);
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      mutation.mutate(data, {
        onSuccess: () => resolve(true),
        onError: () => resolve(false),
      });
    });
  };

  const handleImageUpload = async (event, fieldName, setValue) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صحيح");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    const loadingToastId = toast.loading("جاري رفع الصورة...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await uploadFileMutation.mutateAsync(formData);

      if (data?.url) {
        setValue(fieldName, data.url);
        toast.success("تم رفع الصورة بنجاح", { id: loadingToastId });
      } else {
        throw new Error("لا يوجد رابط في الاستجابة");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("فشل في رفع الصورة", { id: loadingToastId });
    }
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
