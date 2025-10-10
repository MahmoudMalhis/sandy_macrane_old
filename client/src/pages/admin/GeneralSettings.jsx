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
  Upload,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../utils/LoadingSettings";
import { settingsAPI } from "../../api/settings";

export default function GeneralSettings() {
  const [activeTab, setActiveTab] = useState("contact");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        contact_info: {
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
      });

      // حفظ رقم واتساب
      await settingsAPI.updateWhatsAppOwner(data.contact_whatsapp_owner);

      // حفظ روابط التواصل
      await settingsAPI.updateSocialLinks({
        facebook: data.social_facebook,
        instagram: data.social_instagram,
        whatsapp: data.social_whatsapp_business,
      });

      toast.success("✅ تم حفظ الإعدادات بنجاح");

      // إعادة تحميل الإعدادات
      await fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("❌ فشل في حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  // رفع صورة اللوجو
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صحيح");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 2 ميجابايت");
      return;
    }

    try {
      const imageUrl = URL.createObjectURL(file);
      setValue("branding_logo_url", imageUrl);
      toast.success("تم رفع اللوجو بنجاح");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("فشل في رفع اللوجو");
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
    // استدعاء دالة saveSettings التي أضفناها
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
            <ContactSettings
              register={register}
              errors={errors}
            />
          )}

          {/* تبويب وسائل التواصل */}
          {activeTab === "social" && (
            <SocialSettings register={register} errors={errors} />
          )}

          {/* تبويب الهوية البصرية */}
          {activeTab === "branding" && (
            <BrandingSettings
              register={register}
              errors={errors}
              watch={watch}
              onLogoUpload={handleLogoUpload}
            />
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
          رقم واتساب المالك *
        </label>
        <input
          {...register("contact_whatsapp_owner", {
            required: "رقم واتساب مطلوب",
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
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Globe size={16} className="text-blue-500" />
          الموقع الإلكتروني
        </label>
        <input
          {...register("social_website")}
          type="url"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          placeholder="https://sandymacrame.com"
        />
      </div>
    </div>
  </div>
);

// مكون إعدادات الهوية البصرية
const BrandingSettings = ({ register, errors, watch, onLogoUpload }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold mb-4">الهوية البصرية والألوان</h2>

    <div className="grid md:grid-cols-2 gap-8">
      {/* معلومات العلامة التجارية */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم الموقع *
          </label>
          <input
            {...register("branding_site_name", {
              required: "اسم الموقع مطلوب",
            })}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="ساندي مكرمية"
          />
          {errors.branding_site_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.branding_site_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الشعار (Tagline)
          </label>
          <input
            {...register("branding_tagline")}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="فن المكرمية بلمسة عصرية"
          />
        </div>

        {/* ألوان الموقع */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">ألوان الموقع</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اللون الأساسي
              </label>
              <div className="flex items-center gap-2">
                <input
                  {...register("branding_primary_color")}
                  type="color"
                  className="w-16 h-12 border border-gray-300 rounded cursor-pointer appearance-none p-0"
                />
                <input
                  {...register("branding_primary_color")}
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="#8b5f8c"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اللون الثانوي
              </label>
              <div className="flex items-center gap-2">
                <input
                  {...register("branding_secondary_color")}
                  type="color"
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  {...register("branding_secondary_color")}
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="#d8a7c1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                لون التمييز
              </label>
              <div className="flex items-center gap-2">
                <input
                  {...register("branding_accent_color")}
                  type="color"
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  {...register("branding_accent_color")}
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="#a1b08c"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* اللوجو */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          لوجو الموقع
        </h3>

        <div className="space-y-4">
          {/* معاينة اللوجو الحالي */}
          {watch("branding_logo_url") && (
            <div className="text-center">
              <img
                src={watch("branding_logo_url")}
                alt="لوجو الموقع"
                className="w-24 h-24 mx-auto rounded-full border-4 border-gray-200 object-cover"
                loading="lazy"
              />
              <p className="text-sm text-gray-600 mt-2">اللوجو الحالي</p>
            </div>
          )}

          {/* رفع لوجو جديد */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رفع لوجو جديد
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                اضغط لاختيار صورة أو اسحبها هنا
              </p>
              <p className="text-xs text-gray-500 mb-4">
                PNG, JPG, WEBP حتى 2MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={onLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="bg-purple text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-hover transition-colors"
              >
                اختر صورة
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
