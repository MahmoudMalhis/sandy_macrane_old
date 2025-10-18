import { useEffect } from "react";
import {
  useContactSettings,
  useUpdateContactSettings,
} from "../../hooks/queries/useSettings";
import { useForm } from "react-hook-form";
import { Save, Settings, Phone, Facebook, Instagram, Mail } from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../utils/LoadingSettings";
import Error from "../../utils/Error";

export default function GeneralSettings() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    data: settingsData,
    isLoading: loading,
    isError,
  } = useContactSettings();

  const updateSettingsMutation = useUpdateContactSettings();

  useEffect(() => {
    if (settingsData) {
      Object.entries(settingsData).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [settingsData, setValue]);

  const onSubmit = async (data) => {
    updateSettingsMutation.mutate(data);
  };

  if (loading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Settings className="w-8 h-8 text-purple mr-2" />
        الإعدادات العامة
      </h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ContactSettings register={register} errors={errors} />
          <SocialSettings register={register} errors={errors} />
          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              loading={updateSettingsMutation.isPending}
              className="px-8"
            >
              <Save size={18} className="ml-2" />
              حفظ إعدادات
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ContactSettings = ({ register, errors }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold mb-4">معلومات التواصل الأساسية</h2>

    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Phone size={16} className="text-green-600" />
          رقم الهاتف والواتساب 
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
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Mail size={16} className="text-red-600" />
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
    </div>
  </div>
);
