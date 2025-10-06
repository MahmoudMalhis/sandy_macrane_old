import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
import { errorHandler } from "./middlewares/errorHandler.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { authGuard } from "./middlewares/authGuard.js";
import { upload, processUploadedFiles } from "./utils/upload.js";

// Routes
import authRoutes from "./module/auth/router.js";
import albumsRoutes from "./module/albums/router.js";
import mediaRoutes from "./module/media/router.js";
import reviewsRoutes from "./module/reviews/router.js";
import inquiriesRoutes from "./module/inquiries/router.js";
import settingsRoutes from "./module/settings/router.js";
import adminRoutes from "./module/admin/router.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // السماح للطلبات بدون origin (مثلاً Postman)
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

// Rate limiting
app.use(rateLimiter);

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // أو بدل * بـ allowedOrigins إذا بدك تقيد
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "../uploads"))
);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Test route
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

// Media upload endpoint for general use
app.post("/api/media/upload", authGuard, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const processedFile = processUploadedFiles(req, [req.file])[0];

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: processedFile,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/inquiries", inquiriesRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
