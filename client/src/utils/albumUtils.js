// client/src/utils/albumUtils.js
/**
 * دوال مساعدة موحدة للألبومات
 * تُستخدم في جميع الصفحات والمكونات التي تعرض الألبومات
 */

/**
 * الحصول على نوع البادج حسب الحالة
 * @param {string} status - حالة الألبوم
 * @returns {string} نوع البادج
 */
export const getBadgeVariant = (status) => {
  switch (status) {
    case "published":
      return "featured";
    case "draft":
      return "new";
    case "new":
      return "new";
    case "featured":
      return "featured";
    default:
      return "category";
  }
};

/**
 * الحصول على نص البادج حسب الحالة وعدد المشاهدات
 * @param {string} status - حالة الألبوم
 * @param {number} viewCount - عدد المشاهدات
 * @returns {string} نص البادج
 */
export const getBadgeText = (status, viewCount = 0) => {
  if (viewCount > 200) return "مميز";
  if (status === "published") return "";
  if (status === "new") return "جديد";
  return "جديد";
};

/**
 * الحصول على نص الفئة بالعربية
 * @param {string} category - فئة الألبوم (macrame/frame)
 * @returns {string} النص بالعربية
 */
export const getCategoryText = (category) => {
  return category === "macrame" ? "مكرمية" : "برواز";
};

/**
 * فرز الألبومات حسب الإعدادات
 * @param {Array} albums - مصفوفة الألبومات
 * @param {string} sortBy - طريقة الفرز (view_count/created_at/random)
 * @param {number} limit - عدد النتائج المطلوبة
 * @returns {Array} الألبومات المفروزة
 */
export const sortAlbums = (albums, sortBy = "view_count", limit = null) => {
  if (!albums || albums.length === 0) return [];

  let sortedAlbums = [...albums];

  switch (sortBy) {
    case "view_count":
      sortedAlbums.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      break;
    case "created_at":
      sortedAlbums.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      break;
    case "random":
      sortedAlbums = sortedAlbums.sort(() => Math.random() - 0.5);
      break;
    default:
      break;
  }

  return limit ? sortedAlbums.slice(0, limit) : sortedAlbums;
};

/**
 * تحضير بيانات الصور للـ Lightbox
 * @param {Object} album - بيانات الألبوم
 * @returns {Array} مصفوفة الصور
 */
export const prepareAlbumImages = (album) => {
  if (!album.media || album.media.length === 0) {
    // إذا لم تكن هناك صور متعددة، اعرض الصورة الرئيسية
    return [
      {
        url: album.cover_image || album.cover_media?.url,
        alt: album.title,
        title: album.title,
      },
    ];
  }

  return album.media.map((media) => ({
    url: media.url,
    alt: media.alt || album.title,
    title: album.title,
  }));
};

/**
 * دالة موحدة للحصول على جميع المساعدات
 * @returns {Object} كائن يحتوي على جميع الدوال المساعدة
 */
export const getAlbumUtils = () => ({
  getBadgeVariant,
  getBadgeText,
  getCategoryText,
  sortAlbums,
  prepareAlbumImages,
});

export default {
  getBadgeVariant,
  getBadgeText,
  getCategoryText,
  sortAlbums,
  prepareAlbumImages,
  getAlbumUtils,
};
