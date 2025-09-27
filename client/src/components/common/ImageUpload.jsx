import { Upload } from "lucide-react";

export default function ImageUpload({
  onImageSelect,
  currentImage = null,
  acceptedFormats = "image/*",
  maxSize = 5,
  label = "رفع صورة",
}) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("يرجى اختيار ملف صورة صحيح");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`حجم الصورة يجب أن يكون أقل من ${maxSize} ميجابايت`);
      return;
    }

    onImageSelect(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {currentImage && (
        <div className="mb-4">
          <img
            src={currentImage}
            alt="معاينة"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">اضغط لرفع صورة</span>
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP (حد أقصى {maxSize}MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={acceptedFormats}
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
