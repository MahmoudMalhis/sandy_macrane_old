import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../common/Button";
import { Save } from "lucide-react";

// client/src/components/admin/settings/SEOSettings.jsx
export default function SEOSettings({ data, onSave, saving }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (data?.site_meta) {
      const meta = data.site_meta;
      setValue("site_title", meta.title || "");
      setValue("site_description", meta.description || "");
      setValue("site_keywords", meta.keywords || "");
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    const metaData = {
      title: formData.site_title,
      description: formData.site_description,
      keywords: formData.site_keywords,
    };

    await onSave(metaData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">إعدادات SEO والموقع</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            عنوان الموقع
          </label>
          <input
            {...register("site_title", { required: "عنوان الموقع مطلوب" })}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="ساندي مكرمية - Sandy Macrame"
          />
          {errors.site_title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.site_title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            وصف الموقع
          </label>
          <textarea
            {...register("site_description")}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="أجمل أعمال المكرمية والبراويز اليدوية من ساندي مكرمية"
          />
          <p className="text-sm text-gray-500 mt-1">
            سيظهر هذا الوصف في نتائج البحث ووسائل التواصل الاجتماعي
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الكلمات المفتاحية
          </label>
          <input
            {...register("site_keywords")}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="مكرمية, براويز, ساندي, يدوية, فلسطين"
          />
          <p className="text-sm text-gray-500 mt-1">
            افصل بين الكلمات بفاصلة (,)
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} className="px-8">
            <Save size={18} className="ml-2" />
            حفظ إعدادات SEO
          </Button>
        </div>
      </form>
    </div>
  );
}
