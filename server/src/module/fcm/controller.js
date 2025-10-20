import { saveFcmToken, removeFcmToken } from "../../utils/fcm.js";
import { info, error as logError } from "../../utils/logger.js";

class FcmController {
  static async saveToken(req, res) {
    try {
      const { fcm_token } = req.body;
      const adminId = req.user.id;

      if (!fcm_token) {
        return res.status(400).json({
          success: false,
          message: "FCM token is required",
        });
      }

      const deviceInfo = req.headers["user-agent"] || null;

      await saveFcmToken(adminId, fcm_token, deviceInfo);

      info("Admin FCM token saved", { adminId });

      res.json({
        success: true,
        message: "FCM token saved successfully",
      });
    } catch (error) {
      logError("Save FCM token failed", {
        error: error.message,
        adminId: req.user?.id,
      });

      res.status(500).json({
        success: false,
        message: "Failed to save FCM token",
      });
    }
  }

  static async removeToken(req, res) {
    try {
      const { fcm_token } = req.body;

      if (!fcm_token) {
        return res.status(400).json({
          success: false,
          message: "FCM token is required",
        });
      }

      await removeFcmToken(fcm_token);

      info("Admin FCM token removed", { adminId: req.user.id });

      res.json({
        success: true,
        message: "FCM token removed successfully",
      });
    } catch (error) {
      logError("Remove FCM token failed", {
        error: error.message,
        adminId: req.user?.id,
      });

      res.status(500).json({
        success: false,
        message: "Failed to remove FCM token",
      });
    }
  }
}

export default FcmController;
