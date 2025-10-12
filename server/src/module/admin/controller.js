import db, { fn } from "../../db/knex.js";
import { error as logError, info as logInfo } from "../../utils/logger.js";

class AdminController {
  // Get dashboard statistics
  static async getStats(req, res) {
    try {
      const { days = 30 } = req.query; // 7, 30, or 90 days

      // Calculate date ranges
      const now = new Date();
      const currentPeriodStart = new Date(now);
      currentPeriodStart.setDate(currentPeriodStart.getDate() - parseInt(days));

      const previousPeriodStart = new Date(currentPeriodStart);
      previousPeriodStart.setDate(
        previousPeriodStart.getDate() - parseInt(days)
      );

      // ========== OVERVIEW STATS ==========

      // Albums stats
      const [totalAlbums] = await db("albums").count("* as count");
      const [publishedAlbums] = await db("albums")
        .where("status", "published")
        .count("* as count");

      // Current period albums
      const [currentAlbums] = await db("albums")
        .where("created_at", ">=", currentPeriodStart)
        .count("* as count");

      // Previous period albums
      const [previousAlbums] = await db("albums")
        .where("created_at", ">=", previousPeriodStart)
        .where("created_at", "<", currentPeriodStart)
        .count("* as count");

      // Reviews stats
      const [totalReviews] = await db("reviews").count("* as count");
      const [publishedReviews] = await db("reviews")
        .where("status", "published")
        .count("* as count");

      // Average rating
      const [{ avg_rating }] = await db("reviews")
        .where("status", "published")
        .avg("rating as avg_rating");

      // Current period reviews
      const [currentReviews] = await db("reviews")
        .where("created_at", ">=", currentPeriodStart)
        .count("* as count");

      // Previous period reviews
      const [previousReviews] = await db("reviews")
        .where("created_at", ">=", previousPeriodStart)
        .where("created_at", "<", currentPeriodStart)
        .count("* as count");

      // Inquiries stats
      const [totalInquiries] = await db("inquiries").count("* as count");
      const [newInquiries] = await db("inquiries")
        .where("status", "new")
        .count("* as count");

      // Current period inquiries
      const [currentInquiries] = await db("inquiries")
        .where("created_at", ">=", currentPeriodStart)
        .count("* as count");

      // Previous period inquiries
      const [previousInquiries] = await db("inquiries")
        .where("created_at", ">=", previousPeriodStart)
        .where("created_at", "<", currentPeriodStart)
        .count("* as count");

      // Views stats (sum of all album views)
      const [{ total_views }] = await db("albums").sum(
        "view_count as total_views"
      );

      // Media stats
      const [totalMedia] = await db("media").count("* as count");

      // ========== TRENDS CALCULATION ==========

      const calculateTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return (((current - previous) / previous) * 100).toFixed(1);
      };

      const trends = {
        albumsChange: parseFloat(
          calculateTrend(
            parseInt(currentAlbums.count),
            parseInt(previousAlbums.count)
          )
        ),
        reviewsChange: parseFloat(
          calculateTrend(
            parseInt(currentReviews.count),
            parseInt(previousReviews.count)
          )
        ),
        inquiriesChange: parseFloat(
          calculateTrend(
            parseInt(currentInquiries.count),
            parseInt(previousInquiries.count)
          )
        ),
        viewsChange: 23.5, // يمكن حسابه إذا كان لديك جدول تتبع المشاهدات
      };

      // ========== MONTHLY DATA (Last 6 months) ==========

      const monthlyData = await db.raw(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          MONTH(created_at) as month_num,
          COUNT(DISTINCT CASE WHEN table_name = 'albums' THEN id END) as albums,
          COUNT(DISTINCT CASE WHEN table_name = 'reviews' THEN id END) as reviews,
          COUNT(DISTINCT CASE WHEN table_name = 'inquiries' THEN id END) as inquiries,
          SUM(CASE WHEN table_name = 'albums' THEN view_count ELSE 0 END) as views
        FROM (
          SELECT id, created_at, 'albums' as table_name, view_count 
          FROM albums 
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          
          UNION ALL
          
          SELECT id, created_at, 'reviews' as table_name, 0 as view_count 
          FROM reviews 
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          
          UNION ALL
          
          SELECT id, created_at, 'inquiries' as table_name, 0 as view_count 
          FROM inquiries 
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        ) combined
        GROUP BY month, month_num
        ORDER BY month ASC
      `);

      // تحويل أسماء الأشهر للعربية
      const arabicMonths = [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ];

      const formattedMonthlyData = monthlyData[0].map((row) => ({
        month: arabicMonths[row.month_num - 1],
        albums: parseInt(row.albums) || 0,
        reviews: parseInt(row.reviews) || 0,
        inquiries: parseInt(row.inquiries) || 0,
        views: parseInt(row.views) || 0,
      }));

      // ========== CATEGORY DISTRIBUTION ==========

      const categoryDist = await db("albums")
        .select("category")
        .count("* as count")
        .where("status", "published")
        .groupBy("category");

      const totalPublished = parseInt(publishedAlbums.count);
      const categoryDistribution = categoryDist.map((cat) => ({
        name: cat.category === "macrame" ? "مكرمية" : "براويز",
        value: parseInt(cat.count),
        percentage:
          totalPublished > 0
            ? Math.round((parseInt(cat.count) / totalPublished) * 100)
            : 0,
      }));

      // ========== RATING DISTRIBUTION ==========

      const ratingDist = await db("reviews")
        .select("rating")
        .count("* as count")
        .where("status", "published")
        .groupBy("rating")
        .orderBy("rating", "desc");

      const totalPublishedReviews = parseInt(publishedReviews.count);
      const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
        const found = ratingDist.find((r) => r.rating === rating);
        const count = found ? parseInt(found.count) : 0;
        return {
          rating: `${rating}⭐`,
          count,
          percentage:
            totalPublishedReviews > 0
              ? Math.round((count / totalPublishedReviews) * 100)
              : 0,
        };
      });

      // ========== RECENT ACTIVITY ==========

      const recentActivity = await db.raw(`
        SELECT 
          'review' as type,
          CONCAT('تقييم جديد من ', author_name) as text,
          created_at,
          CASE 
            WHEN TIMESTAMPDIFF(MINUTE, created_at, NOW()) < 60 
              THEN CONCAT('منذ ', TIMESTAMPDIFF(MINUTE, created_at, NOW()), ' دقيقة')
            WHEN TIMESTAMPDIFF(HOUR, created_at, NOW()) < 24 
              THEN CONCAT('منذ ', TIMESTAMPDIFF(HOUR, created_at, NOW()), ' ساعة')
            ELSE CONCAT('منذ ', TIMESTAMPDIFF(DAY, created_at, NOW()), ' يوم')
          END as time
        FROM reviews
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        
        UNION ALL
        
        SELECT 
          'inquiry' as type,
          CONCAT('استعلام جديد من ', full_name) as text,
          created_at,
          CASE 
            WHEN TIMESTAMPDIFF(MINUTE, created_at, NOW()) < 60 
              THEN CONCAT('منذ ', TIMESTAMPDIFF(MINUTE, created_at, NOW()), ' دقيقة')
            WHEN TIMESTAMPDIFF(HOUR, created_at, NOW()) < 24 
              THEN CONCAT('منذ ', TIMESTAMPDIFF(HOUR, created_at, NOW()), ' ساعة')
            ELSE CONCAT('منذ ', TIMESTAMPDIFF(DAY, created_at, NOW()), ' يوم')
          END as time
        FROM inquiries
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        
        UNION ALL
        
        SELECT 
          'album' as type,
          CONCAT('تم نشر ألبوم "', title, '"') as text,
          created_at,
          CASE 
            WHEN TIMESTAMPDIFF(MINUTE, created_at, NOW()) < 60 
              THEN CONCAT('منذ ', TIMESTAMPDIFF(MINUTE, created_at, NOW()), ' دقيقة')
            WHEN TIMESTAMPDIFF(HOUR, created_at, NOW()) < 24 
              THEN CONCAT('منذ ', TIMESTAMPDIFF(HOUR, created_at, NOW()), ' ساعة')
            ELSE CONCAT('منذ ', TIMESTAMPDIFF(DAY, created_at, NOW()), ' يوم')
          END as time
        FROM albums
        WHERE status = 'published' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        
        ORDER BY created_at DESC
        LIMIT 5
      `);

      // ========== TOP ALBUMS ==========

      const topAlbums = await db("albums")
        .leftJoin("reviews", "albums.id", "reviews.linked_album_id")
        .select("albums.id", "albums.title", "albums.view_count as views")
        .avg("reviews.rating as rating")
        .where("albums.status", "published")
        .groupBy("albums.id", "albums.title", "albums.view_count")
        .orderBy("albums.view_count", "desc")
        .limit(3);

      const formattedTopAlbums = topAlbums.map((album) => ({
        title: album.title,
        views: parseInt(album.views) || 0,
        rating: parseFloat(album.rating)?.toFixed(1) || 0,
      }));

      // ========== FINAL RESPONSE ==========

      const stats = {
        overview: {
          totalAlbums: parseInt(totalAlbums.count),
          publishedAlbums: parseInt(publishedAlbums.count),
          totalReviews: parseInt(totalReviews.count),
          publishedReviews: parseInt(publishedReviews.count),
          totalInquiries: parseInt(totalInquiries.count),
          newInquiries: parseInt(newInquiries.count),
          totalViews: parseInt(total_views) || 0,
          averageRating: parseFloat(avg_rating).toFixed(1) || 0,
          totalMedia: parseInt(totalMedia.count),
        },
        trends,
        monthlyData: formattedMonthlyData,
        categoryDistribution,
        ratingDistribution,
        recentActivity: recentActivity[0] || [],
        topAlbums: formattedTopAlbums,
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logError("Get admin stats failed", { error: error.message });
      console.error("Detailed error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
        error: error.message,
      });
    }
  }

  // Get detailed analytics
  static async getAnalytics(req, res) {
    try {
      const { period = "month" } = req.query; // month, quarter, year

      let dateFormat;
      let intervalClause;

      switch (period) {
        case "year":
          dateFormat = "%Y";
          intervalClause = "12 MONTH";
          break;
        case "quarter":
          dateFormat = "%Y-Q%q";
          intervalClause = "3 MONTH";
          break;
        default:
          dateFormat = "%Y-%m";
          intervalClause = "6 MONTH";
      }

      // Albums analytics
      const albumsAnalytics = await db.raw(`
        SELECT 
          DATE_FORMAT(created_at, '${dateFormat}') as period,
          COUNT(*) as total,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
          SUM(view_count) as total_views,
          AVG(view_count) as avg_views
        FROM albums 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${intervalClause})
        GROUP BY DATE_FORMAT(created_at, '${dateFormat}')
        ORDER BY period ASC
      `);

      // Inquiries analytics
      const inquiriesAnalytics = await db.raw(`
        SELECT 
          DATE_FORMAT(created_at, '${dateFormat}') as period,
          COUNT(*) as total,
          SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as completed,
          product_type,
          COUNT(*) as count
        FROM inquiries
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${intervalClause})
        GROUP BY DATE_FORMAT(created_at, '${dateFormat}'), product_type
        ORDER BY period ASC
      `);

      // Reviews analytics
      const reviewsAnalytics = await db.raw(`
        SELECT 
          DATE_FORMAT(created_at, '${dateFormat}') as period,
          COUNT(*) as total,
          AVG(rating) as avg_rating,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published
        FROM reviews
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${intervalClause})
        GROUP BY DATE_FORMAT(created_at, '${dateFormat}')
        ORDER BY period ASC
      `);

      // Top performing albums
      const topAlbums = await db("albums")
        .select("id", "title", "category", "view_count", "status")
        .orderBy("view_count", "desc")
        .limit(10);

      res.json({
        success: true,
        data: {
          period,
          albums: albumsAnalytics[0] || [],
          inquiries: inquiriesAnalytics[0] || [],
          reviews: reviewsAnalytics[0] || [],
          topAlbums,
        },
      });
    } catch (error) {
      logError("Get analytics failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch analytics",
      });
    }
  }

  // Get system health
  static async getSystemHealth(req, res) {
    try {
      const dbStatus = await db.raw("SELECT 1");

      const [dbSize] = await db.raw(`
        SELECT 
          SUM(data_length + index_length) / 1024 / 1024 AS size_mb
        FROM information_schema.TABLES
        WHERE table_schema = DATABASE()
      `);

      const tables = await Promise.all([
        db("albums").count("* as count"),
        db("reviews").count("* as count"),
        db("inquiries").count("* as count"),
        db("media").count("* as count"),
      ]);

      res.json({
        success: true,
        data: {
          status: "healthy",
          database: {
            connected: !!dbStatus,
            size_mb: parseFloat(dbSize[0].size_mb).toFixed(2),
          },
          tables: {
            albums: parseInt(tables[0][0].count),
            reviews: parseInt(tables[1][0].count),
            inquiries: parseInt(tables[2][0].count),
            media: parseInt(tables[3][0].count),
          },
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      logError("Get system health failed", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch system health",
        error: error.message,
      });
    }
  }
}

// Export functions
export const getStats = AdminController.getStats;
export const getAnalytics = AdminController.getAnalytics;
export const getSystemHealth = AdminController.getSystemHealth;

export default AdminController;
