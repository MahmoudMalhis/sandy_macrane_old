
import db from "../../db/knex.js";

class AboutPageService {
  static async getAboutPageSettings() {
    try {
      const settings = await db("settings")
        .whereIn("key", [
          "about_hero",
          "about_story",
          "about_values",
          "about_workshop",
          "about_timeline",
          "about_seo",
        ])
        .select("key", "value");

      const result = {};
      settings.forEach((setting) => {
        try {
          result[setting.key] = JSON.parse(setting.value);
        } catch {
          result[setting.key] = setting.value;
        }
      });

      return {
        about_hero: result.about_hero || {
          title: "من نحن",
          subtitle: "قصة إبداع وشغف",
          description: "نحن فريق متخصص في فن المكرمية الحديث",
          background_image: "",
          cta_text: "تعرف على قصتنا",
          cta_link: "#story",
        },
        about_story: result.about_story || {
          title: "قصتنا",
          content: "",
          image: "",
          highlights: [],
        },
        about_values: result.about_values || {
          title: "قيمنا",
          items: [],
        },
        about_workshop: result.about_workshop || {
          title: "داخل ورشة العمل",
          description: "نظرة على المكان الذي تولد فيه الأفكار",
          images: [],
        },
        about_timeline: result.about_timeline || {
          title: "رحلتنا",
          events: [],
        },
        about_seo: result.about_seo || {
          title: "من نحن | Sandy Macrame",
          description: "تعرف على قصتنا ورؤيتنا في فن المكرمية",
          keywords: "من نحن، مكرمية، فن يدوي",
        },
      };
    } catch (error) {
      throw new Error(`Failed to get about page settings: ${error.message}`);
    }
  }

  static async updateHeroSection(data) {
    try {
      const value = JSON.stringify(data);
      await db("settings")
        .insert({ key: "about_hero", value })
        .onConflict("key")
        .merge({ value, updated_at: db.fn.now() });

      return { success: true, data };
    } catch (error) {
      throw new Error(`Failed to update hero section: ${error.message}`);
    }
  }

  static async updateStorySection(data) {
    try {
      const value = JSON.stringify(data);
      await db("settings")
        .insert({ key: "about_story", value })
        .onConflict("key")
        .merge({ value, updated_at: db.fn.now() });

      return { success: true, data };
    } catch (error) {
      throw new Error(`Failed to update story section: ${error.message}`);
    }
  }

  static async updateValuesSection(data) {
    try {
      const value = JSON.stringify(data);
      await db("settings")
        .insert({ key: "about_values", value })
        .onConflict("key")
        .merge({ value, updated_at: db.fn.now() });

      return { success: true, data };
    } catch (error) {
      throw new Error(`Failed to update values section: ${error.message}`);
    }
  }

  static async updateWorkshopSection(data) {
    try {
      const value = JSON.stringify(data);
      await db("settings")
        .insert({ key: "about_workshop", value })
        .onConflict("key")
        .merge({ value, updated_at: db.fn.now() });

      return { success: true, data };
    } catch (error) {
      throw new Error(`Failed to update workshop section: ${error.message}`);
    }
  }

  static async updateTimelineSection(data) {
    try {
      const value = JSON.stringify(data);
      await db("settings")
        .insert({ key: "about_timeline", value })
        .onConflict("key")
        .merge({ value, updated_at: db.fn.now() });

      return { success: true, data };
    } catch (error) {
      throw new Error(`Failed to update timeline section: ${error.message}`);
    }
  }

  static async updateSEOSettings(data) {
    try {
      const value = JSON.stringify(data);
      await db("settings")
        .insert({ key: "about_seo", value })
        .onConflict("key")
        .merge({ value, updated_at: db.fn.now() });

      return { success: true, data };
    } catch (error) {
      throw new Error(`Failed to update SEO settings: ${error.message}`);
    }
  }

  /**
   * Update all sections at once
   */
  static async updateAllSections(sections) {
    try {
      const trx = await db.transaction();

      try {
        for (const [key, data] of Object.entries(sections)) {
          const value = JSON.stringify(data);
          await trx("settings")
            .insert({ key, value })
            .onConflict("key")
            .merge({ value, updated_at: db.fn.now() });
        }

        await trx.commit();
        return { success: true, data: sections };
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    } catch (error) {
      throw new Error(`Failed to update all sections: ${error.message}`);
    }
  }
}

export default AboutPageService;
