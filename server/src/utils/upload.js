import multer, { diskStorage } from "multer";
import { join, extname } from "path";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname } from "path";

// إصلاح __dirname للعمل مع ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = join(__dirname, "../../uploads");
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local storage
const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(uploadsDir, getUploadSubfolder(file.fieldname));

    // Create subfolder if it doesn't exist
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Get upload subfolder based on field name
const getUploadSubfolder = (fieldname) => {
  switch (fieldname) {
    case "album_images":
    case "media_files":
    case "cover_image":
      return "albums";
    case "review_image":
      return "reviews";
    default:
      return "misc";
  }
};

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// Helper function to get file URL
const getFileUrl = (req, relativePath) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${relativePath}`;
};

// Process uploaded files and return URLs
const processUploadedFiles = (req, files) => {
  if (!files || files.length === 0) return [];

  return files.map((file) => {
    const relativePath = join(
      getUploadSubfolder(file.fieldname),
      file.filename
    ).replace(/\\/g, "/"); // Ensure forward slashes for URLs

    return {
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      url: getFileUrl(req, relativePath),
      size: file.size,
      mimetype: file.mimetype,
    };
  });
};

// تصحيح exports
export {
  upload,
  deleteFile,
  getFileUrl,
  processUploadedFiles,
  getUploadSubfolder,
};
