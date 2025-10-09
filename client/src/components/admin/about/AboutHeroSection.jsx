// client/src/components/admin/about/AboutHeroSection.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, Upload, Image as ImageIcon } from "lucide-react";
import Button from "../../common/Button";

export default function AboutHeroSection({
  data,
  onSave,
  saving,
  onImageUpload,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const backgroundImage = watch("background_image");

  useEffect(() => {
    if (data) {
      setValue("title", data.title || "");
      setValue("subtitle", data.subtitle || "");
      setValue("description", data.description || "");
      setValue("background_image", data.background_image || "");
      setValue("cta_text", data.cta_text || "");
      setValue("cta_link", data.cta_link || "");
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    await onSave(formData);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await onImageUpload(file);
      if (imageUrl) {
        setValue("background_image", imageUrl);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">البانر الرئيسي</h2>
        <p className="text-gray-600 mt-1">
          القسم الأول الذي يراه الزوار في صفحة من نحن
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان الرئيسي *
          </label>
          <input
            {...register("title", { required: "العنوان مطلوب" })}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="من نحن"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان الفرعي
          </label>
          <input
            {...register("subtitle")}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="قصة إبداع وشغف"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="نص تعريفي مختصر..."
          />
        </div>

        {/* Background Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صورة الخلفية
          </label>

          {backgroundImage && (
            <div className="mb-3 relative rounded-lg overflow-hidden border">
              <img
                src={backgroundImage}
                alt="Background preview"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue("background_image", "")}
                  className="bg-white"
                >
                  إزالة
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-purple text-white rounded-lg cursor-pointer hover:bg-purple-dark transition-colors">
              <Upload size={18} />
              <span>رفع صورة</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-500">أو أدخل رابط الصورة</span>
          </div>

          <input
            {...register("background_image")}
            type="url"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent mt-2"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* CTA Button */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نص الزر
            </label>
            <input
              {...register("cta_text")}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="تعرف على قصتنا"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط الزر
            </label>
            <input
              {...register("cta_link")}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="#story"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </form>
    </div>
  );
}
