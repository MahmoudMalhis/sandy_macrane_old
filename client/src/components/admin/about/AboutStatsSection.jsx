// client/src/components/admin/about/AboutStatsSection.jsx
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Save,
  Plus,
  Trash2,
  Users,
  Palette,
  Star,
  Clock,
  TrendingUp,
} from "lucide-react";
import Button from "../../common/Button";

export default function AboutStatsSection({ data, onSave, saving }) {
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
      setValue("items", data.items || []);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    await onSave(formData);
  };

  const addStat = () => {
    append({
      number: "",
      label: "",
      icon: "users",
    });
  };

  const iconOptions = [
    { value: "users", label: "👥 أشخاص", Icon: Users },
    { value: "palette", label: "🎨 أعمال", Icon: Palette },
    { value: "star", label: "⭐ تقييم", Icon: Star },
    { value: "clock", label: "⏰ زمن", Icon: Clock },
    { value: "trending", label: "📈 نمو", Icon: TrendingUp },
  ];

  const getIconComponent = (iconName) => {
    const option = iconOptions.find((opt) => opt.value === iconName);
    return option ? option.Icon : Users;
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">الإحصائيات</h2>
        <p className="text-gray-600 mt-1">
          الأرقام والإنجازات التي تعكس نجاح المشروع
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              الإحصائيات (يُنصح بـ 3-4 إحصائيات)
            </label>
            <Button
              type="button"
              onClick={addStat}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة إحصائية
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
                        إحصائية {index + 1}
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

                    {/* Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الرقم *
                      </label>
                      <input
                        {...register(`items.${index}.number`, {
                          required: "الرقم مطلوب",
                        })}
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                        placeholder="مثال: 500+"
                      />
                      {errors.items?.[index]?.number && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.items[index].number.message}
                        </p>
                      )}
                    </div>

                    {/* Label */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الوصف *
                      </label>
                      <input
                        {...register(`items.${index}.label`, {
                          required: "الوصف مطلوب",
                        })}
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                        placeholder="مثال: عميل سعيد"
                      />
                      {errors.items?.[index]?.label && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.items[index].label.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">لم يتم إضافة أي إحصائيات بعد</p>
              <Button
                type="button"
                onClick={addStat}
                size="sm"
                variant="outline"
              >
                إضافة إحصائية الآن
              </Button>
            </div>
          )}
        </div>

        {/* Preview */}
        {fields.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed">
            <p className="text-sm font-medium text-gray-600 mb-4">معاينة:</p>
            <div className="grid md:grid-cols-4 gap-4">
              {fields.map((field, index) => {
                const IconComponent = getIconComponent(field.icon);
                return (
                  <div
                    key={field.id}
                    className="text-center bg-white p-4 rounded-lg"
                  >
                    <div className="bg-purple text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <IconComponent size={20} />
                    </div>
                    <div className="text-2xl font-bold text-purple mb-1">
                      {field.number || "---"}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {field.label || "---"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
