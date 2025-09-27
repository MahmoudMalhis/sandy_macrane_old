import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Plus, X, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "../../common/Button";
import ImageUpload from "../../common/ImageUpload";

// Settings Form Field Component
const SettingsField = ({
  type = "text",
  name,
  label,
  register,
  errors,
  validation = {},
  placeholder,
  options = [],
  rows = 4,
  description,
  required = false,
  ...props
}) => {
  const error = errors[name];

  const renderField = () => {
    const commonProps = {
      className: `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent ${
        error ? "border-red-500" : ""
      }`,
      placeholder,
      ...register(name, validation),
      ...props,
    };

    switch (type) {
      case "textarea":
        return <textarea {...commonProps} rows={rows} />;

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

      case "number":
        return <input {...commonProps} type="number" />;

      case "email":
        return <input {...commonProps} type="email" />;

      case "url":
        return <input {...commonProps} type="url" />;

      case "time":
        return <input {...commonProps} type="time" />;

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              {...register(name)}
              type="checkbox"
              className="h-4 w-4 text-purple focus:ring-purple border-gray-300 rounded"
              {...props}
            />
            <label className="ml-2 text-sm text-gray-700">{placeholder}</label>
          </div>
        );

      default:
        return <input {...commonProps} type="text" />;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {renderField()}

      {error && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={16} />
          {error.message}
        </p>
      )}
    </div>
  );
};

// Image Field Component
const ImageField = ({
  name,
  label,
  currentImage,
  onImageUpload,
  setValue,
  description,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      <div className="mt-1">
        {currentImage && (
          <div className="mb-4">
            <img
              src={currentImage}
              alt="معاينة"
              className="w-full h-48 object-cover rounded-lg"
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
                onImageUpload && onImageUpload(e, name, setValue)
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
};

// Repeater Field Component (for lists like highlights)
const RepeaterField = ({
  name,
  label,
  items = [],
  onAdd,
  onRemove,
  onUpdate,
  fieldSchema = [],
  description,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        <Button
          type="button"
          onClick={onAdd}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          إضافة
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">العنصر {index + 1}</h4>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-4">
              {fieldSchema.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={item[field.name] || ""}
                      onChange={(e) =>
                        onUpdate(index, field.name, e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      rows={3}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      value={item[field.name] || ""}
                      onChange={(e) =>
                        onUpdate(index, field.name, e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          لا توجد عناصر. اضغط "إضافة" لبدء الإضافة.
        </div>
      )}
    </div>
  );
};

// Main Settings Layout Component
export default function SettingsLayout({
  title,
  description,
  sections = [],
  data = {},
  onSave,
  saving = false,
  onImageUpload,
  className = "",
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const [repeaterItems, setRepeaterItems] = useState({});

  // Initialize form with data
  useEffect(() => {
    Object.keys(data).forEach((key) => {
      setValue(key, data[key]);
    });

    // Initialize repeater items
    const initialRepeaters = {};
    sections.forEach((section) => {
      section.fields?.forEach((field) => {
        if (field.type === "repeater" && data[field.name]) {
          initialRepeaters[field.name] = Array.isArray(data[field.name])
            ? data[field.name]
            : [];
        }
      });
    });
    setRepeaterItems(initialRepeaters);
  }, [data, sections, setValue]);

  const handleRepeaterAdd = (fieldName, defaultItem = {}) => {
    setRepeaterItems((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), defaultItem],
    }));
  };

  const handleRepeaterRemove = (fieldName, index) => {
    setRepeaterItems((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  const handleRepeaterUpdate = (fieldName, index, itemKey, value) => {
    setRepeaterItems((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) =>
        i === index ? { ...item, [itemKey]: value } : item
      ),
    }));
  };

  const onSubmit = async (formData) => {
    // Merge form data with repeater items
    const finalData = {
      ...formData,
      ...repeaterItems,
    };

    await onSave(finalData);
  };

  const renderField = (field) => {
    switch (field.type) {
      case "image":
        return (
          <ImageField
            key={field.name}
            name={field.name}
            label={field.label}
            currentImage={watch(field.name)}
            onImageUpload={onImageUpload}
            setValue={setValue}
            description={field.description}
            required={field.required}
          />
        );

      case "repeater":
        return (
          <RepeaterField
            key={field.name}
            name={field.name}
            label={field.label}
            items={repeaterItems[field.name] || []}
            onAdd={() => handleRepeaterAdd(field.name, field.defaultItem || {})}
            onRemove={(index) => handleRepeaterRemove(field.name, index)}
            onUpdate={(index, itemKey, value) =>
              handleRepeaterUpdate(field.name, index, itemKey, value)
            }
            fieldSchema={field.fieldSchema || []}
            description={field.description}
          />
        );

      default:
        return (
          <SettingsField
            key={field.name}
            {...field}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-purple">
                  {section.title}
                </h3>
                {section.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {section.description}
                  </p>
                )}
              </div>
            )}

            <div
              className={`grid gap-6 ${
                section.columns ? `md:grid-cols-${section.columns}` : ""
              }`}
            >
              {section.fields?.map(renderField)}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button type="submit" loading={saving} className="px-8 py-3">
            <Save size={18} className="ml-2" />
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </Button>
        </div>
      </form>
    </div>
  );
}
