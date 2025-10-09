import {
  getPublic as _getPublic,
  getAll as _getAll,
  getAllHomeSettings as _getAllHomeSettings,
  get,
  set as _set,
  setMultiple as _setMultiple,
  deleteSetting as _delete,
  updateWhatsAppOwner,
  updateSocialLinks as _updateSocialLinks,
  updateSiteMeta as _updateSiteMeta,
  updateHomeSlider as _updateHomeSlider,
  updateHomeAbout as _updateHomeAbout,
  updateHomeCTA as _updateHomeCTA,
  updateHomeAlbums as _updateHomeAlbums,
  updateHomeTestimonials as _updateHomeTestimonials,
  updateHomeWhatsApp as _updateHomeWhatsApp,
  updateHomeSections as _updateHomeSections,
} from "./service.js";
import { error as logError, info as logInfo } from "../../utils/logger.js";
import AboutPageService from "./aboutPageService.js";

class SettingsController {
  static async getPublic(req, res) {
    try {
      const settings = await _getPublic();

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      logError("Get public settings failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch settings",
      });
    }
  }

  static async getAllHomeSettings(req, res) {
    try {
      const settings = await _getAllHomeSettings();

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      logError("Get all home settings failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch home settings",
      });
    }
  }

  static async updateHomeAbout(req, res) {
    try {
      const aboutData = req.body;
      const result = await _updateHomeAbout(aboutData);

      logInfo("Home about section updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Home about section updated successfully",
        data: result,
      });
    } catch (error) {
      logError("Update home about failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update home about section",
      });
    }
  }

  static async updateHomeCTA(req, res) {
    try {
      const ctaData = req.body;
      const result = await _updateHomeCTA(ctaData);

      logInfo("Home CTA section updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Home CTA section updated successfully",
        data: result,
      });
    } catch (error) {
      logError("Update home CTA failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update home CTA section",
      });
    }
  }

  static async updateHomeAlbums(req, res) {
    try {
      const albumsData = req.body;
      const result = await _updateHomeAlbums(albumsData);

      logInfo("Home albums section updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Home albums section updated successfully",
        data: result,
      });
    } catch (error) {
      logError("Update home albums failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update home albums section",
      });
    }
  }

  static async updateHomeTestimonials(req, res) {
    try {
      const testimonialsData = req.body;
      const result = await _updateHomeTestimonials(testimonialsData);

      logInfo("Home testimonials section updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Home testimonials section updated successfully",
        data: result,
      });
    } catch (error) {
      logError("Update home testimonials failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update home testimonials section",
      });
    }
  }

  static async updateHomeWhatsApp(req, res) {
    try {
      const whatsappData = req.body;
      const result = await _updateHomeWhatsApp(whatsappData);

      logInfo("Home WhatsApp settings updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Home WhatsApp settings updated successfully",
        data: result,
      });
    } catch (error) {
      logError("Update home WhatsApp failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update home WhatsApp settings",
      });
    }
  }

  static async updateHomeSections(req, res) {
    try {
      const sectionsData = req.body;
      const result = await _updateHomeSections(sectionsData);

      logInfo("Home sections updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Home sections updated successfully",
        data: result,
      });
    } catch (error) {
      logError("Update home sections failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update home sections",
      });
    }
  }

  static async getAll(req, res) {
    try {
      const settings = await _getAll();

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      logError("Get all settings failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch settings",
      });
    }
  }

  static async updateHomeSlider(req, res) {
    try {
      const slider = req.body;
      const result = await _updateHomeSlider(slider);

      logInfo("Home slider updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Home slider updated successfully",
        data: result,
      });
    } catch (error) {
      logError("Update home slider failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update home slider",
      });
    }
  }

  static async updateSiteMeta(req, res) {
    try {
      const meta = req.body;
      const result = await _updateSiteMeta(meta);

      logInfo("Site metadata updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Site metadata updated successfully",
        data: result,
      });
    } catch (error) {
      logError("Update site metadata failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update site metadata",
      });
    }
  }

  static async getAboutPagePublic(req, res) {
    try {
      const settings = await AboutPageService.getAboutPageSettings();

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      logError("Get about page settings failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch about page settings",
      });
    }
  }

  static async getAboutPageAdmin(req, res) {
    try {
      const settings = await AboutPageService.getAboutPageSettings();

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      logError("Get about page admin settings failed", {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch about page settings",
      });
    }
  }

  static async updateAboutHero(req, res) {
    try {
      const result = await AboutPageService.updateHeroSection(req.body);

      logInfo("About hero section updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Hero section updated successfully",
        data: result.data,
      });
    } catch (error) {
      logError("Update about hero failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update hero section",
      });
    }
  }

  static async updateAboutStory(req, res) {
    try {
      const result = await AboutPageService.updateStorySection(req.body);

      logInfo("About story section updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Story section updated successfully",
        data: result.data,
      });
    } catch (error) {
      logError("Update about story failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update story section",
      });
    }
  }

  static async updateAboutValues(req, res) {
    try {
      const result = await AboutPageService.updateValuesSection(req.body);

      logInfo("About values section updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Values section updated successfully",
        data: result.data,
      });
    } catch (error) {
      logError("Update about values failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update values section",
      });
    }
  }

  static async updateAboutWorkshop(req, res) {
    try {
      const result = await AboutPageService.updateWorkshopSection(req.body);

      logInfo("About workshop section updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Workshop section updated successfully",
        data: result.data,
      });
    } catch (error) {
      logError("Update about workshop failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update workshop section",
      });
    }
  }
  static async updateAboutTimeline(req, res) {
    try {
      const result = await AboutPageService.updateTimelineSection(req.body);

      logInfo("About timeline section updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Timeline section updated successfully",
        data: result.data,
      });
    } catch (error) {
      logError("Update about timeline failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update timeline section",
      });
    }
  }

  static async updateAboutSEO(req, res) {
    try {
      const result = await AboutPageService.updateSEOSettings(req.body);

      logInfo("About SEO settings updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "SEO settings updated successfully",
        data: result.data,
      });
    } catch (error) {
      logError("Update about SEO failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update SEO settings",
      });
    }
  }

  static async updateAllAboutSections(req, res) {
    try {
      const result = await AboutPageService.updateAllSections(req.body);

      logInfo("All about sections updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "All sections updated successfully",
        data: result.data,
      });
    } catch (error) {
      logError("Update all about sections failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update sections",
      });
    }
  }

  static async updateAboutStats(req, res) {
    try {
      const result = await AboutPageService.updateStatsSection(req.body);

      logInfo("About stats section updated", {
        updatedBy: req.user?.email || "unknown",
      });

      res.json({
        success: true,
        message: "Stats section updated successfully",
        data: result.data,
      });
    } catch (error) {
      logError("Update about stats failed", {
        updatedBy: req.user?.email || "unknown",
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update stats section",
      });
    }
  }

}

export const getPublic = SettingsController.getPublic;
export const getAll = SettingsController.getAll;
export const getAllHomeSettings = SettingsController.getAllHomeSettings;
export const updateHomeSlider = SettingsController.updateHomeSlider;
export const updateSiteMeta = SettingsController.updateSiteMeta;
export const updateHomeAbout = SettingsController.updateHomeAbout;
export const updateHomeCTA = SettingsController.updateHomeCTA;
export const updateHomeAlbums = SettingsController.updateHomeAlbums;
export const updateHomeTestimonials = SettingsController.updateHomeTestimonials;
export const updateHomeWhatsApp = SettingsController.updateHomeWhatsApp;
export const updateHomeSections = SettingsController.updateHomeSections;
export const getAboutPagePublic = SettingsController.getAboutPagePublic;
export const getAboutPageAdmin = SettingsController.getAboutPageAdmin;
export const updateAboutHero = SettingsController.updateAboutHero;
export const updateAboutStory = SettingsController.updateAboutStory;
export const updateAboutValues = SettingsController.updateAboutValues;
export const updateAboutWorkshop = SettingsController.updateAboutWorkshop;
export const updateAboutTimeline = SettingsController.updateAboutTimeline;
export const updateAboutSEO = SettingsController.updateAboutSEO;
export const updateAllAboutSections = SettingsController.updateAllAboutSections;
export const updateAboutStats = SettingsController.updateAboutStats;

export default SettingsController;
