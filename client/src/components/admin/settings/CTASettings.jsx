// client/src/components/admin/settings/CTASettings.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { Save, Upload } from "lucide-react";
import Button from "../../common/Button";

export default function CTASettings({ data, onSave, saving, onImageUpload }) {
  const { register, handleSubmit, watch, setValue } = useForm();

  React.useEffect(() => {
    if (data?.home_cta) {
      const cta = data.home_cta;
      setValue("cta_section_title", cta.section_title || "");
      setValue("cta_section_description", cta.section_description || "");

      setValue("custom_design_title", cta.custom_design?.title || "");
      setValue("custom_design_subtitle", cta.custom_design?.subtitle || "");
      setValue(
        "custom_design_description",
        cta.custom_design?.description || ""
      );
      setValue(
        "custom_design_button_text",
        cta.custom_design?.button_text || ""
      );
      setValue("custom_design_image", cta.custom_design?.image || "");

      setValue("gallery_title", cta.gallery?.title || "");
      setValue("gallery_subtitle", cta.gallery?.subtitle || "");
      setValue("gallery_description", cta.gallery?.description || "");
      setValue("gallery_button_text", cta.gallery?.button_text || "");
      setValue("gallery_image", cta.gallery?.image || "");
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    const ctaData = {
      section_title: formData.cta_section_title,
      section_description: formData.cta_section_description,
      custom_design: {
        title: formData.custom_design_title,
        subtitle: formData.custom_design_subtitle,
        description: formData.custom_design_description,
        button_text: formData.custom_design_button_text,
        image: formData.custom_design_image,
      },
      gallery: {
        title: formData.gallery_title,
        subtitle: formData.gallery_subtitle,
        description: formData.gallery_description,
        button_text: formData.gallery_button_text,
        image: formData.gallery_image,
      },
    };

    await onSave(ctaData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">إعدادات أقسام الدعوة للعمل</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* إعدادات القسم العامة */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple mb-4">
            إعدادات القسم العامة
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان القسم
              </label>
              <input
                {...register("cta_section_title")}
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="ابدأ رحلتك معنا"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف القسم
              </label>
              <textarea
                {...register("cta_section_description")}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="اختر الطريقة التي تناسبك..."
              />
            </div>
          </div>
        </div>

        {/* قسم التصميم المخصص */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green mb-4">
            قسم التصميم المخصص
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان
                </label>
                <input
                  {...register("custom_design_title")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="اطلب تصميم مخصص"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان الفرعي
                </label>
                <input
                  {...register("custom_design_subtitle")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="حوّل أفكارك إلى قطعة فنية فريدة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف
                </label>
                <textarea
                  {...register("custom_design_description")}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="احصل على تصميم مكرمية أو برواز مخصص..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نص الزر
                </label>
                <input
                  {...register("custom_design_button_text")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="ابدأ التصميم"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                صورة القسم
              </label>
              <div className="mt-1">
                {watch("custom_design_image") && (
                  <div className="mb-4">
                    <img
                      src={watch("custom_design_image")}
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
                      onChange={(e) =>
                        onImageUpload(e, "custom_design_image", setValue)
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* قسم المعرض */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            قسم المعرض
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان
                </label>
                <input
                  {...register("gallery_title")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="اذهب للمعرض"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان الفرعي
                </label>
                <input
                  {...register("gallery_subtitle")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="استكشف مجموعتنا الكاملة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف
                </label>
                <textarea
                  {...register("gallery_description")}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="تصفح جميع منتجاتنا المتاحة..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نص الزر
                </label>
                <input
                  {...register("gallery_button_text")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="زيارة المعرض"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                صورة القسم
              </label>
              <div className="mt-1">
                {watch("gallery_image") && (
                  <div className="mb-4">
                    <img
                      src={watch("gallery_image")}
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
                      onChange={(e) =>
                        onImageUpload(e, "gallery_image", setValue)
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} className="px-8">
            <Save size={18} className="ml-2" />
            حفظ إعدادات أقسام الدعوة
          </Button>
        </div>
      </form>
    </div>
  );
}
