import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../common/Button";
import { Save } from "lucide-react";

// client/src/components/admin/settings/WhatsAppSettings.jsx
export default function WhatsAppSettings({ data, onSave, saving }) {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (data?.home_whatsapp) {
      const whatsapp = data.home_whatsapp;
      setValue("whatsapp_enabled", String(whatsapp.enabled ?? true));
      setValue("whatsapp_show_after_scroll", whatsapp.show_after_scroll ?? 300);
      setValue(
        "whatsapp_business_hours_enabled",
        String(whatsapp.business_hours?.enabled ?? true)
      );
      setValue(
        "whatsapp_business_hours_start",
        whatsapp.business_hours?.start || "09:00"
      );
      setValue(
        "whatsapp_business_hours_end",
        whatsapp.business_hours?.end || "21:00"
      );
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    const whatsappData = {
      enabled: formData.whatsapp_enabled === "true",
      show_after_scroll: parseInt(formData.whatsapp_show_after_scroll) || 300,
      business_hours: {
        enabled: formData.whatsapp_business_hours_enabled === "true",
        start: formData.whatsapp_business_hours_start || "09:00",
        end: formData.whatsapp_business_hours_end || "21:00",
        timezone: "Palestine",
      },
    };

    await onSave(whatsappData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">إعدادات الواتساب العائم</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green mb-4">
            الإعدادات العامة
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تفعيل زر الواتساب
              </label>
              <select
                {...register("whatsapp_enabled")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              >
                <option value={true}>مفعل</option>
                <option value={false}>معطل</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                إظهار الزر بعد التمرير (بكسل)
              </label>
              <input
                {...register("whatsapp_show_after_scroll")}
                type="number"
                min="0"
                max="2000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="300"
              />
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            ساعات العمل
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تفعيل ساعات العمل
              </label>
              <select
                {...register("whatsapp_business_hours_enabled")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              >
                <option value={true}>مفعل</option>
                <option value={false}>معطل</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                بداية العمل
              </label>
              <input
                {...register("whatsapp_business_hours_start")}
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نهاية العمل
              </label>
              <input
                {...register("whatsapp_business_hours_end")}
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} className="px-8">
            <Save size={18} className="ml-2" />
            حفظ إعدادات الواتساب
          </Button>
        </div>
      </form>
    </div>
  );
}
