// client/src/components/admin/settings/AlbumsSettings.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import Button from "../../common/Button";

export default function AlbumsSettings({ data, onSave, saving }) {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (data?.home_albums) {
      const albums = data.home_albums;
      setValue("albums_section_title", albums.section_title || "");
      setValue("albums_section_description", albums.section_description || "");
      setValue("albums_button_text", albums.button_text || "");
      setValue("albums_show_count", albums.show_count || 6);
      setValue("albums_sort_by", albums.sort_by || "view_count");
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    const albumsData = {
      section_title: formData.albums_section_title,
      section_description: formData.albums_section_description,
      button_text: formData.albums_button_text,
      show_count: parseInt(formData.albums_show_count),
      sort_by: formData.albums_sort_by,
    };

    await onSave(albumsData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">إعدادات الألبومات المميزة</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان القسم
            </label>
            <input
              {...register("albums_section_title")}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="منتجاتنا المميزة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نص الزر
            </label>
            <input
              {...register("albums_button_text")}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="عرض جميع المنتجات"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            وصف القسم
          </label>
          <textarea
            {...register("albums_section_description")}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            placeholder="اكتشف أحدث إبداعاتنا من المكرمية والبراويز..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عدد الألبومات المعروضة
            </label>
            <input
              {...register("albums_show_count")}
              type="number"
              min="1"
              max="20"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
              placeholder="6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ترتيب الألبومات
            </label>
            <select
              {...register("albums_sort_by")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            >
              <option value="view_count">حسب عدد المشاهدات</option>
              <option value="created_at">حسب تاريخ الإنشاء</option>
              <option value="random">ترتيب عشوائي</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} className="px-8">
            <Save size={18} className="ml-2" />
            حفظ إعدادات الألبومات
          </Button>
        </div>
      </form>
    </div>
  );
}
