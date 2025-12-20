// server/src/config/cloudinary.config.js

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

/**
 * Cloudinary Configuration
 * يتم استخدام هذا الملف لإعداد Cloudinary والتخزين
 */

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // استخدام HTTPS دائماً
});

/**
 * Create Cloudinary storage for different upload types
 * @param {string} folderName - المجلد في Cloudinary
 * @param {string[]} allowedFormats - الصيغ المسموحة
 * @returns {CloudinaryStorage} - Multer storage instance
 */
const createCloudinaryStorage = (
  folderName = "sandy-macrame",
  allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"]
) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: allowedFormats,
      transformation: [
        {
          quality: "auto:good", // تحسين الجودة تلقائياً
          fetch_format: "auto", // تحويل الصيغة تلقائياً للأفضل
        },
      ],
      // توليد اسم فريد لكل صورة
      public_id: (req, file) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const originalName = file.originalname.split(".")[0];
        return `${originalName}-${timestamp}-${randomString}`;
      },
    },
  });
};

/**
 * Storage configurations for different upload types
 */
export const storageConfigs = {
  // Albums media
  albums: createCloudinaryStorage("sandy-macrame/albums"),

  // Reviews images
  reviews: createCloudinaryStorage("sandy-macrame/reviews"),

  // Settings images (hero, about, cta, etc.)
  settings: createCloudinaryStorage("sandy-macrame/settings"),

  // Miscellaneous uploads
  misc: createCloudinaryStorage("sandy-macrame/misc"),
};

/**
 * حذف صورة من Cloudinary
 * @param {string} publicId - Public ID للصورة في Cloudinary
 * @returns {Promise<boolean>} - نجح الحذف أم لا
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return false;

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};

/**
 * استخراج Public ID من Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID أو null
 */
export const extractPublicId = (url) => {
  try {
    if (!url || !url.includes("cloudinary.com")) return null;

    // Extract public_id from URL
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
    const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/i);
    if (matches && matches[1]) {
      return matches[1];
    }

    return null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

/**
 * تحسين URL للصورة مع Transformations
 * @param {string} url - Cloudinary URL
 * @param {Object} options - خيارات التحسين
 * @returns {string} - URL محسّن
 */
export const optimizeImageUrl = (
  url,
  options = { width: 800, quality: "auto" }
) => {
  try {
    if (!url || !url.includes("cloudinary.com")) return url;

    const publicId = extractPublicId(url);
    if (!publicId) return url;

    // Build transformation string
    const transformations = [];
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.crop) transformations.push(`c_${options.crop}`);

    return cloudinary.url(publicId, {
      transformation: transformations.join(","),
      secure: true,
    });
  } catch (error) {
    console.error("Error optimizing image URL:", error);
    return url;
  }
};

export { cloudinary };
export default cloudinary;
