import { useEffect, useState } from "react";
import { useAdminFAQs, useUpdateFAQs } from "../../hooks/queries/useFAQ";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Save,
  HelpCircle,
  Plus,
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
  Check,
  X,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../utils/LoadingSettings";

export default function FAQManagement() {
  const [editingIndex, setEditingIndex] = useState(null);
  const { data: faqData, isLoading: loading } = useAdminFAQs();
  const updateFAQsMutation = useUpdateFAQs();

  const saving = updateFAQsMutation.isPending;

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

  const { fields, append, remove } = useFieldArray({
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

  // ✅ تحميل البيانات في الـ form عند تغيير faqData
  useEffect(() => {
    if (faqData?.faqs) {
      setValue("faqs", faqData.faqs);
    } else {
      setValue("faqs");
    }
  }, [faqData, setValue]);

  const onSubmit = (formData) => {
    updateFAQsMutation.mutate(formData);
  };

  const addNewFAQ = () => {
    const newFAQ = {
      id: Date.now(),
      category: "general",
      question: "",
      answer: "",
    };
    append(newFAQ);
    setEditingIndex(fields.length); // Edit the new item immediately
  };

  const deleteFAQ = (index) => {
    if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      remove(index);
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
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
              إدارة الأسئلة والأجوبة الشائعة للموقع ({fields.length} سؤال)
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={addNewFAQ} className="flex items-center gap-2">
              <Plus size={18} />
              إضافة سؤال جديد
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">إجمالي الأسئلة</p>
                  <p className="text-2xl font-bold text-purple">
                    {fields.length}
                  </p>
                </div>
                <HelpCircle className="w-10 h-10 text-purple opacity-20" />
              </div>
            </div>
          </div>
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              نصائح لكتابة أسئلة شائعة فعالة:
            </h3>
            <ul className="space-y-2 text-blue-700">
              <li>• استخدم لغة واضحة ومفهومة بعيداً عن المصطلحات المعقدة</li>
              <li>• اجعل الأسئلة محددة وليست عامة جداً</li>
              <li>• قدم إجابات شاملة ومفيدة مع أمثلة عملية</li>
              <li>• استخدم النقاط (•) لتنظيم المعلومات وسهولة القراءة</li>
              <li>• حدّث الأسئلة بانتظام بناءً على استفسارات العملاء</li>
              <li>• رتب الأسئلة حسب الأهمية والتكرار</li>
              <li>• أضف معلومات الاتصال في الإجابات عند الحاجة</li>
            </ul>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => {
              const CategoryIcon = getCategoryIcon(
                watch(`faqs.${index}.category`)
              );
              const isEditing = editingIndex === index;

              return (
                <div
                  key={field.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-purple transition-colors"
                >
                  {/* FAQ Header */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="text-purple" size={22} />
                      <span className="font-medium text-gray-700">
                        {getCategoryName(watch(`faqs.${index}.category`))}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        السؤال رقم {index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditingIndex(null)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            title="حفظ التعديلات"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingIndex(null);
                              // Reset to original values if needed
                            }}
                            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            title="إلغاء"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingIndex(index)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteFAQ(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="حذف"
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
                          {errors.faqs?.[index]?.category && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.faqs[index].category.message}
                            </p>
                          )}
                        </div>

                        {/* Question */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            السؤال *
                          </label>
                          <input
                            {...register(`faqs.${index}.question`, {
                              required: "السؤال مطلوب",
                              minLength: {
                                value: 10,
                                message: "السؤال يجب أن يكون 10 أحرف على الأقل",
                              },
                              maxLength: {
                                value: 500,
                                message: "السؤال يجب ألا يتجاوز 500 حرف",
                              },
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                            placeholder="اكتب السؤال هنا..."
                          />
                          {errors.faqs?.[index]?.question && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.faqs[index].question.message}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            {watch(`faqs.${index}.question`)?.length || 0} / 500
                            حرف
                          </p>
                        </div>

                        {/* Answer */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            الإجابة *
                          </label>
                          <textarea
                            {...register(`faqs.${index}.answer`, {
                              required: "الإجابة مطلوبة",
                              minLength: {
                                value: 20,
                                message: "الإجابة يجب أن تكون 20 حرف على الأقل",
                              },
                              maxLength: {
                                value: 5000,
                                message: "الإجابة يجب ألا تتجاوز 5000 حرف",
                              },
                            })}
                            rows={6}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent resize-y"
                            placeholder="اكتب الإجابة هنا..."
                          />
                          {errors.faqs?.[index]?.answer && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.faqs[index].answer.message}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            {watch(`faqs.${index}.answer`)?.length || 0} / 5000
                            حرف • يمكنك استخدام \n للفقرات • استخدم • للنقاط
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
                حفظ جميع الأسئلة الشائعة ({fields.length})
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
