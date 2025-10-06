// client/src/components/admin/media/MediaUploader.jsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../../common/Button";
import { adminAPI } from "../../../api/admin";

/**
 * مكون رفع الوسائط
 * @param {string} albumId - معرف الألبوم
 * @param {Function} onUploadSuccess - دالة استدعاء عند نجاح الرفع
 */
const MediaUploader = ({ albumId, onUploadSuccess }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  /**
   * معالجة اختيار الصور
   */
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error(
        "بعض الملفات غير صالحة. يرجى اختيار صور بحجم أقل من 10 ميجا."
      );
    }

    setSelectedImages((prevImages) => [...prevImages, ...validFiles]);

    // إنشاء معاينات للصور
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [
          ...prev,
          {
            file,
            url: e.target.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  /**
   * حذف صورة من المعاينة
   */
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * رفع الصور إلى الخادم
   */
  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      toast.error("يرجى اختيار صور أولاً");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      selectedImages.forEach((file) => {
        formData.append("media_files", file);
      });

      const response = await adminAPI.uploadAlbumMedia(albumId, formData);

      if (response.success) {
        onUploadSuccess(response.data);
        setSelectedImages([]);
        setImagePreviews([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("فشل في رفع الصور");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Upload className="w-5 h-5 ml-2 text-purple" />
        رفع صور جديدة
      </h2>

      {/* منطقة اختيار الصور */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple transition-colors">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">اضغط هنا أو اسحب الصور لرفعها</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-purple text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-purple-hover transition-colors inline-block"
        >
          اختيار صور
        </label>
        <p className="text-sm text-gray-500 mt-2">
          JPG, PNG, WEBP (حد أقصى 10MB لكل صورة)
        </p>
      </div>

      {/* معاينة الصور المختارة */}
      {imagePreviews.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">
            الصور المختارة ({imagePreviews.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {imagePreviews.map((preview, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-24 object-cover rounded-lg"
                  loading="lazy"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {preview.name}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleUpload}
              loading={uploading}
              disabled={uploading || selectedImages.length === 0}
              className="px-6 py-2"
            >
              <Upload className="w-4 h-4 ml-2" />
              {uploading
                ? "جاري الرفع..."
                : `رفع ${selectedImages.length} صورة`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
