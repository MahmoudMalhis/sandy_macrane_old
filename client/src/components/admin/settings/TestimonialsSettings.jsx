import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../common/Button";
import { Save } from "lucide-react";

// client/src/components/admin/settings/TestimonialsSettings.jsx
export default function TestimonialsSettings ({ data, onSave, saving }) {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (data?.home_testimonials) {
      const testimonials = data.home_testimonials;
      setValue("testimonials_section_title", testimonials.section_title || "");
      setValue("testimonials_section_description", testimonials.section_description || "");
      setValue("testimonials_button_text", testimonials.button_text || "");
      setValue("testimonials_show_count", testimonials.show_count || 4);
      setValue("testimonials_min_rating", testimonials.min_rating || 4);
      setValue("testimonials_autoplay", testimonials.autoplay || true);
      setValue("testimonials_autoplay_delay", testimonials.autoplay_delay || 6000);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    const testimonialsData = {
      section_title: formData.testimonials_section_title,
      section_description: formData.testimonials_section_description,
      button_text: formData.testimonials_button_text,
      show_count: parseInt(formData.testimonials_show_count),
      min_rating: parseInt(formData.testimonials_min_rating),
      autoplay: formData.testimonials_autoplay,
      autoplay_delay: parseInt(formData.testimonials_autoplay_delay),
    };

    await onSave("testimonials", testimonialsData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">إعدادات آراء العملاء</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان القسم
            </label>
            <input
              {...register("testimonials_section_title")}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="ماذا يقول عملاؤنا"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نص الزر
            </label>
            <input
              {...register("testimonials_button_text")}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="شاهد جميع التقييمات"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            وصف القسم
          </label>
          <textarea
            {...register("testimonials_section_description")}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="آراء حقيقية من عملائنا الكرام..."
          />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عدد التقييمات المعروضة
            </label>
            <input
              {...register("testimonials_show_count")}
              type="number"
              min="1"
              max="10"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              أقل تقييم مقبول
            </label>
            <select
              {...register("testimonials_min_rating")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            >
              <option value="1">نجمة واحدة</option>
              <option value="2">نجمتان</option>
              <option value="3">3 نجوم</option>
              <option value="4">4 نجوم</option>
              <option value="5">5 نجوم</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              التشغيل التلقائي
            </label>
            <select
              {...register("testimonials_autoplay")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            >
              <option value={true}>مفعل</option>
              <option value={false}>معطل</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مدة التشغيل (بالثواني)
            </label>
            <input
              {...register("testimonials_autoplay_delay")}
              type="number"
              min="1000"
              max="20000"
              step="1000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="6000"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} className="px-8">
            <Save size={18} className="ml-2" />
            حفظ إعدادات التقييمات
          </Button>
        </div>
      </form>
    </div>
  );
}