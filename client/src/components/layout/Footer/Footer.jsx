import { useState, useEffect } from "react";
import { settingsAPI } from "../../../api/settings";

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.getPublic();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) return <div className="translate-1/2">جاري التحميل...</div>;

  return (
    <footer className="bg-gray-800 text-white py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معلومات التواصل */}
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            {settings?.whatsapp_owner && (
              <p>واتساب: {settings.whatsapp_owner}</p>
            )}
          </div>

          {/* روابط السوشيال */}
          <div>
            <h3 className="text-lg font-bold mb-4">تابعنا</h3>
            <div className="flex space-x-4 space-x-reverse">
              {settings?.social_links?.instagram && (
                <a href={settings.social_links.instagram}>إنستجرام</a>
              )}
              {settings?.social_links?.facebook && (
                <a href={settings.social_links.facebook}>فيسبوك</a>
              )}
            </div>
          </div>

          {/* معلومات إضافية */}
          <div>
            <h3 className="text-lg font-bold mb-4">ساندي مكرمية</h3>
            <p>أعمال مكرمية وبراويز يدوية</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
