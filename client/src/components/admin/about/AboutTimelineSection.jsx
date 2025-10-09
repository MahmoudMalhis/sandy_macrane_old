import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Plus, Trash2, Calendar } from "lucide-react";
import Button from "../../common/Button";

export default function AboutTimelineSection({ data, onSave, saving }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      events: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "events",
  });

  useEffect(() => {
    if (data) {
      setValue("title", data.title || "");
      setValue("events", data.events || []);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    await onSave(formData);
  };

  const addEvent = () => {
    append({
      year: "",
      title: "",
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">رحلتنا</h2>
        <p className="text-gray-600 mt-1">المحطات المهمة في تاريخ المشروع</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان القسم *
          </label>
          <input
            {...register("title", { required: "العنوان مطلوب" })}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="رحلتنا"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              الأحداث
            </label>
            <Button
              type="button"
              onClick={addEvent}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              إضافة حدث
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-purple" size={20} />
                    <span className="font-medium text-gray-700">
                      حدث {index + 1}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الأيقونة
                    </label>
                    <select
                      {...register(`events.${index}.icon`)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    >
                      <option value="heart">❤️ قلب</option>
                      <option value="award">🏆 جائزة</option>
                      <option value="target">🎯 هدف</option>
                      <option value="sparkles">✨ نجوم</option>
                      <option value="lightbulb">💡 فكرة</option>
                      <option value="star">⭐ نجمة</option>
                      <option value="calendar">📅 تقويم</option>
                      <option value="rocket">🚀 صاروخ</option>
                    </select>
                  </div>
                  <input
                    {...register(`events.${index}.year`)}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="السنة (مثال: 2020)"
                  />

                  <input
                    {...register(`events.${index}.title`)}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="عنوان الحدث"
                  />

                  <textarea
                    {...register(`events.${index}.description`)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    placeholder="وصف الحدث"
                  />
                </div>
              </div>
            ))}
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">لم يتم إضافة أي أحداث بعد</p>
              <Button
                type="button"
                onClick={addEvent}
                size="sm"
                variant="outline"
              >
                إضافة حدث الآن
              </Button>
            </div>
          )}
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
