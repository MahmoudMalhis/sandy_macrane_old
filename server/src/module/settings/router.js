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
  getAboutPagePublic,
  getAboutPageAdmin,
  updateAboutHero,
  updateAboutStory,
  updateAboutValues,
  updateAboutTimeline,
  updateAboutSEO,
  updateAllAboutSections,
  updateAboutWorkshop,
  updateAboutStats,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

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

const aboutHeroValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("subtitle").optional().trim(),
  body("description").optional().trim(),
  body("background_image")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Invalid image URL"),
  body("cta_text").optional().trim(),
  body("cta_link").optional().trim(),
];

const aboutStoryValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("image").optional().isURL().withMessage("Invalid image URL"),
  body("highlights").optional().isArray(),
];

const aboutValuesValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("items").isArray().withMessage("Items must be an array"),
  body("items.*.title")
    .trim()
    .notEmpty()
    .withMessage("Value title is required"),
  body("items.*.description").optional().trim(),
  body("items.*.icon").optional().trim(),
];

const aboutWorkshopValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().trim(),
  body("images").optional().isArray(),
  body("images.*.src").optional().trim(),
  body("images.*.alt").optional().trim(),
  body("images.*.title").optional().trim(),
];

const aboutTimelineValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("events").optional().isArray(),
  body("events.*.year").optional().trim(),
  body("events.*.title").optional().trim(),
  body("events.*.description").optional().trim(),
];

const aboutSEOValidation = [
  body("title").optional().trim(),
  body("description").optional().trim(),
  body("keywords").optional().trim(),
];

const aboutStatsValidation = [
  body("items").isArray().withMessage("Items must be an array"),
  body("items.*.number").trim().notEmpty().withMessage("Number is required"),
  body("items.*.label").trim().notEmpty().withMessage("Label is required"),
  body("items.*.icon").optional().trim(),
];

router.get("/public", getPublic);
router.use("/admin", authGuard);
router.get("/admin", getAll);
router.get("/admin/home", getAllHomeSettings);
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
router.put("/admin/site/meta", siteMetaValidation, validate, updateSiteMeta);
router.get("/about-page/public", getAboutPagePublic);

router.get("/admin/about-page", authGuard, getAboutPageAdmin);

router.put(
  "/admin/about-page/hero",
  authGuard,
  aboutHeroValidation,
  validate,
  updateAboutHero
);

router.put(
  "/admin/about-page/story",
  authGuard,
  aboutStoryValidation,
  validate,
  updateAboutStory
);

router.put(
  "/admin/about-page/values",
  authGuard,
  aboutValuesValidation,
  validate,
  updateAboutValues
);

router.put(
  "/admin/about-page/workshop",
  authGuard,
  aboutWorkshopValidation,
  validate,
  updateAboutWorkshop
);

router.put(
  "/admin/about-page/timeline",
  authGuard,
  aboutTimelineValidation,
  validate,
  updateAboutTimeline
);

router.put(
  "/admin/about-page/seo",
  authGuard,
  aboutSEOValidation,
  validate,
  updateAboutSEO
);

router.put(
  "/admin/about-page/all",
  authGuard,
  validate,
  updateAllAboutSections
);

router.put(
  "/admin/about-page/stats",
  authGuard,
  aboutStatsValidation,
  validate,
  updateAboutStats
);
export default router;
