// client/src/components/admin/about/AboutValuesSection.jsx
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Save,
  Plus,
  Trash2,
  Heart,
  Award,
  Target,
  Sparkles,
} from "lucide-react";
import Button from "../../common/Button";

export default function AboutValuesSection({ data, onSave, saving }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (data) {
      setValue("title", data.title || "");
      setValue("items", data.items || []);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    await onSave(formData);
  };

  const addValue = () => {
    append({
      title: "",
      description: "",
      icon: "heart",
    });
  };

  const iconOptions = [
    { value: "heart", label: "قلب", Icon: Heart },
    { value: "award", label: "جائزة", Icon: Award },
    { value: "target", label: "هدف", Icon: Target },
    { value: "sparkles", label: "نجوم", Icon: Sparkles },
  ];

  const getIconComponent = (iconName) => {
    const option = iconOptions.find((opt) => opt.value === iconName);
    return option ? option.Icon : Heart;
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">قيمنا</h2>
        <p className="text-gray-600 mt-1">
          القيم والمبادئ التي نؤمن بها ونعمل من خلالها
        </p>
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
            placeholder="قيمنا"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Values List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              القيم
            </label>
            <Button
              type="button"
              onClick={addValue}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة قيمة
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => {
              const IconComponent = getIconComponent(field.icon);

              return (
                <div
                  key={field.id}
                  className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="text-purple" size={20} />
                      <span className="font-medium text-gray-700">
                        القيمة {index + 1}
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
                    {/* Icon Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الأيقونة
                      </label>
                      <select
                        {...register(`items.${index}.icon`)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      >
                        {iconOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Value Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        العنوان *
                      </label>
                      <input
                        {...register(`items.${index}.title`, {
                          required: "العنوان مطلوب",
                        })}
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                        placeholder="مثال: الجودة"
                      />
                      {errors.items?.[index]?.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.items[index].title.message}
                        </p>
                      )}
                    </div>

                    {/* Value Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الوصف
                      </label>
                      <textarea
                        {...register(`items.${index}.description`)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                        placeholder="وصف القيمة..."
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">لم يتم إضافة أي قيم بعد</p>
              <Button
                type="button"
                onClick={addValue}
                size="sm"
                variant="outline"
              >
                إضافة قيمة الآن
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
