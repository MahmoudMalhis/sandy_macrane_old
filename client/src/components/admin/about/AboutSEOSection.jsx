import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, Search } from "lucide-react";
import Button from "../../common/Button";

export default function AboutSEOSection({ data, onSave, saving }) {
  const { register, handleSubmit, watch, setValue } = useForm();

  useEffect(() => {
    if (data) {
      setValue("title", data.title || "");
      setValue("description", data.description || "");
      setValue("keywords", data.keywords || "");
    }
  }, [data]);

  const onSubmit = async (formData) => {
    await onSave(formData);
  };

  const title = watch("title");
  const description = watch("description");

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">SEO Settings</h2>
        <p className="text-gray-600 mt-1">
          إعدادات تحسين محركات البحث لصفحة من نحن
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان الصفحة (Page Title)
          </label>
          <input
            {...register("title")}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="من نحن | Sandy Macrame"
            maxLength={60}
          />
          <p className="text-sm text-gray-500 mt-1">
            {title?.length || 0} / 60 حرف (الأمثل: 50-60 حرف)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            وصف الصفحة (Meta Description)
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="تعرف على قصتنا ورؤيتنا في فن المكرمية اليدوي..."
            maxLength={160}
          />
          <p className="text-sm text-gray-500 mt-1">
            {description?.length || 0} / 160 حرف (الأمثل: 150-160 حرف)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الكلمات المفتاحية (Keywords)
          </label>
          <input
            {...register("keywords")}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="من نحن، مكرمية، فن يدوي، صناعة يدوية"
          />
          <p className="text-sm text-gray-500 mt-1">افصل الكلمات بفاصلة (،)</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Search className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">نصائح SEO:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>استخدم كلمات مفتاحية ذات صلة بمحتوى صفحتك</li>
                <li>اجعل العنوان والوصف جذابين ومميزين</li>
                <li>تجنب حشو الكلمات المفتاحية</li>
              </ul>
            </div>
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
