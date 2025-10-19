import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Upload, Plus, Trash2, Star } from "lucide-react";
import Button from "../../common/Button";

export default function AboutStorySection({
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
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      highlights: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "highlights",
  });

  const storyImage = watch("image");

  useEffect(() => {
    if (data) {
      setValue("title", data.title || "");
      setValue("content", data.content || "");
      setValue("image", data.image || "");
      setValue("highlights", data.highlights || []);
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
        setValue("image", imageUrl);
      }
    }
  };

  const addHighlight = () => {
    append({ text: "" });
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">قصتنا</h2>
        <p className="text-gray-600 mt-1">اسرد قصة مشروعك ورحلتك الإبداعية</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان القسم *
          </label>
          <input
            {...register("title", { required: "العنوان مطلوب" })}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="قصتنا"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المحتوى *
          </label>
          <textarea
            {...register("content", { required: "المحتوى مطلوب" })}
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="اكتب قصتك هنا... كيف بدأت؟ ما الذي يحفزك؟"
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Story Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صورة القسم
          </label>

          {storyImage && (
            <div className="mb-3 relative rounded-lg overflow-hidden border">
              <img
                src={storyImage}
                alt="Story preview"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue("image", "")}
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
          </div>

          <input
            {...register("image")}
            type="url"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent mt-2"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Highlights */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              نقاط مميزة (اختياري)
            </label>
            <Button
              type="button"
              onClick={addHighlight}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة نقطة
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-purple flex-shrink-0" />
                    <input
                      {...register(`highlights.${index}.text`)}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="مثال: أكثر من 500 قطعة مصنوعة يدوياً"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>

          {fields.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4 border-2 border-dashed rounded-lg">
              لم يتم إضافة أي نقاط مميزة بعد
            </p>
          )}
        </div>

        {/* Submit Button */}
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
