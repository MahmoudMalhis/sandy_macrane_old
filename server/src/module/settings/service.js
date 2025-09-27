import db, { fn } from "../../db/knex.js";

class SettingsService {
  // Get setting by key
  static async get(key) {
    try {
      const setting = await db("settings").where("key", key).first();

      if (!setting) {
        return null;
      }

      // Try to parse JSON, fallback to string value
      try {
        return JSON.parse(setting.value);
      } catch (error) {
        return setting.value;
      }
    } catch (error) {
      throw error;
    }
  }

  // Set setting value
  static async set(key, value) {
    try {
      const stringValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);

      const exists = await db("settings").where("key", key).first();

      if (exists) {
        await db("settings").where("key", key).update({
          value: stringValue,
          updated_at: fn.now(),
        });
      } else {
        await db("settings").insert({
          key,
          value: stringValue,
          created_at: fn.now(),
          updated_at: fn.now(),
        });
      }

      return await this.get(key);
    } catch (error) {
      throw error;
    }
  }

  // Get multiple settings
  static async getMultiple(keys) {
    try {
      const settings = await db("settings").whereIn("key", keys);

      const result = {};

      settings.forEach((setting) => {
        try {
          result[setting.key] = JSON.parse(setting.value);
        } catch (error) {
          result[setting.key] = setting.value;
        }
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get all settings
  static async getAll() {
    try {
      const settings = await db("settings").orderBy("key", "asc");

      const result = {};

      settings.forEach((setting) => {
        try {
          result[setting.key] = JSON.parse(setting.value);
        } catch (error) {
          result[setting.key] = setting.value;
        }
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Set multiple settings
  static async setMultiple(settingsObject) {
    try {
      const results = {};

      for (const [key, value] of Object.entries(settingsObject)) {
        results[key] = await this.set(key, value);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  // Get public settings (for frontend)
  static async getPublic() {
    try {
      const publicKeys = [
        "whatsapp_owner",
        "social_links",
        "site_meta",
        "home_slider",
      ];

      return await this.getMultiple(publicKeys);
    } catch (error) {
      throw error;
    }
  }

  // Delete setting
  static async delete(key) {
    try {
      const setting = await db("settings").where("key", key).first();

      if (!setting) {
        throw new Error("Setting not found");
      }

      await db("settings").where("key", key).del();

      return setting;
    } catch (error) {
      throw error;
    }
  }

  // Get WhatsApp owner number
  static async getWhatsAppOwner() {
    try {
      return (await this.get("whatsapp_owner")) || process.env.WHATSAPP_OWNER;
    } catch (error) {
      throw error;
    }
  }

  // Get social links
  static async getSocialLinks() {
    try {
      const links = await this.get("social_links");

      if (!links) {
        return {
          instagram: "",
          facebook: "",
          whatsapp: "",
        };
      }

      return links;
    } catch (error) {
      throw error;
    }
  }

  // Get site metadata
  static async getSiteMeta() {
    try {
      const meta = await this.get("site_meta");

      if (!meta) {
        return {
          title: "ساندي مكرمية - Sandy Macrame",
          description: "أجمل أعمال المكرمية والبراويز اليدوية من ساندي مكرمية",
          keywords: "مكرمية, براويز, ساندي, يدوية, فلسطين",
          logo: "/images/logo.png",
        };
      }

      return meta;
    } catch (error) {
      throw error;
    }
  }

  // Get home slider settings
  static async getHomeSlider() {
    try {
      const slider = await this.get("home_slider");

      if (!slider) {
        return {
          macrame: {
            title: "أعمال مكرمية فريدة",
            subtitle: "اكتشف جمال المكرمية اليدوية",
            button_text: "شاهد أعمال المكرمية",
            image: "/images/macrame-cover.jpg",
          },
          frames: {
            title: "براويز رائعة التصميم",
            subtitle: "براويز فنية تضفي جمالاً لمنزلك",
            button_text: "شاهد البراويز",
            image: "/images/frames-cover.jpg",
          },
        };
      }

      return slider;
    } catch (error) {
      throw error;
    }
  }

  // Update WhatsApp owner
  static async updateWhatsAppOwner(phoneNumber) {
    try {
      return await this.set("whatsapp_owner", phoneNumber);
    } catch (error) {
      throw error;
    }
  }

  // Update social links
  static async updateSocialLinks(links) {
    try {
      const currentLinks = await this.getSocialLinks();
      const updatedLinks = { ...currentLinks, ...links };

      return await this.set("social_links", updatedLinks);
    } catch (error) {
      throw error;
    }
  }

  // Update site metadata
  static async updateSiteMeta(meta) {
    try {
      const currentMeta = await this.getSiteMeta();
      const updatedMeta = { ...currentMeta, ...meta };

      return await this.set("site_meta", updatedMeta);
    } catch (error) {
      throw error;
    }
  }

  // Update home slider
  static async updateHomeSlider(slider) {
    try {
      const currentSlider = await this.getHomeSlider();
      const updatedSlider = {
        macrame: { ...currentSlider.macrame, ...(slider.macrame || {}) },
        frames: { ...currentSlider.frames, ...(slider.frames || {}) },
      };

      return await this.set("home_slider", updatedSlider);
    } catch (error) {
      throw error;
    }
  }

  static async getHomeAbout() {
    try {
      const about = await this.get("home_about");
      
      if (!about) {
        return {
          title: "فن المكرمية بلمسة عصرية",
          subtitle: "رحلة إبداع تبدأ من القلب",
          description: "نقدم لكم قطع مكرمية مصنوعة يدوياً بشغف وإتقان...",
          button_text: "تعرف علينا أكثر",
          image: "/images/about-hero.jpg",
          highlights: [
            { icon: "❤️", title: "صنع بحب", description: "كل قطعة تحمل لمسة شخصية" },
            { icon: "✨", title: "تصاميم فريدة", description: "إبداعات لا تتكرر" },
            { icon: "🏆", title: "جودة عالية", description: "مواد خام مختارة بعناية" }
          ]
        };
      }

      return about;
    } catch (error) {
      throw error;
    }
  }

  // Update home about settings
  static async updateHomeAbout(aboutData) {
    try {
      const currentAbout = await this.getHomeAbout();
      const updatedAbout = { ...currentAbout, ...aboutData };
      
      return await this.set("home_about", updatedAbout);
    } catch (error) {
      throw error;
    }
  }

  // Get home CTA settings
  static async getHomeCTA() {
    try {
      const cta = await this.get("home_cta");
      
      if (!cta) {
        return {
          section_title: "ابدأ رحلتك معنا",
          section_description: "اختر الطريقة التي تناسبك للحصول على قطعة مكرمية أو برواز مميز",
          custom_design: {
            title: "اطلب تصميم مخصص",
            subtitle: "حوّل أفكارك إلى قطعة فنية فريدة",
            description: "احصل على تصميم مكرمية أو برواز مخصص حسب ذوقك الشخصي ومساحتك",
            button_text: "ابدأ التصميم",
            image: "/images/custom-design.jpg"
          },
          gallery: {
            title: "اذهب للمعرض",
            subtitle: "استكشف مجموعتنا الكاملة",
            description: "تصفح جميع منتجاتنا المتاحة واختر ما يناسب ذوقك من تشكيلة واسعة",
            button_text: "زيارة المعرض",
            image: "/images/gallery-preview.jpg"
          }
        };
      }

      return cta;
    } catch (error) {
      throw error;
    }
  }

  // Update home CTA settings
  static async updateHomeCTA(ctaData) {
    try {
      const currentCTA = await this.getHomeCTA();
      const updatedCTA = { ...currentCTA, ...ctaData };
      
      return await this.set("home_cta", updatedCTA);
    } catch (error) {
      throw error;
    }
  }

  // Get home albums settings
  static async getHomeAlbums() {
    try {
      const albums = await this.get("home_albums");
      
      if (!albums) {
        return {
          section_title: "منتجاتنا المميزة",
          section_description: "اكتشف أحدث إبداعاتنا من المكرمية والبراويز المصنوعة بعناية فائقة",
          button_text: "عرض جميع المنتجات",
          show_count: 6,
          sort_by: "view_count"
        };
      }

      return albums;
    } catch (error) {
      throw error;
    }
  }

  // Update home albums settings
  static async updateHomeAlbums(albumsData) {
    try {
      const currentAlbums = await this.getHomeAlbums();
      const updatedAlbums = { ...currentAlbums, ...albumsData };
      
      return await this.set("home_albums", updatedAlbums);
    } catch (error) {
      throw error;
    }
  }

  // Get home testimonials settings
  static async getHomeTestimonials() {
    try {
      const testimonials = await this.get("home_testimonials");
      
      if (!testimonials) {
        return {
          section_title: "ماذا يقول عملاؤنا",
          section_description: "آراء حقيقية من عملائنا الكرام حول تجربتهم مع منتجاتنا",
          button_text: "شاهد جميع التقييمات",
          show_count: 4,
          min_rating: 4,
          autoplay: true,
          autoplay_delay: 6000
        };
      }

      return testimonials;
    } catch (error) {
      throw error;
    }
  }

  // Update home testimonials settings
  static async updateHomeTestimonials(testimonialsData) {
    try {
      const currentTestimonials = await this.getHomeTestimonials();
      const updatedTestimonials = { ...currentTestimonials, ...testimonialsData };
      
      return await this.set("home_testimonials", updatedTestimonials);
    } catch (error) {
      throw error;
    }
  }

  // Get home WhatsApp settings
  static async getHomeWhatsApp() {
    try {
      const whatsapp = await this.get("home_whatsapp");
      
      if (!whatsapp) {
        return {
          enabled: true,
          show_after_scroll: 300,
          business_hours: {
            enabled: true,
            start: "09:00",
            end: "21:00",
            timezone: "Palestine"
          },
          quick_messages: [
            { id: 1, text: "أريد طلب قطعة مكرمية", icon: "🕸️" },
            { id: 2, text: "أود طلب برواز مخصص", icon: "🖼️" },
            { id: 3, text: "استفسار عن الأسعار", icon: "💰" },
            { id: 4, text: "معلومات عن التوصيل", icon: "🚚" }
          ]
        };
      }

      return whatsapp;
    } catch (error) {
      throw error;
    }
  }

  // Update home WhatsApp settings
  static async updateHomeWhatsApp(whatsappData) {
    try {
      const currentWhatsApp = await this.getHomeWhatsApp();
      const updatedWhatsApp = { ...currentWhatsApp, ...whatsappData };
      
      return await this.set("home_whatsapp", updatedWhatsApp);
    } catch (error) {
      throw error;
    }
  }

  // Get home sections visibility/order settings
  static async getHomeSections() {
    try {
      const sections = await this.get("home_sections");
      
      if (!sections) {
        return {
          hero_slider: { enabled: true, order: 1 },
          about: { enabled: true, order: 2 },
          featured_albums: { enabled: true, order: 3 },
          testimonials: { enabled: true, order: 4 },
          dual_cta: { enabled: true, order: 5 },
          whatsapp_float: { enabled: true, order: 0 }
        };
      }

      return sections;
    } catch (error) {
      throw error;
    }
  }

  // Update home sections settings
  static async updateHomeSections(sectionsData) {
    try {
      const currentSections = await this.getHomeSections();
      const updatedSections = { ...currentSections, ...sectionsData };
      
      return await this.set("home_sections", updatedSections);
    } catch (error) {
      throw error;
    }
  }

  // Get all home settings at once
  static async getAllHomeSettings() {
    try {
      const [
        slider,
        about,
        cta,
        albums,
        testimonials,
        whatsapp,
        sections,
        siteMeta
      ] = await Promise.all([
        this.getHomeSlider(),
        this.getHomeAbout(),
        this.getHomeCTA(),
        this.getHomeAlbums(),
        this.getHomeTestimonials(),
        this.getHomeWhatsApp(),
        this.getHomeSections(),
        this.getSiteMeta()
      ]);

      return {
        home_slider: slider,
        home_about: about,
        home_cta: cta,
        home_albums: albums,
        home_testimonials: testimonials,
        home_whatsapp: whatsapp,
        home_sections: sections,
        site_meta: siteMeta
      };
    } catch (error) {
      throw error;
    }
  }

  // Update get public to include all home settings
  static async getPublic() {
    try {
      const publicKeys = [
        "whatsapp_owner",
        "social_links", 
        "site_meta",
        "home_slider",
        "home_about",
        "home_cta", 
        "home_albums",
        "home_testimonials",
        "home_whatsapp",
        "home_sections"
      ];

      return await this.getMultiple(publicKeys);
    } catch (error) {
      throw error;
    }
  }

  // ... باقي الدوال الموجودة ...
  
  // إعادة تصدير الدوال الموجودة
  static async get(key) {
    try {
      const setting = await db("settings").where("key", key).first();

      if (!setting) {
        return null;
      }

      try {
        return JSON.parse(setting.value);
      } catch (error) {
        return setting.value;
      }
    } catch (error) {
      throw error;
    }
  }

  static async set(key, value) {
    try {
      const stringValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);

      const exists = await db("settings").where("key", key).first();

      if (exists) {
        await db("settings").where("key", key).update({
          value: stringValue,
          updated_at: fn.now(),
        });
      } else {
        await db("settings").insert({
          key,
          value: stringValue,
          created_at: fn.now(),
          updated_at: fn.now(),
        });
      }

      return await this.get(key);
    } catch (error) {
      throw error;
    }
  }

  static async getMultiple(keys) {
    try {
      const settings = await db("settings").whereIn("key", keys);

      const result = {};

      settings.forEach((setting) => {
        try {
          result[setting.key] = JSON.parse(setting.value);
        } catch (error) {
          result[setting.key] = setting.value;
        }
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const settings = await db("settings").orderBy("key", "asc");

      const result = {};

      settings.forEach((setting) => {
        try {
          result[setting.key] = JSON.parse(setting.value);
        } catch (error) {
          result[setting.key] = setting.value;
        }
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async setMultiple(settingsObject) {
    try {
      const results = {};

      for (const [key, value] of Object.entries(settingsObject)) {
        results[key] = await this.set(key, value);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  static async delete(key) {
    try {
      const setting = await db("settings").where("key", key).first();

      if (!setting) {
        throw new Error("Setting not found");
      }

      await db("settings").where("key", key).del();

      return setting;
    } catch (error) {
      throw error;
    }
  }

  static async getWhatsAppOwner() {
    try {
      return (await this.get("whatsapp_owner")) || process.env.WHATSAPP_OWNER;
    } catch (error) {
      throw error;
    }
  }

  static async getSocialLinks() {
    try {
      const links = await this.get("social_links");

      if (!links) {
        return {
          instagram: "",
          facebook: "",
          whatsapp: "",
        };
      }

      return links;
    } catch (error) {
      throw error;
    }
  }

  static async getSiteMeta() {
    try {
      const meta = await this.get("site_meta");

      if (!meta) {
        return {
          title: "ساندي مكرمية - Sandy Macrame",
          description: "أجمل أعمال المكرمية والبراويز اليدوية من ساندي مكرمية",
          keywords: "مكرمية, براويز, ساندي, يدوية, فلسطين",
          logo: "/images/logo.png",
        };
      }

      return meta;
    } catch (error) {
      throw error;
    }
  }

  static async getHomeSlider() {
    try {
      const slider = await this.get("home_slider");

      if (!slider) {
        return {
          macrame: {
            title: "أعمال مكرمية فريدة",
            subtitle: "اكتشف جمال المكرمية اليدوية",
            button_text: "شاهد أعمال المكرمية",
            image: "/images/macrame-cover.jpg",
          },
          frames: {
            title: "براويز رائعة التصميم", 
            subtitle: "براويز فنية تضفي جمالاً لمنزلك",
            button_text: "شاهد البراويز",
            image: "/images/frames-cover.jpg",
          },
        };
      }

      return slider;
    } catch (error) {
      throw error;
    }
  }

  static async updateWhatsAppOwner(phoneNumber) {
    try {
      return await this.set("whatsapp_owner", phoneNumber);
    } catch (error) {
      throw error;
    }
  }

  static async updateSocialLinks(links) {
    try {
      const currentLinks = await this.getSocialLinks();
      const updatedLinks = { ...currentLinks, ...links };

      return await this.set("social_links", updatedLinks);
    } catch (error) {
      throw error;
    }
  }

  static async updateSiteMeta(meta) {
    try {
      const currentMeta = await this.getSiteMeta();
      const updatedMeta = { ...currentMeta, ...meta };

      return await this.set("site_meta", updatedMeta);
    } catch (error) {
      throw error;
    }
  }

  static async updateHomeSlider(slider) {
    try {
      const currentSlider = await this.getHomeSlider();
      const updatedSlider = {
        macrame: { ...currentSlider.macrame, ...(slider.macrame || {}) },
        frames: { ...currentSlider.frames, ...(slider.frames || {}) },
      };

      return await this.set("home_slider", updatedSlider);
    } catch (error) {
      throw error;
    }
  }
}

// إضافة هذه السطور في نهاية ملف server/src/module/settings/service.js

// Export named functions
export const get = SettingsService.get.bind(SettingsService);
export const set = SettingsService.set.bind(SettingsService);
export const getMultiple = SettingsService.getMultiple.bind(SettingsService);
export const getAll = SettingsService.getAll.bind(SettingsService);
export const getAllHomeSettings =
  SettingsService.getAllHomeSettings.bind(SettingsService);
export const setMultiple = SettingsService.setMultiple.bind(SettingsService);
export const getPublic = SettingsService.getPublic.bind(SettingsService);

// Home specific methods
export const getHomeAbout = SettingsService.getHomeAbout.bind(SettingsService);
export const updateHomeAbout =
  SettingsService.updateHomeAbout.bind(SettingsService);
export const getHomeCTA = SettingsService.getHomeCTA.bind(SettingsService);
export const updateHomeCTA =
  SettingsService.updateHomeCTA.bind(SettingsService);
export const getHomeAlbums =
  SettingsService.getHomeAlbums.bind(SettingsService);
export const updateHomeAlbums =
  SettingsService.updateHomeAlbums.bind(SettingsService);
export const getHomeTestimonials =
  SettingsService.getHomeTestimonials.bind(SettingsService);
export const updateHomeTestimonials =
  SettingsService.updateHomeTestimonials.bind(SettingsService);
export const getHomeWhatsApp =
  SettingsService.getHomeWhatsApp.bind(SettingsService);
export const updateHomeWhatsApp =
  SettingsService.updateHomeWhatsApp.bind(SettingsService);
export const getHomeSections =
  SettingsService.getHomeSections.bind(SettingsService);
export const updateHomeSections =
  SettingsService.updateHomeSections.bind(SettingsService);

// Existing methods
export const getWhatsAppOwner =
  SettingsService.getWhatsAppOwner.bind(SettingsService);
export const getSocialLinks =
  SettingsService.getSocialLinks.bind(SettingsService);
export const getSiteMeta = SettingsService.getSiteMeta.bind(SettingsService);
export const getHomeSlider =
  SettingsService.getHomeSlider.bind(SettingsService);
export const updateWhatsAppOwner =
  SettingsService.updateWhatsAppOwner.bind(SettingsService);
export const updateSocialLinks =
  SettingsService.updateSocialLinks.bind(SettingsService);
export const updateSiteMeta =
  SettingsService.updateSiteMeta.bind(SettingsService);
export const updateHomeSlider =
  SettingsService.updateHomeSlider.bind(SettingsService);

export const deleteSetting = SettingsService.delete.bind(SettingsService);

export default SettingsService;