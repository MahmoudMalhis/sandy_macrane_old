import { useState } from "react";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedTypes = ["image/jpeg", "image/png", "image/webp"],
      onProgress,
    } = options;

    // Validate file
    if (!file) {
      throw new Error("لم يتم اختيار ملف");
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error("نوع الملف غير مدعوم. يرجى اختيار JPG أو PNG أو WEBP");
    }

    if (file.size > maxSize) {
      throw new Error(
        `حجم الملف كبير جداً. الحد الأقصى ${Math.round(
          maxSize / (1024 * 1024)
        )} ميجابايت`
      );
    }

    setUploading(true);
    setProgress(0);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("image", file);

      // Simulate upload progress (replace with actual upload logic)
      return new Promise((resolve, reject) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setProgress(progress);
          onProgress && onProgress(progress);

          if (progress >= 100) {
            clearInterval(interval);
            // Replace with actual API call
            resolve({
              url: URL.createObjectURL(file),
              name: file.name,
              size: file.size,
            });
          }
        }, 100);
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const compressImage = (file, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const { width, height } = img;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  return {
    uploadImage,
    uploading,
    progress,
    convertToBase64,
    compressImage,
  };
};
