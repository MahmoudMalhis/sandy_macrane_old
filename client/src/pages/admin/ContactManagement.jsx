import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  Save,
  Settings,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  MapPin,
  Clock,
  MessageCircle,
  Eye,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../utils/LoadingSettings";
import { settingsAPI } from "../../api/settings";

export default function ContactManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadContactSettings();
  }, []);

  const loadContactSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getAdminSettings();

      if (response?.success) {
        const settings = response.data;

        // Contact info
        setValue("contact_whatsapp", settings.contact_info?.whatsapp || "");
        setValue("contact_email", settings.contact_info?.email || "");
        setValue("contact_address", settings.contact_info?.address || "");

        // Working hours
        setValue(
          "working_hours_weekdays",
          settings.contact_info?.working_hours?.weekdays || ""
        );
        setValue(
          "working_hours_weekend",
          settings.contact_info?.working_hours?.weekend || ""
        );

        // Social media
        setValue(
          "social_facebook",
          settings.contact_info?.social?.facebook || ""
        );
        setValue(
          "social_instagram",
          settings.contact_info?.social?.instagram || ""
        );
      }
    } catch (error) {
      console.error("Error loading contact settings:", error);
      toast.error("فشل في تحميل إعدادات التواصل");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const contactData = {
        contact_info: {
          whatsapp: data.contact_whatsapp,
          email: data.contact_email,
          address: data.contact_address,
          working_hours: {
            weekdays: data.working_hours_weekdays,
            weekend: data.working_hours_weekend,
          },
          social: {
            facebook: data.social_facebook,
            instagram: data.social_instagram,
          },
        },
      };

      const response = await settingsAPI.updateContactInfo(contactData);

      if (response?.success) {
        toast.success("تم حفظ إعدادات التواصل بنجاح");
      } else {
        throw new Error("فشل في الحفظ");
      }
    } catch (error) {
      console.error("Error saving contact settings:", error);
      toast.error("فشل في حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open("/contact", "_blank");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <MessageCircle className="w-8 h-8 text-purple mr-2" />
              إدارة صفحة التواصل
            </h1>
            <p className="text-gray-600">
              تحرير معلومات التواصل وإعدادات الصفحة
            </p>
          </div>

          <Button
            onClick={handlePreview}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye size={18} />
            معاينة الصفحة
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Phone className="w-5 h-5 text-purple mr-2" />
              معلومات التواصل الأساسية
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم واتساب *
                </label>
                <input
                  {...register("contact_whatsapp", {
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
                {errors.contact_whatsapp && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contact_whatsapp.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان
              </label>
              <input
                {...register("contact_address")}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="نابلس، فلسطين"
              />
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Clock className="w-5 h-5 text-purple mr-2" />
              ساعات العمل
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  أيام الأسبوع
                </label>
                <input
                  {...register("working_hours_weekdays")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="الأحد - الخميس: 9:00 ص - 9:00 م"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عطلة نهاية الأسبوع
                </label>
                <input
                  {...register("working_hours_weekend")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="الجمعة - السبت: 12:00 ظ - 6:00 م"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Globe className="w-5 h-5 text-purple mr-2" />
              وسائل التواصل الاجتماعي
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              loading={saving}
              className="px-8 py-3 text-lg"
            >
              <Save size={20} className="ml-2" />
              حفظ إعدادات التواصل
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
