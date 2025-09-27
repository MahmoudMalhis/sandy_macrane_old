// server/src/module/reviews/service.js - مُحدثة مع دعم البحث والفلترة
import db, { fn } from "../../db/knex.js";

class ReviewsService {
  // Create new review
  static async create(reviewData) {
    try {
      const {
        author_name,
        rating,
        text,
        attached_image = null,
        linked_album_id = null,
      } = reviewData;

      const [reviewId] = await db("reviews").insert({
        author_name,
        rating,
        text,
        attached_image,
        linked_album_id,
        status: "pending", // Always pending for manual approval
        created_at: fn.now(),
      });

      return await this.getById(reviewId);
    } catch (error) {
      throw error;
    }
  }

  // Get all reviews (with advanced filters)
  static async getAll(filters = {}) {
    try {
      const {
        status = "published",
        linked_album_id,
        search,
        author_name,
        min_rating,
        max_rating,
        exact_rating,
        date_from,
        date_to,
        has_image,
        has_album,
        sort_by = "created_at",
        sort_order = "desc",
        page = 1,
        limit = 12,
        includeAlbumInfo = true,
      } = filters;

      let query = db("reviews");

      if (includeAlbumInfo) {
        query = query
          .select(
            "reviews.*",
            "albums.title as album_title",
            "albums.slug as album_slug",
            "albums.category as album_category",
            "albums.cover_image as album_cover"
          )
          .leftJoin("albums", "reviews.linked_album_id", "albums.id");
      }

      // Apply status filter
      if (status && status !== "all") {
        if (Array.isArray(status)) {
          query = query.whereIn("reviews.status", status);
        } else {
          query = query.where("reviews.status", status);
        }
      }

      // Apply album filter
      if (linked_album_id) {
        query = query.where("reviews.linked_album_id", linked_album_id);
      }

      // Apply search filter
      if (search && search.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.where(function () {
          this.where("reviews.author_name", "like", searchTerm).orWhere(
            "reviews.text",
            "like",
            searchTerm
          );

          if (includeAlbumInfo) {
            this.orWhere("albums.title", "like", searchTerm);
          }
        });
      }

      // Apply author name filter
      if (author_name && author_name.trim()) {
        query = query.where(
          "reviews.author_name",
          "like",
          `%${author_name.trim()}%`
        );
      }

      // Apply rating filters
      if (exact_rating) {
        query = query.where("reviews.rating", exact_rating);
      } else {
        if (min_rating) {
          query = query.where("reviews.rating", ">=", min_rating);
        }
        if (max_rating) {
          query = query.where("reviews.rating", "<=", max_rating);
        }
      }

      // Apply date filters
      if (date_from) {
        query = query.where("reviews.created_at", ">=", date_from);
      }
      if (date_to) {
        query = query.where("reviews.created_at", "<=", date_to + " 23:59:59");
      }

      // Apply image filter
      if (has_image !== undefined) {
        if (has_image) {
          query = query.whereNotNull("reviews.attached_image");
        } else {
          query = query.whereNull("reviews.attached_image");
        }
      }

      // Apply album association filter
      if (has_album !== undefined) {
        if (has_album) {
          query = query.whereNotNull("reviews.linked_album_id");
        } else {
          query = query.whereNull("reviews.linked_album_id");
        }
      }

      // Apply sorting
      const validSortFields = {
        created_at: "reviews.created_at",
        rating: "reviews.rating",
        author_name: "reviews.author_name",
        status: "reviews.status",
        album_title: "albums.title",
      };

      const sortField = validSortFields[sort_by] || "reviews.created_at";
      const sortDirection = sort_order === "asc" ? "asc" : "desc";

      query = query.orderBy(sortField, sortDirection);

      // Add secondary sorting for consistency
      if (sort_by !== "created_at") {
        query = query.orderBy("reviews.created_at", "desc");
      }

      // Clone query for counting
      const countQuery = query.clone();

      // Apply pagination
      const offset = (page - 1) * limit;
      const reviews = await query.limit(limit).offset(offset);

      // Get total count
      const totalResult = await countQuery
        .clearSelect()
        .clearOrder()
        .count("reviews.id as count")
        .first();

      const total = parseInt(totalResult.count);

      return {
        reviews,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get review by ID with full details
  static async getById(id) {
    try {
      const review = await db("reviews")
        .select(
          "reviews.*",
          "albums.title as album_title",
          "albums.slug as album_slug",
          "albums.category as album_category",
          "albums.cover_image as album_cover"
        )
        .leftJoin("albums", "reviews.linked_album_id", "albums.id")
        .where("reviews.id", id)
        .first();

      if (!review) {
        throw new Error("Review not found");
      }

      return review;
    } catch (error) {
      throw error;
    }
  }

  // Update review
  static async update(id, updateData) {
    try {
      await this.getById(id); // Check if exists

      const {
        author_name,
        rating,
        text,
        attached_image,
        linked_album_id,
        status,
      } = updateData;

      let updates = {};

      if (author_name !== undefined) updates.author_name = author_name;
      if (rating !== undefined) updates.rating = rating;
      if (text !== undefined) updates.text = text;
      if (attached_image !== undefined) updates.attached_image = attached_image;
      if (linked_album_id !== undefined)
        updates.linked_album_id = linked_album_id;
      if (status !== undefined) updates.status = status;

      if (Object.keys(updates).length > 0) {
        await db("reviews").where("id", id).update(updates);
      }

      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete review
  static async delete(id) {
    try {
      const review = await this.getById(id);

      await db("reviews").where("id", id).del();

      return review;
    } catch (error) {
      throw error;
    }
  }

  // Change review status (publish/hide/pending)
  static async changeStatus(id, status) {
    try {
      return await this.update(id, { status });
    } catch (error) {
      throw error;
    }
  }

  // Get featured reviews for homepage
  static async getFeatured(limit = 3) {
    try {
      const reviews = await db("reviews")
        .select(
          "reviews.*",
          "albums.title as album_title",
          "albums.slug as album_slug",
          "albums.category as album_category"
        )
        .leftJoin("albums", "reviews.linked_album_id", "albums.id")
        .where("reviews.status", "published")
        .where("reviews.rating", ">=", 4) // Only high ratings for featured
        .orderBy("reviews.created_at", "desc")
        .limit(limit);

      return reviews;
    } catch (error) {
      throw error;
    }
  }

  // Get comprehensive reviews statistics
  static async getStats(dateRange = null) {
    try {
      let baseQuery = db("reviews");

      // Apply date range if provided
      if (dateRange && dateRange.from) {
        baseQuery = baseQuery.where("created_at", ">=", dateRange.from);
      }
      if (dateRange && dateRange.to) {
        baseQuery = baseQuery.where(
          "created_at",
          "<=",
          dateRange.to + " 23:59:59"
        );
      }

      // Basic counts
      const [totalReviews] = await baseQuery.clone().count("* as count");
      const [publishedReviews] = await baseQuery
        .clone()
        .where("status", "published")
        .count("* as count");
      const [pendingReviews] = await baseQuery
        .clone()
        .where("status", "pending")
        .count("* as count");
      const [hiddenReviews] = await baseQuery
        .clone()
        .where("status", "hidden")
        .count("* as count");

      // Average rating
      const [{ avg_rating }] = await baseQuery
        .clone()
        .where("status", "published")
        .avg("rating as avg_rating");

      // Reviews with images
      const [reviewsWithImages] = await baseQuery
        .clone()
        .whereNotNull("attached_image")
        .count("* as count");

      // Reviews linked to albums
      const [reviewsWithAlbums] = await baseQuery
        .clone()
        .whereNotNull("linked_album_id")
        .count("* as count");

      // Ratings distribution
      const ratingsDistribution = await baseQuery
        .clone()
        .select("rating")
        .count("* as count")
        .where("status", "published")
        .groupBy("rating")
        .orderBy("rating", "desc");

      const ratingsMap = {};
      ratingsDistribution.forEach((item) => {
        ratingsMap[item.rating] = parseInt(item.count);
      });

      // Ensure all ratings (1-5) are present
      for (let i = 1; i <= 5; i++) {
        if (!ratingsMap[i]) ratingsMap[i] = 0;
      }

      // Monthly stats (last 12 months)
      const monthlyStats = await db("reviews")
        .select(
          db.raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
          db.raw("COUNT(*) as total"),
          db.raw(
            "SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published"
          ),
          db.raw(
            "AVG(CASE WHEN status = 'published' THEN rating ELSE NULL END) as avg_rating"
          )
        )
        .where("created_at", ">=", db.raw("DATE_SUB(NOW(), INTERVAL 12 MONTH)"))
        .groupBy(db.raw("DATE_FORMAT(created_at, '%Y-%m')"))
        .orderBy("month", "asc");

      return {
        total: parseInt(totalReviews.count),
        published: parseInt(publishedReviews.count),
        pending: parseInt(pendingReviews.count),
        hidden: parseInt(hiddenReviews.count),
        withImages: parseInt(reviewsWithImages.count),
        withAlbums: parseInt(reviewsWithAlbums.count),
        averageRating: parseFloat(avg_rating) || 0,
        ratingsDistribution: ratingsMap,
        monthlyStats,
        // Calculated percentages
        publishedPercentage:
          totalReviews.count > 0
            ? Math.round(
                (parseInt(publishedReviews.count) /
                  parseInt(totalReviews.count)) *
                  100
              )
            : 0,
        imagesPercentage:
          totalReviews.count > 0
            ? Math.round(
                (parseInt(reviewsWithImages.count) /
                  parseInt(totalReviews.count)) *
                  100
              )
            : 0,
        albumsPercentage:
          totalReviews.count > 0
            ? Math.round(
                (parseInt(reviewsWithAlbums.count) /
                  parseInt(totalReviews.count)) *
                  100
              )
            : 0,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get reviews for specific album
  static async getByAlbum(albumId, status = "published") {
    try {
      return await db("reviews")
        .where("linked_album_id", albumId)
        .where("status", status)
        .orderBy("created_at", "desc");
    } catch (error) {
      throw error;
    }
  }

  // Bulk operations
  static async updateMultiple(ids, updateData) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid IDs array");
      }

      const updates = {};
      if (updateData.status !== undefined) updates.status = updateData.status;
      if (updateData.linked_album_id !== undefined)
        updates.linked_album_id = updateData.linked_album_id;

      if (Object.keys(updates).length === 0) {
        throw new Error("No valid update fields provided");
      }

      const result = await db("reviews").whereIn("id", ids).update(updates);

      return { updated: result };
    } catch (error) {
      throw error;
    }
  }

  static async deleteMultiple(ids) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid IDs array");
      }

      const result = await db("reviews").whereIn("id", ids).del();

      return { deleted: result };
    } catch (error) {
      throw error;
    }
  }

  // Advanced search with complex filters
  static async advancedSearch(searchParams) {
    try {
      return await this.getAll(searchParams);
    } catch (error) {
      throw error;
    }
  }

  // Get similar reviews (basic implementation)
  static async getSimilar(reviewId, limit = 5) {
    try {
      const review = await this.getById(reviewId);

      let query = db("reviews")
        .select(
          "reviews.*",
          "albums.title as album_title",
          "albums.slug as album_slug"
        )
        .leftJoin("albums", "reviews.linked_album_id", "albums.id")
        .where("reviews.id", "!=", reviewId)
        .where("reviews.status", "published");

      // Find similar by rating
      query = query.where("reviews.rating", review.rating);

      // If linked to album, prioritize same album or category
      if (review.linked_album_id) {
        query = query.where(function () {
          this.where("reviews.linked_album_id", review.linked_album_id).orWhere(
            "albums.category",
            review.album_category
          );
        });
      }

      const similar = await query
        .orderBy("reviews.created_at", "desc")
        .limit(limit);

      return similar;
    } catch (error) {
      throw error;
    }
  }

  // Link review to album
  static async linkToAlbum(reviewId, albumId) {
    try {
      // Verify album exists
      const album = await db("albums").where("id", albumId).first();
      if (!album) {
        throw new Error("Album not found");
      }

      return await this.update(reviewId, { linked_album_id: albumId });
    } catch (error) {
      throw error;
    }
  }

  // Unlink review from album
  static async unlinkFromAlbum(reviewId) {
    try {
      return await this.update(reviewId, { linked_album_id: null });
    } catch (error) {
      throw error;
    }
  }

  // Get trending reviews (high rating, recent, popular)
  static async getTrending(limit = 10) {
    try {
      const reviews = await db("reviews")
        .select(
          "reviews.*",
          "albums.title as album_title",
          "albums.slug as album_slug"
        )
        .leftJoin("albums", "reviews.linked_album_id", "albums.id")
        .where("reviews.status", "published")
        .where("reviews.rating", ">=", 4)
        .where(
          "reviews.created_at",
          ">=",
          db.raw("DATE_SUB(NOW(), INTERVAL 30 DAY)")
        )
        .orderBy([
          { column: "reviews.rating", order: "desc" },
          { column: "reviews.created_at", order: "desc" },
        ])
        .limit(limit);

      return reviews;
    } catch (error) {
      throw error;
    }
  }
}

// Export named functions
export const create = ReviewsService.create.bind(ReviewsService);
export const getAll = ReviewsService.getAll.bind(ReviewsService);
export const getById = ReviewsService.getById.bind(ReviewsService);
export const update = ReviewsService.update.bind(ReviewsService);
export const changeStatus = ReviewsService.changeStatus.bind(ReviewsService);
export const getFeatured = ReviewsService.getFeatured.bind(ReviewsService);
export const getStats = ReviewsService.getStats.bind(ReviewsService);
export const getByAlbum = ReviewsService.getByAlbum.bind(ReviewsService);
export const updateMultiple =
  ReviewsService.updateMultiple.bind(ReviewsService);
export const deleteMultiple =
  ReviewsService.deleteMultiple.bind(ReviewsService);
export const advancedSearch =
  ReviewsService.advancedSearch.bind(ReviewsService);
export const getSimilar = ReviewsService.getSimilar.bind(ReviewsService);
export const linkToAlbum = ReviewsService.linkToAlbum.bind(ReviewsService);
export const unlinkFromAlbum =
  ReviewsService.unlinkFromAlbum.bind(ReviewsService);
export const getTrending = ReviewsService.getTrending.bind(ReviewsService);

// Export delete with alternative name
export const deleteReview = ReviewsService.delete.bind(ReviewsService);
export { ReviewsService as delete };

export default ReviewsService;
