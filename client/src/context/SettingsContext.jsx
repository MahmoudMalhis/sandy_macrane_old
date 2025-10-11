// client/src/context/SettingsContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { settingsAPI } from "../api/settings";

const SettingsContext = createContext(undefined);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getPublic();

      if (response?.success) {
        setSettings({
          whatsapp_owner: response.data.whatsapp_owner,
          email: response.data.contact_info?.email,
          phone: response.data.contact_info?.phone,
          address: response.data.contact_info?.address,
          social_links: response.data.social_links,
          site_meta: response.data.site_meta,
          // أضف باقي الحقول حسب الحاجة
        });
      }
    } catch (err) {
      console.error("Error loading settings:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // دالة لتحديث الإعدادات يدويًا (للـ admin)
  const refreshSettings = () => {
    loadSettings();
  };

  const value = {
    settings,
    loading,
    error,
    refreshSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

export { SettingsContext };
