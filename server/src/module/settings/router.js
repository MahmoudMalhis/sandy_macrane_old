// server/src/module/settings/router.js - Router محدث مع مسار /admin
import { Router } from "express";
import { body } from "express-validator";
import {
  getPublic,
  getAll,
  getAllHomeSettings,
  updateHomeSlider,
  updateSiteMeta,
  updateHomeAbout,
  updateHomeCTA,
  updateHomeAlbums,
  updateHomeTestimonials,
  updateHomeWhatsApp,
  updateHomeSections,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

// Home slider validation
const homeSliderValidation = [
  body("macrame.title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Macrame title must not exceed 100 characters"),
  body("macrame.subtitle")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Macrame subtitle must not exceed 200 characters"),
  body("macrame.button_text")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Macrame button text must not exceed 50 characters"),
  body("macrame.image").optional().trim(),
  body("frames.title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Frames title must not exceed 100 characters"),
  body("frames.subtitle")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Frames subtitle must not exceed 200 characters"),
  body("frames.button_text")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Frames button text must not exceed 50 characters"),
  body("frames.image").optional().trim(),
];

// Site metadata validation
const siteMetaValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must not exceed 200 characters"),
  body("keywords")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Keywords must not exceed 200 characters"),
  body("logo").optional().trim(),
];

// About section validation
const aboutValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters"),
  body("subtitle")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Subtitle must not exceed 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  body("button_text")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Button text must not exceed 50 characters"),
  body("image").optional().trim(),
  body("highlights").optional().isArray(),
];

// CTA section validation
const ctaValidation = [
  body("section_title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Section title must not exceed 100 characters"),
  body("section_description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Section description must not exceed 500 characters"),
  body("custom_design.title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Custom design title must not exceed 100 characters"),
  body("custom_design.subtitle")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Custom design subtitle must not exceed 200 characters"),
  body("custom_design.description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Custom design description must not exceed 500 characters"),
  body("custom_design.button_text")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Custom design button text must not exceed 50 characters"),
  body("gallery.title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Gallery title must not exceed 100 characters"),
  body("gallery.subtitle")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Gallery subtitle must not exceed 200 characters"),
  body("gallery.description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Gallery description must not exceed 500 characters"),
  body("gallery.button_text")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Gallery button text must not exceed 50 characters"),
];

// Albums section validation
const albumsValidation = [
  body("section_title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Section title must not exceed 100 characters"),
  body("section_description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Section description must not exceed 500 characters"),
  body("button_text")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Button text must not exceed 50 characters"),
  body("show_count")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Show count must be between 1 and 20"),
  body("sort_by")
    .optional()
    .isIn(["view_count", "created_at", "random"])
    .withMessage("Sort by must be view_count, created_at, or random"),
];

// Testimonials section validation
const testimonialsValidation = [
  body("section_title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Section title must not exceed 100 characters"),
  body("section_description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Section description must not exceed 500 characters"),
  body("button_text")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Button text must not exceed 50 characters"),
  body("show_count")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Show count must be between 1 and 10"),
  body("min_rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Min rating must be between 1 and 5"),
  body("autoplay")
    .optional()
    .isBoolean()
    .withMessage("Autoplay must be boolean"),
  body("autoplay_delay")
    .optional()
    .isInt({ min: 1000, max: 20000 })
    .withMessage("Autoplay delay must be between 1000 and 20000 ms"),
];

// WhatsApp settings validation
const whatsappValidation = [
  body("enabled").optional().isBoolean().withMessage("Enabled must be boolean"),
  body("show_after_scroll")
    .optional()
    .isInt({ min: 0, max: 2000 })
    .withMessage("Show after scroll must be between 0 and 2000 pixels"),
  body("business_hours.enabled")
    .optional()
    .isBoolean()
    .withMessage("Business hours enabled must be boolean"),
  body("business_hours.start")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),
  body("business_hours.end")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),
  body("quick_messages").optional().isArray(),
];

// Sections visibility validation
const sectionsValidation = [
  body("*.enabled")
    .optional()
    .isBoolean()
    .withMessage("Section enabled must be boolean"),
  body("*.order")
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage("Section order must be between 0 and 20"),
];

// Public routes
router.get("/public", getPublic);

// Admin routes
router.use("/admin", authGuard);

// GET routes for admin
router.get("/admin", getAll);
router.get("/admin/home", getAllHomeSettings);

// PUT routes for admin - home sections
router.put(
  "/admin/home/slider",
  homeSliderValidation,
  validate,
  updateHomeSlider
);
router.put("/admin/home/about", aboutValidation, validate, updateHomeAbout);
router.put("/admin/home/cta", ctaValidation, validate, updateHomeCTA);
router.put("/admin/home/albums", albumsValidation, validate, updateHomeAlbums);
router.put(
  "/admin/home/testimonials",
  testimonialsValidation,
  validate,
  updateHomeTestimonials
);
router.put(
  "/admin/home/whatsapp",
  whatsappValidation,
  validate,
  updateHomeWhatsApp
);
router.put(
  "/admin/home/sections",
  sectionsValidation,
  validate,
  updateHomeSections
);

// Site metadata route
router.put("/admin/site/meta", siteMetaValidation, validate, updateSiteMeta);

export default router;
