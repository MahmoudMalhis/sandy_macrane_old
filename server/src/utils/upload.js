// server/src/utils/upload.js

import multer from "multer";
import {
  storageConfigs,
  deleteFromCloudinary,
  extractPublicId,
} from "../config/cloudinary.config.js";

/**
 * ⚠️ IMPORTANT: هذا الملف تم تحديثه لاستخدام Cloudinary
 * جميع الصور يتم رفعها مباشرة إلى Cloudinary CDN
 */

/**
 * تحديد نوع التخزين المناسب بناءً على fieldname
 * @param {string} fieldname - اسم الحقل في الفورم
 * @returns {CloudinaryStorage} - Cloudinary storage instance
 */
const getStorageByFieldName = (fieldname) => {
  switch (fieldname) {
    case "album_images":
    case "media_files":
    case "cover_image":
      return storageConfigs.albums;

    case "review_image":
      return storageConfigs.reviews;

    case "file": // لرفع الصور في Settings
      return storageConfigs.settings;

    default:
      return storageConfigs.misc;
  }
};

/**
 * Multer storage configuration
 * يتم استخدام dynamic storage لاختيار المجلد المناسب في Cloudinary
 */
const storage = multer.diskStorage({
  storage: (req, file, cb) => {
    const cloudinaryStorage = getStorageByFieldName(file.fieldname);
    cb(null, cloudinaryStorage);
  },
});

/**
 * File filter - السماح فقط بالصور
 * @param {Object} req - Express request
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("نوع الملف غير صالح. الصيغ المسموحة: JPG, PNG, GIF, WEBP فقط."),
      false
    );
  }
};

/**
 * إنشاء Multer instances لأنواع مختلفة من الرفع
 */

// For albums media (multiple files)
export const uploadAlbumMedia = multer({
  storage: storageConfigs.albums,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

// For reviews (single file)
export const uploadReviewImage = multer({
  storage: storageConfigs.reviews,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

// For settings images (single file)
export const uploadSettingsImage = multer({
  storage: storageConfigs.settings,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB للإعدادات
  },
  fileFilter: fileFilter,
});

// General upload (fallback)
export const upload = multer({
  storage: storageConfigs.misc,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

/**
 * معالجة الملفات المرفوعة وإرجاع البيانات بالشكل المطلوب
 * @param {Object} req - Express request
 * @param {Array} files - Multer files array
 * @returns {Array} - Processed files data
 */
export const processUploadedFiles = (req, files) => {
  if (!files || files.length === 0) return [];

  return files.map((file) => {
    // Cloudinary يعيد البيانات في file.path (URL) و file.filename (public_id)
    return {
      filename: file.filename, // Public ID في Cloudinary
      originalname: file.originalname,
      path: file.path, // Full Cloudinary URL
      url: file.path, // نفس الـ path (Cloudinary URL)
      size: file.size,
      mimetype: file.mimetype,
      cloudinary_id: file.filename, // نفس الـ filename
    };
  });
};

/**
 * حذف ملف من Cloudinary
 * @param {string} filePathOrUrl - مسار الملف أو URL
 * @returns {Promise<boolean>} - نجح الحذف أم لا
 */
export const deleteFile = async (filePathOrUrl) => {
  try {
    // استخراج Public ID من الـ URL
    const publicId = extractPublicId(filePathOrUrl);

    if (!publicId) {
      console.warn("Could not extract public ID from:", filePathOrUrl);
      return false;
    }

    // حذف من Cloudinary
    return await deleteFromCloudinary(publicId);
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

/**
 * الحصول على URL الكامل للملف
 * (في Cloudinary، الـ URL يأتي جاهزاً مباشرة)
 * @param {Object} req - Express request (غير مستخدم مع Cloudinary)
 * @param {string} relativePath - URL من Cloudinary
 * @returns {string} - Full URL
 */
export const getFileUrl = (req, relativePath) => {
  // في Cloudinary، الـ relativePath هو بالفعل URL كامل
  return relativePath;
};

/**
 * تصدير backward compatibility
 * لتجنب كسر الكود القديم
 */
export default {
  upload,
  uploadAlbumMedia,
  uploadReviewImage,
  uploadSettingsImage,
  deleteFile,
  getFileUrl,
  processUploadedFiles,
};
