// server/src/module/admin/controller.js
import db from "../../db/knex.js";

class AdminController {
  // GET /api/admin/stats?days=30
  static async getStats(req, res) {
    try {
      const { days = 30 } = req.query;
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));

      // إحصائيات الألبومات
      const [totalAlbums] = await db('albums').count('* as count');
      const [publishedAlbums] = await db('albums')
        .where('status', 'published')
        .count('* as count');
      
      // الألبومات في الفترة المحددة
      const [albumsInPeriod] = await db('albums')
        .where('created_at', '>=', daysAgo.toISOString())
        .count('* as count');
      
      // الألبومات في الفترة السابقة للمقارنة
      const previousPeriodStart = new Date(daysAgo);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(days));
      const [albumsInPreviousPeriod] = await db('albums')
        .where('created_at', '>=', previousPeriodStart.toISOString())
        .where('created_at', '<', daysAgo.toISOString())
        .count('* as count');

      // إحصائيات التقييمات
      const [totalReviews] = await db('reviews').count('* as count');
      const [pendingReviews] = await db('reviews')
        .where('status', 'pending')
        .count('* as count');
      const [avgRating] = await db('reviews')
        .where('status', 'published')
        .avg('rating as avg');
      
      const [reviewsInPeriod] = await db('reviews')
        .where('created_at', '>=', daysAgo.toISOString())
        .count('* as count');
      
      const [reviewsInPreviousPeriod] = await db('reviews')
        .where('created_at', '>=', previousPeriodStart.toISOString())
        .where('created_at', '<', daysAgo.toISOString())
        .count('* as count');

      // إحصائيات الاستعلامات
      const [totalInquiries] = await db('inquiries').count('* as count');
      const [newInquiries] = await db('inquiries')
        .where('created_at', '>=', daysAgo.toISOString())
        .count('* as count');
      
      const [inquiriesInPreviousPeriod] = await db('inquiries')
        .where('created_at', '>=', previousPeriodStart.toISOString())
        .where('created_at', '<', daysAgo.toISOString())
        .count('* as count');

      // المشاهدات (من عمود view_count في albums)
      const [totalViews] = await db('albums').sum('view_count as total');
      const viewsTotal = totalViews.total || 0;

      // إحصائيات شهرية - آخر 6 أشهر
      const monthlyStats = await db.raw(`
        SELECT 
          DATE_FORMAT(created_at, '%b') as month,
          COUNT(CASE WHEN TABLE_NAME = 'albums' THEN 1 END) as albums,
          COUNT(CASE WHEN TABLE_NAME = 'reviews' THEN 1 END) as reviews,
          SUM(CASE WHEN TABLE_NAME = 'albums' THEN view_count ELSE 0 END) as views
        FROM (
          SELECT created_at, 'albums' as TABLE_NAME, view_count FROM albums WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          UNION ALL
          SELECT created_at, 'reviews' as TABLE_NAME, 0 as view_count FROM reviews WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        ) combined
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY DATE_FORMAT(created_at, '%Y-%m') ASC
      `);

      // توزيع الفئات
      const categoriesStats = await db('albums')
        .select('category as label')
        .count('* as count')
        .groupBy('category')
        .orderBy('count', 'desc');

      // توزيع التقييمات حسب النجوم
      const ratingDistribution = await db('reviews')
        .select('rating')
        .count('* as count')
        .where('status', 'published')
        .groupBy('rating')
        .orderBy('rating', 'desc');

      // حساب النسب المئوية للتغيير
      const albumsTrend = calculateTrend(albumsInPeriod.count, albumsInPreviousPeriod.count);
      const reviewsTrend = calculateTrend(reviewsInPeriod.count, reviewsInPreviousPeriod.count);
      const inquiriesTrend = calculateTrend(newInquiries.count, inquiriesInPreviousPeriod.count);

      console.log('[INFO] Admin stats fetched successfully');

      res.json({
        success: true,
        albums: {
          total: totalAlbums.count || 0,
          published: publishedAlbums.count || 0,
          trend: albumsTrend
        },
        reviews: {
          total: totalReviews.count || 0,
          pending: pendingReviews.count || 0,
          avgRating: avgRating?.avg ? parseFloat(avgRating.avg).toFixed(1) : 0,
          trend: reviewsTrend
        },
        inquiries: {
          total: totalInquiries.count || 0,
          new: newInquiries.count || 0,
          trend: inquiriesTrend
        },
        views: {
          total: viewsTotal,
          trend: 0 // يمكن حسابه إذا كان هناك سجل تاريخي
        },
        monthlyStats: (monthlyStats[0] || []).map(stat => ({
          month: stat.month,
          albums: parseInt(stat.albums) || 0,
          reviews: parseInt(stat.reviews) || 0,
          views: parseInt(stat.views) || 0
        })),
        categoriesStats: categoriesStats.map(cat => ({
          label: cat.label,
          count: parseInt(cat.count)
        })),
        ratingDistribution: ratingDistribution.map(rating => ({
          rating: rating.rating,
          count: parseInt(rating.count)
        }))
      });
    } catch (error) {
      console.error('[ERROR] Error fetching admin stats:', error.message);
      res.status(500).json({
        success: false,
        message: 'فشل في جلب الإحصائيات'
      });
    }
  }

  // GET /api/admin/notifications - الحصول على الإشعارات
  static async getNotifications(req, res) {
    try {
      const hasTable = await db.schema.hasTable('notifications');
      
      if (!hasTable) {
        return res.json({
          success: true,
          notifications: [],
          unreadCount: 0
        });
      }

      const notifications = await db('notifications')
        .where('user_id', req.user.id)
        .orderBy('created_at', 'desc')
        .limit(20);

      const [unreadCount] = await db('notifications')
        .where({ user_id: req.user.id, read: false })
        .count('* as count');

      res.json({
        success: true,
        notifications,
        unreadCount: unreadCount.count || 0
      });
    } catch (error) {
      console.error('[ERROR] Error fetching notifications:', error.message);
      res.status(500).json({
        success: false,
        message: 'فشل في جلب الإشعارات'
      });
    }
  }

  // PATCH /api/admin/notifications/:id/read
  static async markNotificationAsRead(req, res) {
    try {
      await db('notifications')
        .where({ id: req.params.id, user_id: req.user.id })
        .update({ 
          read: true, 
          updated_at: db.fn.now()
        });

      res.json({ success: true });
    } catch (error) {
      console.error('[ERROR] Error marking notification:', error.message);
      res.status(500).json({
        success: false,
        message: 'فشل في تحديث الإشعار'
      });
    }
  }

  // PATCH /api/admin/notifications/read-all
  static async markAllNotificationsAsRead(req, res) {
    try {
      await db('notifications')
        .where({ user_id: req.user.id, read: false })
        .update({ 
          read: true, 
          updated_at: db.fn.now()
        });

      res.json({ success: true });
    } catch (error) {
      console.error('[ERROR] Error marking all notifications:', error.message);
      res.status(500).json({
        success: false,
        message: 'فشل في تحديث الإشعارات'
      });
    }
  }

  // DELETE /api/admin/notifications/:id
  static async deleteNotification(req, res) {
    try {
      await db('notifications')
        .where({ id: req.params.id, user_id: req.user.id })
        .delete();

      res.json({ success: true });
    } catch (error) {
      console.error('[ERROR] Error deleting notification:', error.message);
      res.status(500).json({
        success: false,
        message: 'فشل في حذف الإشعار'
      });
    }
  }

  // GET /api/admin/activities
  static async getActivities(req, res) {
    try {
      const { page = 1, limit = 10, search = '', sortBy = 'created_at', sortDir = 'desc' } = req.query;
      const offset = (page - 1) * limit;

      const hasTable = await db.schema.hasTable('activities');
      
      if (!hasTable) {
        return res.json({
          success: true,
          data: [],
          totalPages: 0,
          currentPage: parseInt(page),
          total: 0
        });
      }

      let query = db('activities')
        .select('*')
        .orderBy(sortBy, sortDir)
        .limit(parseInt(limit))
        .offset(parseInt(offset));

      if (search) {
        query = query.where(function() {
          this.where('type', 'like', `%${search}%`)
            .orWhere('description', 'like', `%${search}%`)
            .orWhere('user', 'like', `%${search}%`);
        });
      }

      const activities = await query;
      const [{ count }] = await db('activities').count('* as count');
      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: activities,
        totalPages,
        currentPage: parseInt(page),
        total: count
      });
    } catch (error) {
      console.error('[ERROR] Error fetching activities:', error.message);
      res.status(500).json({
        success: false,
        message: 'فشل في جلب النشاطات'
      });
    }
  }

  // GET /api/admin/export/:type
  static async exportData(req, res) {
    try {
      const { type } = req.params;
      const { format = 'json' } = req.query;

      let data;
      let fileName;

      switch (type) {
        case 'dashboard':
          data = await AdminController.getDashboardExportData();
          fileName = 'dashboard_report';
          break;
        case 'activities':
          const hasActivities = await db.schema.hasTable('activities');
          data = hasActivities ? await db('activities').select('*').orderBy('created_at', 'desc') : [];
          fileName = 'activities_report';
          break;
        case 'albums':
          data = await db('albums').select('*');
          fileName = 'albums_report';
          break;
        case 'reviews':
          data = await db('reviews').select('*');
          fileName = 'reviews_report';
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'نوع التصدير غير صحيح'
          });
      }

      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.json"`);
        return res.json(data);
      }

      if (format === 'csv') {
        const csv = AdminController.convertToCSV(data);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.csv"`);
        return res.send('\uFEFF' + csv);
      }

      res.status(400).json({
        success: false,
        message: 'صيغة التصدير غير مدعومة حالياً'
      });

    } catch (error) {
      console.error('[ERROR] Error exporting data:', error.message);
      res.status(500).json({
        success: false,
        message: 'فشل في تصدير البيانات'
      });
    }
  }

  // Helper methods
  static async getDashboardExportData() {
    const [albums] = await db('albums').count('* as count');
    const [reviews] = await db('reviews').count('* as count');
    const [inquiries] = await db('inquiries').count('* as count');
    
    return {
      albums: albums.count,
      reviews: reviews.count,
      inquiries: inquiries.count,
      exportedAt: new Date().toISOString()
    };
  }

  static convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n') 
          ? `"${str.replace(/"/g, '""')}"` 
          : str;
      }).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
}

// دالة مساعدة لحساب نسبة التغيير
function calculateTrend(current, previous) {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(1));
}

export default AdminController;
