import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Save,
  HelpCircle,
  Plus,
  Minus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Truck,
  Palette,
  Clock,
  Shield,
  RefreshCw,
  Star,
  Ruler,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../utils/LoadingSettings";
import { settingsAPI } from "../../api/settings";

export default function FAQManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      faqs: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "faqs",
  });

  // FAQ Categories with icons
  const categories = [
    { id: "general", name: "عام", icon: HelpCircle },
    { id: "orders", name: "الطلبات", icon: Clock },
    { id: "pricing", name: "الأسعار", icon: DollarSign },
    { id: "shipping", name: "الشحن", icon: Truck },
    { id: "customization", name: "التخصيص", icon: Palette },
    { id: "sizing", name: "المقاسات", icon: Ruler },
    { id: "materials", name: "الخامات", icon: Star },
    { id: "care", name: "العناية", icon: Shield },
    { id: "returns", name: "الإرجاع", icon: RefreshCw },
  ];

  useEffect(() => {
    loadFAQSettings();
  }, []);

  const loadFAQSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getFAQSettings();

      if (response?.success && response.data?.faqs) {
        setValue("faqs", response.data.faqs);
      } else {
        // Load default FAQs if none exist
        setValue("faqs", getDefaultFAQs());
      }
    } catch (error) {
      console.error("Error loading FAQ settings:", error);
      toast.error("فشل في تحميل إعدادات الأسئلة الشائعة");
      // Load defaults on error
      setValue("faqs", getDefaultFAQs());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultFAQs = () => [
    {
      id: 1,
      category: "general",
      question: "ما هي المكرمية وما الذي يميزها؟",
      answer:
        "المكرمية هي فن قديم يعتمد على عقد الحبال والخيوط لإنشاء تصاميم جميلة...",
    },
    {
      id: 2,
      category: "orders",
      question: "كم يستغرق تنفيذ الطلب؟",
      answer:
        "يعتمد وقت التنفيذ على نوع وحجم القطعة:\n• القطع البسيطة: 2-3 أيام\n• القطع المتوسطة: 4-7 أيام...",
    },
    {
      id: 3,
      category: "pricing",
      question: "كيف يتم حساب أسعار المنتجات؟",
      answer:
        "تعتمد الأسعار على عدة عوامل:\n• حجم القطعة ومقاساتها\n• تعقيد التصميم والتفاصيل...",
    },
  ];

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const response = await settingsAPI.updateFAQSettings(data);

      if (response?.success) {
        toast.success("تم حفظ الأسئلة الشائعة بنجاح");
        setEditingIndex(null);
      } else {
        throw new Error("فشل في الحفظ");
      }
    } catch (error) {
      console.error("Error saving FAQ settings:", error);
      toast.error("فشل في حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  const addNewFAQ = () => {
    const newFAQ = {
      id: Date.now(),
      category: "general",
      question: "",
      answer: "",
    };
    append(newFAQ);
    setEditingIndex(fields.length); // Edit the new item
  };

  const deleteFAQ = (index) => {
    if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      remove(index);
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
  };

  const handlePreview = () => {
    window.open("/faq", "_blank");
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : HelpCircle;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "عام";
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <HelpCircle className="w-8 h-8 text-purple mr-2" />
              إدارة الأسئلة الشائعة
            </h1>
            <p className="text-gray-600">
              إدارة الأسئلة والأجوبة الشائعة للموقع
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye size={18} />
              معاينة الصفحة
            </Button>
            <Button onClick={addNewFAQ} className="flex items-center gap-2">
              <Plus size={18} />
              إضافة سؤال جديد
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* FAQ List */}
          <div className="space-y-4">
            {fields.map((field, index) => {
              const CategoryIcon = getCategoryIcon(
                watch(`faqs.${index}.category`)
              );
              const isEditing = editingIndex === index;

              return (
                <div
                  key={field.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  {/* FAQ Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="text-purple" size={20} />
                      <span className="font-medium text-gray-700">
                        {getCategoryName(watch(`faqs.${index}.category`))}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-600">
                        السؤال رقم {index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingIndex(isEditing ? null : index)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          isEditing
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFAQ(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* FAQ Content */}
                  <div className="p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        {/* Category Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            التصنيف *
                          </label>
                          <select
                            {...register(`faqs.${index}.category`, {
                              required: "التصنيف مطلوب",
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                          >
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Question */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            السؤال *
                          </label>
                          <input
                            {...register(`faqs.${index}.question`, {
                              required: "السؤال مطلوب",
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                            placeholder="اكتب السؤال هنا..."
                          />
                          {errors.faqs?.[index]?.question && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.faqs[index].question.message}
                            </p>
                          )}
                        </div>

                        {/* Answer */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            الإجابة *
                          </label>
                          <textarea
                            {...register(`faqs.${index}.answer`, {
                              required: "الإجابة مطلوبة",
                            })}
                            rows={6}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent resize-none"
                            placeholder="اكتب الإجابة هنا..."
                          />
                          {errors.faqs?.[index]?.answer && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.faqs[index].answer.message}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            يمكنك استخدام النقاط بالشكل التالي: • النقطة الأولى
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {watch(`faqs.${index}.question`) || "سؤال فارغ"}
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 border-r-4 border-purple">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {watch(`faqs.${index}.answer`) || "إجابة فارغة"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {fields.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <HelpCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  لا توجد أسئلة شائعة
                </h3>
                <p className="text-gray-600 mb-6">
                  ابدأ بإضافة أسئلة شائعة لمساعدة العملاء
                </p>
                <Button onClick={addNewFAQ} className="flex items-center gap-2">
                  <Plus size={18} />
                  إضافة أول سؤال
                </Button>
              </div>
            )}
          </div>

          {/* Save Button */}
          {fields.length > 0 && (
            <div className="flex justify-end pt-6 border-t bg-white rounded-xl shadow-lg p-6">
              <Button
                type="submit"
                loading={saving}
                className="px-8 py-3 text-lg"
              >
                <Save size={20} className="ml-2" />
                حفظ جميع الأسئلة الشائعة
              </Button>
            </div>
          )}
        </form>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            نصائح لكتابة أسئلة شائعة فعالة:
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li>• استخدم لغة واضحة ومفهومة</li>
            <li>• اجعل الأسئلة محددة وليست عامة جداً</li>
            <li>• قدم إجابات شاملة ومفيدة</li>
            <li>• استخدم النقاط لتنظيم المعلومات</li>
            <li>• حدّث الأسئلة بانتظام بناءً على استفسارات العملاء</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
