// client/src/components/admin/settings/SectionOrderSettings.jsx
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Button from "../../common/Button";

export default function SectionOrderSettings({ data, onSave, saving }) {
  const [sections, setSections] = useState([]);
  const [enabledStates, setEnabledStates] = useState({});
  const [orders, setOrders] = useState({});
  const [localSaving, setLocalSaving] = useState(false);

  const sectionNames = {
    hero_slider: "السلايدر",
    about: "النبذة التعريفية",
    featured_albums: "الألبومات المميزة",
    testimonials: "التقييمات",
    dual_cta: "الدعوة لاتخاذ إجراء",
    whatsapp_float: "البوت شات",
  };

  useEffect(() => {
    if (data) {
      const sectionsData = data.home_sections || data;

      const initialSections = Object.keys(sectionNames).map((key) => ({
        key,
        name: sectionNames[key],
        enabled: sectionsData[key]?.enabled ?? true,
        order:
          sectionsData[key]?.order ??
          Object.keys(sectionNames).indexOf(key) + 1,
      }));

      setSections(initialSections);

      const initialEnabledStates = {};
      const initialOrders = {};
      initialSections.forEach((section) => {
        initialEnabledStates[section.key] = section.enabled;
        initialOrders[section.key] = section.order;
      });
      setEnabledStates(initialEnabledStates);
      setOrders(initialOrders);
    }
  }, [data]);

  const toggleEnabled = (key) => {
    setEnabledStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const changeOrder = (key, newOrder) => {
    if (newOrder < 1) return;
    setOrders((prev) => ({
      ...prev,
      [key]: newOrder,
    }));
  };

  const handleSave = async () => {
    setLocalSaving(true);
    const updatedData = {};
    sections.forEach((section) => {
      updatedData[section.key] = {
        enabled: enabledStates[section.key],
        order: orders[section.key],
      };
    });
    const success = await onSave(updatedData);
    if (success) {
      const updatedSections = sections.map((section) => ({
        ...section,
        enabled: updatedData[section.key].enabled,
        order: updatedData[section.key].order,
      }));
      setSections(updatedSections);
    }
    setLocalSaving(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">ترتيب وأوضاع عرض الأقسام</h2>
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.key}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="text-lg font-semibold">{section.name}</h3>
              <label className="flex items-center space-x-2 mt-1">
                <input
                  type="checkbox"
                  checked={enabledStates[section.key] || false}
                  onChange={() => toggleEnabled(section.key)}
                  className="form-checkbox h-5 w-5 text-purple"
                />
                <span className="text-gray-700">تفعيل القسم</span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-700">الترتيب:</label>
              <input
                type="number"
                value={orders[section.key] || 1}
                onChange={(e) =>
                  changeOrder(section.key, parseInt(e.target.value))
                }
                className="w-16 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                min={1}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button
          onClick={handleSave}
          disabled={localSaving || saving}
          className="bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-dark focus:outline-none"
        >
          <Save size={18} className="ml-2" />
          حفظ الترتيب والإعدادات
        </Button>
      </div>
    </div>
  );
}
