import { useState } from "react";
import {
  useAdminAboutPage,
  useUpdateAboutHero,
  useUpdateAboutStats,
  useUpdateAboutStory,
  useUpdateAboutValues,
  useUpdateAboutWorkshop,
  useUpdateAboutTimeline,
  useUpdateAboutSEO,
  useUploadAboutImage,
} from "../../hooks/queries/useAboutPage";
import { toast } from "react-hot-toast";
import {
  FileText,
  Heart,
  Calendar,
  Search as SearchIcon,
  TrendingUp,
  Camera,
} from "lucide-react";
import Loading from "../../utils/Loading";
import AboutHeroSection from "../../components/admin/about/AboutHeroSection";
import AboutStorySection from "../../components/admin/about/AboutStorySection";
import AboutValuesSection from "../../components/admin/about/AboutValuesSection";
import AboutWorkshopSection from "../../components/admin/about/AboutWorkshopSection";
import AboutTimelineSection from "../../components/admin/about/AboutTimelineSection";
import AboutSEOSection from "../../components/admin/about/AboutSEOSection";
import AboutStatsSection from "../../components/admin/about/AboutStatsSection";

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

  const { data: settings, isLoading: loading } = useAdminAboutPage();

  const updateHeroMutation = useUpdateAboutHero();
  const updateStatsMutation = useUpdateAboutStats();
  const updateStoryMutation = useUpdateAboutStory();
  const updateValuesMutation = useUpdateAboutValues();
  const updateWorkshopMutation = useUpdateAboutWorkshop();
  const updateTimelineMutation = useUpdateAboutTimeline();
  const updateSEOMutation = useUpdateAboutSEO();
  const uploadImageMutation = useUploadAboutImage();

  const mutations = {
    hero: updateHeroMutation,
    stats: updateStatsMutation,
    story: updateStoryMutation,
    values: updateValuesMutation,
    workshop: updateWorkshopMutation,
    timeline: updateTimelineMutation,
    seo: updateSEOMutation,
  };

  const saving = Object.values(mutations).some((m) => m.isPending);
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

  const handleImageUpload = async (file) => {
    if (!file) return null;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صحيح");
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return null;
    }

    const loadingToastId = toast.loading("جاري رفع الصورة...");

    try {
      const url = await uploadImageMutation.mutateAsync(file);
      toast.success("تم رفع الصورة بنجاح", { id: loadingToastId });
      return url;
    } catch {
      toast.dismiss(loadingToastId);
      return null;
    }
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
            icon={<TrendingUp className="w-5 h-5" />}
            label="الإحصائيات"
            active={activeTab === "stats"}
            onClick={() => setActiveTab("stats")}
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

          {activeTab === "stats" && (
            <AboutStatsSection
              data={settings?.about_stats}
              onSave={(data) => saveSection("stats", data)}
              saving={saving}
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
