// server/src/module/settings/controller.js - Controller موسع
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
import {
  error as logError,
  info as logInfo,
} from "../../utils/logger.js";

class SettingsController {
  // Get public settings (public)
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

  // Get all home settings (admin)
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

  // Update home about section (admin)
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

  // Update home CTA section (admin)
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

  // Update home albums section (admin)
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

  // Update home testimonials section (admin)
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

  // Update home WhatsApp settings (admin)
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

  // Update home sections visibility/order (admin)
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

  // ... باقي الدوال الموجودة ...

  // Get all settings (admin)
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

  // Update home slider (admin)
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

  // Update site metadata (admin)
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
}

// Export all functions
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

export default SettingsController;
