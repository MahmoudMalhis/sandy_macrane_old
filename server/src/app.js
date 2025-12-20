import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import { authGuard } from "./middlewares/authGuard.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { uploadSettingsImage } from "./utils/upload.js";


import adminRoutes from "./module/admin/router.js";
import likesRoutes from "./module/albums/likes.routes.js";
import albumsRoutes from "./module/albums/router.js";
import authRoutes from "./module/auth/router.js";
import contactRoutes from "./module/contact/router.js";
import fcmRouter from "./module/fcm/router.js";
import inquiriesRoutes from "./module/inquiries/router.js";
import mediaRoutes from "./module/media/router.js";
import reviewsRoutes from "./module/reviews/router.js";
import settingsRoutes from "./module/settings/router.js";

const app = express();


app.use(helmet());


const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(rateLimiter);


app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "../uploads"))
);


app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});


app.get("/", (req, res) => {
  res.json({
    message: "Sandy Macrame API is running! 🌟",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api/*",
    },
  });
});


app.post(
  "/api/media/upload",
  authGuard,
  uploadSettingsImage.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "لم يتم رفع أي ملف",
        });
      }

      
      const processedFile = {
        filename: req.file.filename, 
        originalname: req.file.originalname,
        path: req.file.path, 
        url: req.file.path, 
        size: req.file.size,
        mimetype: req.file.mimetype,
        cloudinary_id: req.file.filename,
      };

      res.json({
        success: true,
        message: "تم رفع الملف بنجاح",
        data: processedFile,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "فشل في رفع الملف",
        error: error.message,
      });
    }
  }
);


app.use("/api/auth", authRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/inquiries", inquiriesRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/albums", likesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", fcmRouter);


app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use(errorHandler);

export default app;
