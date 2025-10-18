// client/src/components/admin/about/AboutWorkshopSection.jsx
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import Button from "../../common/Button";

export default function AboutWorkshopSection({
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
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  useEffect(() => {
    if (data) {
      setValue("title", data.title || "");
      setValue("description", data.description || "");
      setValue("images", data.images || []);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    await onSave(formData);
  };

  const addImage = () => {
    append({
      src: "",
      alt: "",
      title: "",
    });
  };

  const handleImageUploadForIndex = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await onImageUpload(file);
      if (imageUrl) {
        setValue(`images.${index}.src`, imageUrl);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">داخل ورشة العمل</h2>
        <p className="text-gray-600 mt-1">صور من داخل ورشة العمل مع تعليقات</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان القسم *
          </label>
          <input
            {...register("title", { required: "العنوان مطلوب" })}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="داخل ورشة العمل"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Section Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            وصف القسم
          </label>
          <textarea
            {...register("description")}
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="نظرة على المكان الذي تولد فيه الأفكار..."
          />
        </div>

        {/* Images */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              صور الورشة
            </label>
            <Button
              type="button"
              onClick={addImage}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة صورة
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((field, index) => {
              const imageSrc = watch(`images.${index}.src`);

              return (
                <div
                  key={field.id}
                  className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="text-purple" size={20} />
                      <span className="font-medium text-gray-700">
                        صورة {index + 1}
                      </span>
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

                  <div className="space-y-3">
                    {/* Image Preview */}
                    {imageSrc && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <img
                          src={imageSrc}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="text-center">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple text-white rounded-lg cursor-pointer hover:bg-purple-dark transition-colors text-sm">
                        <Upload size={16} />
                        <span>رفع صورة</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUploadForIndex(e, index)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Image URL */}
                    <input
                      {...register(`images.${index}.src`)}
                      type="url"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="رابط الصورة"
                    />

                    {/* Image Title */}
                    <input
                      {...register(`images.${index}.title`)}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="عنوان الصورة (مثال: أدوات العمل)"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">لم يتم إضافة أي صور بعد</p>
              <Button
                type="button"
                onClick={addImage}
                size="sm"
                variant="outline"
              >
                إضافة صورة الآن
              </Button>
            </div>
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
