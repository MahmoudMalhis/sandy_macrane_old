import db, { fn, transaction } from "../../db/knex.js";
import { deleteFile } from "../../utils/upload.js";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// إصلاح __dirname للعمل مع ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MediaService {
  // Add media to album
  static async addToAlbum(albumId, mediaData) {
    try {
      const { url, alt, is_cover = false, sort_order = 0 } = mediaData;

      // If this is set as cover, remove cover from other media
      if (is_cover) {
        await db("media")
          .where("album_id", albumId)
          .update({ is_cover: false });
      }

      const [mediaId] = await db("media").insert({
        album_id: albumId,
        url,
        alt: alt || "",
        is_cover,
        sort_order,
        created_at: fn.now(),
      });

      // Update album cover_image if this is the cover
      if (is_cover) {
        await db("albums").where("id", albumId).update({
          cover_image: url,
          updated_at: fn.now(),
        });
      }

      return await this.getById(mediaId);
    } catch (error) {
      throw error;
    }
  }

  // Add multiple media files to album
  static async addMultipleToAlbum(albumId, mediaArray) {
    try {
      const results = [];

      for (let i = 0; i < mediaArray.length; i++) {
        const mediaData = {
          ...mediaArray[i],
          sort_order: mediaArray[i].sort_order || i,
          is_cover: i === 0 && mediaArray[i].is_cover !== false, // First image as cover by default
        };

        const media = await this.addToAlbum(albumId, mediaData);
        results.push(media);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  // Get media by ID
  static async getById(id) {
    try {
      const media = await db("media").where("id", id).first();

      if (!media) {
        throw new Error("Media not found");
      }

      return media;
    } catch (error) {
      throw error;
    }
  }

  // Get all media for an album
  static async getByAlbum(albumId) {
    try {
      return await db("media")
        .where("album_id", albumId)
        .orderBy("sort_order", "asc")
        .orderBy("id", "asc");
    } catch (error) {
      throw error;
    }
  }

  // Update media
  static async update(id, updateData) {
    try {
      const media = await this.getById(id);
      const { alt, is_cover, sort_order } = updateData;

      let updates = {};

      if (alt !== undefined) updates.alt = alt;
      if (sort_order !== undefined) updates.sort_order = sort_order;

      // Handle cover image changes
      if (is_cover !== undefined) {
        if (is_cover) {
          // Remove cover from other media in the same album
          await db("media")
            .where("album_id", media.album_id)
            .update({ is_cover: false });

          // Update album cover_image
          await db("albums").where("id", media.album_id).update({
            cover_image: media.url,
            updated_at: fn.now(),
          });
        } else {
          // If removing cover, check if album needs a new cover
          const otherCoverMedia = await db("media")
            .where("album_id", media.album_id)
            .where("id", "!=", id)
            .where("is_cover", true)
            .first();

          if (!otherCoverMedia) {
            // Set first media as new cover
            const firstMedia = await db("media")
              .where("album_id", media.album_id)
              .where("id", "!=", id)
              .orderBy("sort_order", "asc")
              .first();

            if (firstMedia) {
              await db("media")
                .where("id", firstMedia.id)
                .update({ is_cover: true });

              await db("albums").where("id", media.album_id).update({
                cover_image: firstMedia.url,
                updated_at: fn.now(),
              });
            } else {
              // No other media, remove album cover
              await db("albums").where("id", media.album_id).update({
                cover_image: null,
                updated_at: fn.now(),
              });
            }
          }
        }

        updates.is_cover = is_cover;
      }

      if (Object.keys(updates).length > 0) {
        await db("media").where("id", id).update(updates);
      }

      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete media
  static async delete(id) {
    try {
      const media = await this.getById(id);

      // Delete physical file
      const filePath = media.url.replace(/^.*\/uploads\//, "");
      const fullPath = join(__dirname, "../../../uploads/", filePath);
      deleteFile(fullPath);

      // If this was the cover image, set another as cover
      if (media.is_cover) {
        const newCoverMedia = await db("media")
          .where("album_id", media.album_id)
          .where("id", "!=", id)
          .orderBy("sort_order", "asc")
          .first();

        if (newCoverMedia) {
          await db("media")
            .where("id", newCoverMedia.id)
            .update({ is_cover: true });

          await db("albums").where("id", media.album_id).update({
            cover_image: newCoverMedia.url,
            updated_at: fn.now(),
          });
        } else {
          // No other media, remove album cover
          await db("albums").where("id", media.album_id).update({
            cover_image: null,
            updated_at: fn.now(),
          });
        }
      }

      // Delete from database
      await db("media").where("id", id).del();

      return media;
    } catch (error) {
      throw error;
    }
  }

  // Reorder media in an album
  static async reorder(albumId, mediaIds) {
    try {
      const trx = await transaction();

      try {
        for (let i = 0; i < mediaIds.length; i++) {
          await trx("media")
            .where("id", mediaIds[i])
            .where("album_id", albumId)
            .update({ sort_order: i });
        }

        await trx.commit();
        return await this.getByAlbum(albumId);
      } catch (error) {
        await trx.rollback();
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}

// Export named functions
export const addToAlbum = MediaService.addToAlbum.bind(MediaService);
export const addMultipleToAlbum =
  MediaService.addMultipleToAlbum.bind(MediaService);
export const getById = MediaService.getById.bind(MediaService);
export const getByAlbum = MediaService.getByAlbum.bind(MediaService);
export const update = MediaService.update.bind(MediaService);
export const reorder = MediaService.reorder.bind(MediaService);

// Export delete with alternative name to avoid keyword conflict
export const deleteMedia = MediaService.delete.bind(MediaService);
export { MediaService as delete };

export default MediaService;
