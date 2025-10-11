// client/src/pages/admin/GeneralSettings.jsx
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  Save,
  Settings,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Palette,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../utils/LoadingSettings";
import { settingsAPI } from "../../api/settings";
import { useSettings } from "../../context/SettingsContext";

export default function GeneralSettings() {
  const [activeTab, setActiveTab] = useState("contact");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { refreshSettings } = useSettings();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchSettings();
  }, [setValue]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getAdminSettings();

      if (response?.success) {
        const data = response.data;

        const loadedSettings = {
          contact: {
            whatsapp_owner: data.whatsapp_owner || "",
            email: data.contact_info?.email || "",
            address: data.contact_info?.address || "",
            business_hours: {
              weekdays: data.contact_info?.working_hours?.weekdays || "",
              weekend: data.contact_info?.working_hours?.weekend || "",
            },
          },
          social: {
            facebook:
              data.social_links?.facebook ||
              data.contact_info?.social?.facebook ||
              "",
            instagram:
              data.social_links?.instagram ||
              data.contact_info?.social?.instagram ||
              "",
            whatsapp_business: data.whatsapp_owner || "",
          },
        };

        setValue(
          "contact_whatsapp_owner",
          loadedSettings.contact.whatsapp_owner
        );
        setValue("contact_email", loadedSettings.contact.email);
        setValue("contact_address", loadedSettings.contact.address);
        setValue(
          "business_hours_weekdays",
          loadedSettings.contact.business_hours.weekdays
        );
        setValue(
          "business_hours_weekend",
          loadedSettings.contact.business_hours.weekend
        );
        setValue("social_facebook", loadedSettings.social.facebook);
        setValue("social_instagram", loadedSettings.social.instagram);
        setValue(
          "social_whatsapp_business",
          loadedSettings.social.whatsapp_business
        );
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("فشل في تحميل الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (data) => {
    setSaving(true);
    try {
      await settingsAPI.updateContactInfo({
        whatsapp_owner: data.contact_whatsapp_owner,
        contact_info: {
          whatsapp: data.contact_whatsapp_owner,
          email: data.contact_email,
          address: data.contact_address,
          working_hours: {
            weekdays: data.business_hours_weekdays,
            weekend: data.business_hours_weekend,
          },
          social: {
            facebook: data.social_facebook,
            instagram: data.social_instagram,
          },
        },
        social_links: {
          facebook: data.social_facebook,
          instagram: data.social_instagram,
          whatsapp_business: data.social_whatsapp_business,
        },
      });

      toast.success("✅ تم حفظ الإعدادات بنجاح");

      await fetchSettings();

      // ✅ تحديث Context
      refreshSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("❌ فشل في حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  const getSectionArabicName = (sectionKey) => {
    const names = {
      contact: "معلومات التواصل",
      social: "وسائل التواصل الاجتماعي",
      branding: "الهوية البصرية",
    };
    return names[sectionKey] || sectionKey;
  };

  if (loading) {
    return <Loading />;
  }

  const onSubmit = async (data) => {
    await saveSettings(data);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Settings className="w-8 h-8 text-purple mr-2" />
        الإعدادات العامة
      </h1>

      {/* التبويبات */}
      <div className="flex mb-6 space-x-4 overflow-x-auto">
        <TabButton
          icon={<Phone className="w-5 h-5" />}
          label="معلومات التواصل"
          active={activeTab === "contact"}
          onClick={() => setActiveTab("contact")}
        />
        <TabButton
          icon={<Globe className="w-5 h-5" />}
          label="وسائل التواصل"
          active={activeTab === "social"}
          onClick={() => setActiveTab("social")}
        />
        <TabButton
          icon={<Palette className="w-5 h-5" />}
          label="الهوية البصرية"
          active={activeTab === "branding"}
          onClick={() => setActiveTab("branding")}
        />
      </div>

      {/* محتوى التبويبات */}
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* تبويب معلومات التواصل */}
          {activeTab === "contact" && (
            <ContactSettings register={register} errors={errors} />
          )}

          {/* تبويب وسائل التواصل */}
          {activeTab === "social" && (
            <SocialSettings register={register} errors={errors} />
          )}

          {/* زر الحفظ */}
          <div className="flex justify-end pt-6 border-t">
            <Button type="submit" loading={saving} className="px-8">
              <Save size={18} className="ml-2" />
              حفظ إعدادات {getSectionArabicName(activeTab)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// مكون زر التبويب
const TabButton = ({ icon, label, active, onClick }) => (
  <button
    className={`flex items-center px-4 py-2 rounded-lg border whitespace-nowrap ${
      active
        ? "bg-purple text-white border-purple"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
    } focus:outline-none transition-colors`}
    onClick={onClick}
    type="button"
  >
    {icon}
    <span className="mr-2">{label}</span>
  </button>
);

// مكون إعدادات التواصل
const ContactSettings = ({ register, errors }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold mb-4">معلومات التواصل الأساسية</h2>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رقم الهاتف *
        </label>
        <input
          {...register("contact_whatsapp_owner", {
            required: "رقم الهاتف مطلوب",
            pattern: {
              value: /^[0-9+]+$/,
              message: "رقم غير صحيح",
            },
          })}
          type="tel"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          placeholder="970599123456"
        />
        {errors.contact_whatsapp_owner && (
          <p className="text-red-500 text-sm mt-1">
            {errors.contact_whatsapp_owner.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          البريد الإلكتروني
        </label>
        <input
          {...register("contact_email", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "بريد إلكتروني غير صحيح",
            },
          })}
          type="email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          placeholder="sandy@example.com"
        />
        {errors.contact_email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.contact_email.message}
          </p>
        )}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        العنوان
      </label>
      <input
        {...register("contact_address")}
        type="text"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
        placeholder="نابلس، فلسطين"
      />
    </div>

    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">ساعات العمل</h3>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            من الساعة
          </label>
          <input
            {...register("contact_business_hours_start")}
            type="time"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            إلى الساعة
          </label>
          <input
            {...register("contact_business_hours_end")}
            type="time"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            أيام العمل
          </label>
          <input
            {...register("contact_business_hours_days")}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="الأحد - الخميس"
          />
        </div>
      </div>
    </div>
  </div>
);

const SocialSettings = ({ register }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold mb-4">
      روابط وسائل التواصل الاجتماعي
    </h2>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Facebook size={16} className="text-blue-600" />
          صفحة فيسبوك
        </label>
        <input
          {...register("social_facebook")}
          type="url"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          placeholder="https://facebook.com/sandymacrame"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Instagram size={16} className="text-pink-600" />
          حساب إنستجرام
        </label>
        <input
          {...register("social_instagram")}
          type="url"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          placeholder="https://instagram.com/sandymacrame"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Phone size={16} className="text-green-600" />
          واتساب بزنس
        </label>
        <input
          {...register("social_whatsapp_business")}
          type="tel"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          placeholder="970599123456"
        />
      </div>
    </div>
  </div>
);
