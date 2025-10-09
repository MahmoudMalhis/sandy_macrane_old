import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Save,
  Eye,
  FileText,
  Heart,
  Users,
  Calendar,
  Search as SearchIcon,
  Settings,
  Camera,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../utils/Loading";
import { aboutPageAPI } from "../../api/aboutPage";

import AboutHeroSection from "../../components/admin/about/AboutHeroSection";
import AboutStorySection from "../../components/admin/about/AboutStorySection";
import AboutValuesSection from "../../components/admin/about/AboutValuesSection";
import AboutWorkshopSection from "../../components/admin/about/AboutWorkshopSection";
import AboutTimelineSection from "../../components/admin/about/AboutTimelineSection";
import AboutSEOSection from "../../components/admin/about/AboutSEOSection";
import { adminAPI } from "../../api/admin";

const TabButton = ({ icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
      active
        ? "bg-purple text-white shadow-md"
        : "bg-white text-gray-600 hover:bg-gray-100"
    }`}
  >
    {icon}
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

export default function AboutPageSettings() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await aboutPageAPI.getAdmin();

      if (response.success) {
        setSettings(response.data);
      } else {
        toast.error("فشل في تحميل الإعدادات");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("حدث خطأ في تحميل الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (sectionName, data) => {
    setSaving(true);
    try {
      let response;

      switch (sectionName) {
        case "hero":
          response = await aboutPageAPI.updateHero(data);
          break;
        case "story":
          response = await aboutPageAPI.updateStory(data);
          break;
        case "values":
          response = await aboutPageAPI.updateValues(data);
          break;
        case "workshop":
          response = await aboutPageAPI.updateWorkshop(data);
          break;
        case "timeline":
          response = await aboutPageAPI.updateTimeline(data);
          break;
        case "seo":
          response = await aboutPageAPI.updateSEO(data);
          break;
        default:
          throw new Error("Unknown section");
      }

      if (response.success) {
        toast.success("تم الحفظ بنجاح");
        setSettings((prev) => ({
          ...prev,
          [`about_${sectionName}`]: data,
        }));
      } else {
        toast.error("فشل في الحفظ");
      }
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await adminAPI.uploadFile(formData);

      if (response.success) {
        return response.data.url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("فشل رفع الصورة");
      return null;
    }
  };

  const handlePreview = () => {
    window.open("/about", "_blank");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8 text-purple" />
              إعدادات صفحة من نحن
            </h1>
            <p className="text-gray-600">إدارة محتوى صفحة "من نحن" بالكامل</p>
          </div>

          <Button
            onClick={handlePreview}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            معاينة الصفحة
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton
            icon={<FileText className="w-5 h-5" />}
            label="البانر الرئيسي"
            active={activeTab === "hero"}
            onClick={() => setActiveTab("hero")}
          />
          <TabButton
            icon={<FileText className="w-5 h-5" />}
            label="قصتنا"
            active={activeTab === "story"}
            onClick={() => setActiveTab("story")}
          />
          <TabButton
            icon={<Heart className="w-5 h-5" />}
            label="قيمنا"
            active={activeTab === "values"}
            onClick={() => setActiveTab("values")}
          />
          <TabButton
            icon={<Camera className="w-5 h-5" />}
            label="ورشة العمل"
            active={activeTab === "workshop"}
            onClick={() => setActiveTab("workshop")}
          />
          <TabButton
            icon={<Calendar className="w-5 h-5" />}
            label="رحلتنا"
            active={activeTab === "timeline"}
            onClick={() => setActiveTab("timeline")}
          />
          <TabButton
            icon={<SearchIcon className="w-5 h-5" />}
            label="SEO"
            active={activeTab === "seo"}
            onClick={() => setActiveTab("seo")}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === "hero" && (
            <AboutHeroSection
              data={settings?.about_hero}
              onSave={(data) => saveSection("hero", data)}
              saving={saving}
              onImageUpload={handleImageUpload}
            />
          )}

          {activeTab === "story" && (
            <AboutStorySection
              data={settings?.about_story}
              onSave={(data) => saveSection("story", data)}
              saving={saving}
              onImageUpload={handleImageUpload}
            />
          )}

          {activeTab === "values" && (
            <AboutValuesSection
              data={settings?.about_values}
              onSave={(data) => saveSection("values", data)}
              saving={saving}
            />
          )}

          {activeTab === "workshop" && (
            <AboutWorkshopSection
              data={settings?.about_workshop}
              onSave={(data) => saveSection("workshop", data)}
              saving={saving}
              onImageUpload={handleImageUpload}
            />
          )}

          {activeTab === "timeline" && (
            <AboutTimelineSection
              data={settings?.about_timeline}
              onSave={(data) => saveSection("timeline", data)}
              saving={saving}
            />
          )}

          {activeTab === "seo" && (
            <AboutSEOSection
              data={settings?.about_seo}
              onSave={(data) => saveSection("seo", data)}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
