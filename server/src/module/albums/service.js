import db, { fn } from "../../db/knex.js";

class AlbumsService {
  // Generate slug from title
  // Generate slug from title with Arabic support
  static generateSlug(title) {
    if (!title || title.trim() === "") {
      return `album-${Date.now()}`;
    }

    // خريطة تحويل للأحرف العربية الشائعة
    const arabicToLatin = {
      ا: "a",
      أ: "a",
      إ: "a",
      آ: "aa",
      ب: "b",
      ت: "t",
      ث: "th",
      ج: "j",
      ح: "h",
      خ: "kh",
      د: "d",
      ذ: "dh",
      ر: "r",
      ز: "z",
      س: "s",
      ش: "sh",
      ص: "s",
      ض: "d",
      ط: "t",
      ظ: "z",
      ع: "a",
      غ: "gh",
      ف: "f",
      ق: "q",
      ك: "k",
      ل: "l",
      م: "m",
      ن: "n",
      ه: "h",
      و: "w",
      ي: "y",
      ى: "a",
      ة: "h",
      ئ: "e",
      ء: "a",
    };

    let transliterated = title
      .trim()
      .toLowerCase()
      .split("")
      .map((char) => arabicToLatin[char] || char)
      .join("");

    let slug = transliterated
      .replace(/[^\w\s-]/g, "") // إزالة الأحرف الخاصة
      .replace(/\s+/g, "-") // استبدال المسافات بشرطات
      .replace(/-+/g, "-") // إزالة الشرطات المتكررة
      .replace(/^-|-$/g, ""); // إزالة الشرطات من البداية والنهاية

    return slug || `album-${Date.now()}`;
  }

  // Get all albums (with filters for public)
  static async getAll(filters = {}) {
    try {
      const {
        category,
        status,
        search,
        sort = "created_at",
        page = 1,
        limit = 12,
        includeMedia = true,
      } = filters;

      let query = db("albums");

      // Apply filters
      if (category && category !== "all") {
        query = query.where("category", category);
      }

      if (status) {
        query = query.where("status", status);
      }

      if (search) {
        query = query.where(function () {
          this.where("title", "like", `%${search}%`).orWhere(
            "description",
            "like",
            `%${search}%`
          );
        });
      }

      // Sorting
      const sortOptions = {
        created_at: "created_at desc",
        title: "title asc",
        view_count: "view_count desc",
      };

      query = query.orderByRaw(sortOptions[sort] || "created_at desc");

      // Pagination
      const offset = (page - 1) * limit;
      const albums = await query.limit(limit).offset(offset);

      // Get total count
      const totalQuery = db("albums");
      if (category && category !== "all") {
        totalQuery.where("category", category);
      }
      if (status) {
        totalQuery.where("status", status);
      }
      if (search) {
        totalQuery.where(function () {
          this.where("title", "like", `%${search}%`).orWhere(
            "description",
            "like",
            `%${search}%`
          );
        });
      }

      const [{ count }] = await totalQuery.count("* as count");

      // Include media if requested
      if (includeMedia && albums.length > 0) {
        for (let album of albums) {
          album.media = await this.getAlbumMedia(album.id);
        }
      }

      return {
        albums,
        pagination: {
          total: parseInt(count),
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get album by slug
  static async getBySlug(slug, includeMedia = true) {
    try {
      const album = await db("albums").where("slug", slug).first();

      if (!album) {
        throw new Error("Album not found");
      }

      // Increment view count
      await db("albums").where("id", album.id).increment("view_count", 1);

      album.view_count += 1;

      if (includeMedia) {
        album.media = await this.getAlbumMedia(album.id);
      }

      return album;
    } catch (error) {
      throw error;
    }
  }

  // Get album by ID
  static async getById(id, includeMedia = true) {
    try {
      const album = await db("albums").where("id", id).first();

      if (!album) {
        throw new Error("Album not found");
      }

      if (includeMedia) {
        album.media = await this.getAlbumMedia(album.id);
      }

      return album;
    } catch (error) {
      throw error;
    }
  }

  // Get album media
  static async getAlbumMedia(albumId) {
    return await db("media")
      .where("album_id", albumId)
      .orderBy("sort_order", "asc")
      .orderBy("id", "asc");
  }

  // Create new album
  static async create(albumData) {
    try {
      const {
        title,
        category,
        description,
        maker_note,
        tags,
        status = "draft",
      } = albumData;

      let slug = this.generateSlug(title);

      // Ensure slug is unique
      let slugExists = await db("albums").where("slug", slug).first();
      let counter = 1;

      while (slugExists) {
        slug = `${this.generateSlug(title)}-${counter}`;
        slugExists = await db("albums").where("slug", slug).first();
        counter++;
      }

      const [albumId] = await db("albums").insert({
        title,
        slug,
        category,
        description,
        maker_note,
        tags: tags ? JSON.stringify(tags) : null,
        status,
        created_at: fn.now(),
        updated_at: fn.now(),
      });

      return await this.getById(albumId, false);
    } catch (error) {
      throw error;
    }
  }

  // Update album
  static async update(id, albumData) {
    try {
      const album = await this.getById(id, false);

      const { title, category, description, maker_note, tags, status } =
        albumData;

      let updateData = {
        updated_at: fn.now(),
      };

      if (title !== undefined) {
        updateData.title = title;

        // Regenerate slug if title changed
        if (title !== album.title) {
          let slug = this.generateSlug(title);

          // Ensure slug is unique
          let slugExists = await db("albums")
            .where("slug", slug)
            .where("id", "!=", id)
            .first();
          let counter = 1;

          while (slugExists) {
            slug = `${this.generateSlug(title)}-${counter}`;
            slugExists = await db("albums")
              .where("slug", slug)
              .where("id", "!=", id)
              .first();
            counter++;
          }

          updateData.slug = slug;
        }
      }

      if (category !== undefined) updateData.category = category;
      if (description !== undefined) updateData.description = description;
      if (maker_note !== undefined) updateData.maker_note = maker_note;
      if (tags !== undefined)
        updateData.tags = tags ? JSON.stringify(tags) : null;
      if (status !== undefined) updateData.status = status;

      await db("albums").where("id", id).update(updateData);

      return await this.getById(id, false);
    } catch (error) {
      throw error;
    }
  }

  // Delete album
  static async delete(id) {
    try {
      const album = await this.getById(id, false);

      // Delete associated media (CASCADE should handle this, but let's be explicit)
      await db("media").where("album_id", id).del();

      // Delete album
      await db("albums").where("id", id).del();

      return album;
    } catch (error) {
      throw error;
    }
  }

  // Set cover image
  static async setCoverImage(id, imageUrl) {
    try {
      await db("albums").where("id", id).update({
        cover_image: imageUrl,
        updated_at: fn.now(),
      });

      return await this.getById(id, false);
    } catch (error) {
      throw error;
    }
  }

  // Get featured albums for homepage
  static async getFeatured(limit = 6) {
    try {
      const albums = await db("albums")
        .where("status", "published")
        .orderBy("view_count", "desc")
        .orderBy("created_at", "desc")
        .limit(limit);

      // Include cover media
      for (let album of albums) {
        const coverMedia = await db("media")
          .where("album_id", album.id)
          .where("is_cover", true)
          .first();

        if (coverMedia) {
          album.cover_media = coverMedia;
        } else {
          // Get first media as fallback
          const firstMedia = await db("media")
            .where("album_id", album.id)
            .orderBy("sort_order", "asc")
            .first();
          album.cover_media = firstMedia;
        }
      }

      return albums;
    } catch (error) {
      throw error;
    }
  }

  // Get albums statistics
  static async getStats() {
    try {
      const [totalAlbums] = await db("albums").count("* as count");
      const [publishedAlbums] = await db("albums")
        .where("status", "published")
        .count("* as count");
      const [macrameAlbums] = await db("albums")
        .where("category", "macrame")
        .where("status", "published")
        .count("* as count");
      const [frameAlbums] = await db("albums")
        .where("category", "frame")
        .where("status", "published")
        .count("* as count");

      return {
        total: parseInt(totalAlbums.count),
        published: parseInt(publishedAlbums.count),
        macrame: parseInt(macrameAlbums.count),
        frames: parseInt(frameAlbums.count),
      };
    } catch (error) {
      throw error;
    }
  }
}

// Export named functions instead of class
export const getAll = AlbumsService.getAll.bind(AlbumsService);
export const getBySlug = AlbumsService.getBySlug.bind(AlbumsService);
export const getById = AlbumsService.getById.bind(AlbumsService);
export const create = AlbumsService.create.bind(AlbumsService);
export const update = AlbumsService.update.bind(AlbumsService);
export const getFeatured = AlbumsService.getFeatured.bind(AlbumsService);
export const getStats = AlbumsService.getStats.bind(AlbumsService);
export { AlbumsService as delete };

// Export delete function separately to avoid naming conflict
export const deleteAlbum = AlbumsService.delete.bind(AlbumsService);

export default AlbumsService;
