
import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard.js";
import FcmController from "./controller.js";

const router = Router();
router.use(authGuard);
router.post("/fcm-token", FcmController.saveToken);
router.delete("/fcm-token", FcmController.removeToken);

export default router;
