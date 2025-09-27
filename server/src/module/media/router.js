import { Router } from "express";
import { body } from "express-validator";
import {
  uploadToAlbum,
  getAlbumMedia,
  reorder,
  update,
  delete as deleteMedia,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";
import { upload } from "../../utils/upload.js";

const router = Router();

// Media update validation
const mediaUpdateValidation = [
  body("alt")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Alt text must not exceed 255 characters"),
  body("is_cover")
    .optional()
    .isBoolean()
    .withMessage("is_cover must be a boolean"),
  body("sort_order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("sort_order must be a non-negative integer"),
];

// Reorder validation
const reorderValidation = [
  body("mediaIds")
    .isArray()
    .withMessage("mediaIds must be an array")
    .custom((value) => {
      if (!value.every((id) => Number.isInteger(id) && id > 0)) {
        throw new Error("All mediaIds must be positive integers");
      }
      return true;
    }),
];

// All routes require authentication
router.use(authGuard);

// Album media routes
router.post("/album/:albumId", upload.array("media_files", 10), uploadToAlbum);
router.get("/album/:albumId", getAlbumMedia);
router.post("/album/:albumId/reorder", reorderValidation, validate, reorder);

// Individual media routes
router.put("/:id", mediaUpdateValidation, validate, update);
router.delete("/:id", deleteMedia);

export default router;
