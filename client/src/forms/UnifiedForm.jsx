/* eslint-disable no-unused-vars */
// client/src/components/forms/UnifiedForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Star,
  Upload,
  X,
  User,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import Button from "../components/common/Button";
import FormModal from "../components/common/FormModal";

const FormField = ({
  type = "text",
  label,
  name,
  register,
  errors,
  validation = {},
  placeholder,
  icon: Icon,
  options = [],
  rows = 4,
  accept,
  onChange,
}) => {
  const error = errors[name];

  const renderField = () => {
    const commonProps = {
      className: `w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent ${
        Icon ? "pr-12 pl-4" : "px-4"
      } ${error ? "border-red-500" : "border-gray-300"}`,
      placeholder,
      ...register(name, validation),
    };

    switch (type) {
      case "select":
        return (
          <select {...commonProps}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return <textarea {...commonProps} rows={rows} />;

      case "file":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">
                      {placeholder || "اختر ملف"}
                    </span>
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept={accept}
                  {...register(name, validation)}
                  onChange={onChange}
                />
              </label>
            </div>
          </div>
        );

      case "rating":
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className="cursor-pointer text-gray-300 hover:text-yellow-500"
                onClick={() => onChange && onChange(star)}
              />
            ))}
          </div>
        );

      default:
        return <input {...commonProps} type={type} />;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {validation.required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute right-3 top-3 text-gray-400" size={20} />
        )}
        {renderField()}
      </div>

      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={16} />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default function UnifiedForm({
  type = "contact", // contact, review, inquiry
  isModal = false,
  isOpen = true,
  onClose,
  onSuccess,
  title,
  description,
  albumId,
  submitButtonText = "إرسال",
  className = "",
}) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const getFormConfig = () => {
    switch (type) {
      case "review":
        return {
          title: title || "اترك تقييمك",
          description: description || "شاركنا رأيك عن المنتج",
          fields: [
            {
              name: "author_name",
              label: "اسمك",
              type: "text",
              icon: User,
              validation: { required: "الاسم مطلوب" },
              placeholder: "اكتب اسمك هنا",
            },
            {
              name: "rating",
              label: "التقييم",
              type: "rating",
              validation: { required: "التقييم مطلوب" },
              onChange: setRating,
            },
            {
              name: "text",
              label: "ملاحظاتك",
              type: "textarea",
              validation: { required: "الملاحظات مطلوبة" },
              placeholder: "شاركنا رأيك عن المنتج...",
              rows: 4,
            },
            {
              name: "review_image",
              label: "أضف صورة (اختياري)",
              type: "file",
              accept: "image/*",
              placeholder: "اختر صورة",
              onChange: (e) => setUploadedFile(e.target.files[0]),
            },
          ],
        };

      case "contact":
        return {
          title: title || "أرسل لنا رسالة",
          description: description || "نحن هنا لمساعدتك",
          fields: [
            {
              name: "name",
              label: "الاسم الكامل",
              type: "text",
              icon: User,
              validation: {
                required: "الاسم مطلوب",
                minLength: {
                  value: 2,
                  message: "الاسم يجب أن يكون أكثر من حرفين",
                },
              },
              placeholder: "أدخل اسمك الكامل",
            },
            {
              name: "email",
              label: "البريد الإلكتروني",
              type: "email",
              icon: Mail,
              validation: {
                required: "البريد الإلكتروني مطلوب",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "تنسيق البريد الإلكتروني غير صحيح",
                },
              },
              placeholder: "example@email.com",
            },
            {
              name: "phone",
              label: "رقم الهاتف",
              type: "tel",
              icon: Phone,
              placeholder: "+970 599 123 456",
            },
            {
              name: "subject",
              label: "الموضوع",
              type: "select",
              validation: { required: "يرجى اختيار موضوع الرسالة" },
              options: [
                { value: "", label: "اختر الموضوع..." },
                { value: "استفسار عن المنتجات", label: "استفسار عن المنتجات" },
                { value: "طلب تصميم مخصص", label: "طلب تصميم مخصص" },
                { value: "استفسار عن الأسعار", label: "استفسار عن الأسعار" },
                {
                  value: "معلومات الشحن والتوصيل",
                  label: "معلومات الشحن والتوصيل",
                },
                { value: "شكوى أو اقتراح", label: "شكوى أو اقتراح" },
                { value: "أخرى", label: "أخرى" },
              ],
            },
            {
              name: "message",
              label: "رسالتك",
              type: "textarea",
              icon: MessageSquare,
              validation: {
                required: "الرسالة مطلوبة",
                minLength: {
                  value: 10,
                  message: "الرسالة يجب أن تكون أكثر من 10 أحرف",
                },
              },
              placeholder: "اكتب رسالتك هنا...",
              rows: 5,
            },
          ],
        };

      default:
        return { fields: [] };
    }
  };

  const formConfig = getFormConfig();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const formData = {
        ...data,
        rating,
        review_image: uploadedFile,
        linked_album_id: albumId || null,
      };

      console.log("Form submitted:", formData);

      setSuccessMessage("تم الإرسال بنجاح!");
      reset();
      setRating(0);
      setUploadedFile(null);

      if (onSuccess) onSuccess(formData);

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const FormContent = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple mb-2">
          {formConfig.title}
        </h2>
        {formConfig.description && (
          <p className="text-gray-600">{formConfig.description}</p>
        )}
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="text-green-600">✓</div>
            <div>
              <h3 className="font-semibold text-green-800">تم بنجاح!</h3>
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {formConfig.fields.map((field) => (
          <FormField
            key={field.name}
            {...field}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        ))}

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-0.5" size={16} />
            <p className="text-blue-800 text-sm">
              <strong>ملاحظة:</strong> معلوماتك آمنة معنا. سيتم استخدام بياناتك
              للرد على استفسارك فقط.
            </p>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full py-3">
          {loading ? "جاري الإرسال..." : submitButtonText}
        </Button>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={formConfig.title}
        maxWidth="max-w-2xl"
      >
        <FormContent />
      </FormModal>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
      <FormContent />
    </div>
  );
}
