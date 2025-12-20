// server/src/db/migrations/20250120_add_cloudinary_id.js

/**
 * Migration لإضافة حقل cloudinary_id للصور
 * يتم استخدام هذا الحقل لحفظ Public ID من Cloudinary
 * لتسهيل عملية الحذف من Cloudinary لاحقاً
 */

export function up(knex) {
  return knex.schema
    .table("media", (table) => {
      table
        .string("cloudinary_id", 255)
        .nullable()
        .comment("Public ID للصورة في Cloudinary");
    })
    .table("reviews", (table) => {
      table
        .string("cloudinary_id", 255)
        .nullable()
        .comment("Public ID لصورة التقييم في Cloudinary");
    });
}

export function down(knex) {
  return knex.schema
    .table("media", (table) => {
      table.dropColumn("cloudinary_id");
    })
    .table("reviews", (table) => {
      table.dropColumn("cloudinary_id");
    });
}
