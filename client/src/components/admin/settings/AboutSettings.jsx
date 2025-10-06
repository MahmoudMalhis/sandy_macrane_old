// client/src/components/admin/settings/AboutSettings.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, Upload } from "lucide-react";
import Button from "../../common/Button";

export default function AboutSettings({ data, onSave, saving, onImageUpload }) {
  const { register, handleSubmit, watch, setValue } = useForm();

  useEffect(() => {
    if (data?.home_about) {
      const about = data.home_about;
      setValue("about_title", about.title || "");
      setValue("about_subtitle", about.subtitle || "");
      setValue("about_description", about.description || "");
      setValue("about_button_text", about.button_text || "");
      setValue("about_image", about.image || "");
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    const aboutData = {
      title: formData.about_title,
      subtitle: formData.about_subtitle,
      description: formData.about_description,
      button_text: formData.about_button_text,
      image: formData.about_image,
      highlights: formData.about_highlights || [],
    };

    await onSave(aboutData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">إعدادات النبذة التعريفية</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العنوان الرئيسي
              </label>
              <input
                {...register("about_title")}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="فن المكرمية بلمسة عصرية"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العنوان الفرعي
              </label>
              <input
                {...register("about_subtitle")}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="رحلة إبداع تبدأ من القلب"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <textarea
                {...register("about_description")}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="نقدم لكم قطع مكرمية مصنوعة يدوياً بشغف وإتقان..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نص الزر
              </label>
              <input
                {...register("about_button_text")}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="تعرف علينا أكثر"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              صورة القسم
            </label>
            <div className="mt-1">
              {watch("about_image") && (
                <div className="mb-4">
                  <img
                    src={watch("about_image")}
                    alt="معاينة"
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">اضغط لرفع صورة</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP (حد أقصى 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => onImageUpload(e, "about_image", setValue)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} className="px-8">
            <Save size={18} className="ml-2" />
            حفظ إعدادات النبذة
          </Button>
        </div>
      </form>
    </div>
  );
}
