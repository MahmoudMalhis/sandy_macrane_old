// client/src/components/admin/settings/SliderSettings.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { Save, Upload } from "lucide-react";
import Button from "../../common/Button";

export default function SliderSettings({
  data,
  onSave,
  saving,
  onImageUpload,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  React.useEffect(() => {
    if (data?.home_slider) {
      const slider = data.home_slider;
      setValue("macrame_title", slider.macrame?.title || "");
      setValue("macrame_subtitle", slider.macrame?.subtitle || "");
      setValue("macrame_button_text", slider.macrame?.button_text || "");
      setValue("macrame_image", slider.macrame?.image || "");

      setValue("frames_title", slider.frames?.title || "");
      setValue("frames_subtitle", slider.frames?.subtitle || "");
      setValue("frames_button_text", slider.frames?.button_text || "");
      setValue("frames_image", slider.frames?.image || "");
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    const sliderData = {
      macrame: {
        title: formData.macrame_title,
        subtitle: formData.macrame_subtitle,
        button_text: formData.macrame_button_text,
        image: formData.macrame_image,
      },
      frames: {
        title: formData.frames_title,
        subtitle: formData.frames_subtitle,
        button_text: formData.frames_button_text,
        image: formData.frames_image,
      },
    };

    await onSave(sliderData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">إعدادات سلايدر الكفر</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* شريحة المكرمية */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple mb-4">
            شريحة المكرمية
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان الرئيسي
                </label>
                <input
                  {...register("macrame_title", {
                    required: "العنوان مطلوب",
                  })}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="مكرمية مصنوعة بحب"
                />
                {errors.macrame_title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.macrame_title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان الفرعي
                </label>
                <input
                  {...register("macrame_subtitle")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="تفاصيل تلامس روحك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نص الزر
                </label>
                <input
                  {...register("macrame_button_text")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="اطلب الآن"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                صورة الخلفية
              </label>
              <div className="mt-1">
                {watch("macrame_image") && (
                  <div className="mb-4">
                    <img
                      src={watch("macrame_image")}
                      alt="معاينة"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
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
                        onImageUpload(e, "macrame_image", setValue)
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* شريحة البراويز */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green mb-4">
            شريحة البراويز
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان الرئيسي
                </label>
                <input
                  {...register("frames_title", {
                    required: "العنوان مطلوب",
                  })}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="براويز مكرمية تُخلّد لحظاتك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان الفرعي
                </label>
                <input
                  {...register("frames_subtitle")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="إبداع يدوي يحفظ ذكرياتك الجميلة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نص الزر
                </label>
                <input
                  {...register("frames_button_text")}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                  placeholder="اطلب الآن"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                صورة الخلفية
              </label>
              <div className="mt-1">
                {watch("frames_image") && (
                  <div className="mb-4">
                    <img
                      src={watch("frames_image")}
                      alt="معاينة"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
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
                        onImageUpload(e, "frames_image", setValue)
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
            حفظ إعدادات السلايدر
          </Button>
        </div>
      </form>
    </div>
  );
}
