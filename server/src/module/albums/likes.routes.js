import { Router } from "express";
import {
  likeAlbum,
  unlikeAlbum,
  getLikesCount,
  getMostLiked,
} from "./likes.controller.js";

const router = Router();

router.post("/:id/like", likeAlbum);
router.post("/:id/unlike", unlikeAlbum);
router.get("/:id/likes", getLikesCount);
router.get("/most-liked", getMostLiked);

export default router;
