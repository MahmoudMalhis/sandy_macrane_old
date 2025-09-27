const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

class SettingsAPI {
  async makeRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  // Public settings
  async getPublic() {
    return this.makeRequest("/settings/public");
  }

  // Admin settings
  async getAdminSettings() {
    return this.makeRequest("/settings/admin");
  }

  async getAllHomeSettings() {
    return this.makeRequest("/settings/admin/home");
  }

  // Contact settings
  async updateContactInfo(contactData) {
    return this.makeRequest("/settings/admin/contact-info", {
      method: "PUT",
      body: JSON.stringify(contactData),
    });
  }

  // About settings
  async getAboutSettings() {
    return this.makeRequest("/settings/admin/about");
  }

  async updateAboutSettings(aboutData) {
    return this.makeRequest("/settings/admin/about", {
      method: "PUT",
      body: JSON.stringify(aboutData),
    });
  }

  // FAQ settings
  async getFAQSettings() {
    return this.makeRequest("/settings/admin/faq");
  }

  async updateFAQSettings(faqData) {
    return this.makeRequest("/settings/admin/faq", {
      method: "PUT",
      body: JSON.stringify(faqData),
    });
  }

  // Site metadata
  async updateSiteMeta(meta) {
    return this.makeRequest("/settings/admin/site/meta", {
      method: "PUT",
      body: JSON.stringify(meta),
    });
  }

  // Home slider
  async updateHomeSlider(slider) {
    return this.makeRequest("/settings/admin/home/slider", {
      method: "PUT",
      body: JSON.stringify(slider),
    });
  }

  // Social links
  async updateSocialLinks(links) {
    return this.makeRequest("/settings/admin/social/links", {
      method: "PUT",
      body: JSON.stringify(links),
    });
  }

  // WhatsApp settings
  async updateWhatsAppOwner(phoneNumber) {
    return this.makeRequest("/settings/admin/whatsapp/owner", {
      method: "PUT",
      body: JSON.stringify({ phone: phoneNumber }),
    });
  }
}

export const settingsAPI = new SettingsAPI();
