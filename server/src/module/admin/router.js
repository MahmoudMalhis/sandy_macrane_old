// server/src/module/admin/router.js
import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard.js";
import AdminController from "./controller.js";

const router = Router();

// جميع routes تحتاج authentication
router.use(authGuard);

// الإحصائيات
router.get("/stats", AdminController.getStats);

// الإشعارات
router.get("/notifications", AdminController.getNotifications);
router.patch("/notifications/:id/read", AdminController.markNotificationAsRead);
router.patch(
  "/notifications/read-all",
  AdminController.markAllNotificationsAsRead
);
router.delete("/notifications/:id", AdminController.deleteNotification);

// النشاطات
router.get("/activities", AdminController.getActivities);

// التصدير
router.get("/export/:type", AdminController.exportData);

export default router;
