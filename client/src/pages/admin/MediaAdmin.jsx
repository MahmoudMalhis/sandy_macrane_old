/* eslint-disable no-unused-vars */
// client/src/pages/admin/MediaAdmin.jsx - إدارة صور الألبوم
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Upload,
  Trash2,
  Edit,
  Camera,
  Star,
  Eye,
  Image as ImageIcon,
  Save,
  X,
  Move,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "../../components/common/Button";
import Loading from "../../utils/LoadingSettings";
import { adminAPI } from "../../api/admin";

const MediaAdmin = () => {
  const { id: albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    alt: "",
    is_cover: false,
  });

  useEffect(() => {
    fetchAlbumData();
  }, [albumId]);

  const fetchAlbumData = async () => {
    try {
      setLoading(true);

      // جلب بيانات الألبوم
      const albumResponse = await adminAPI.getAlbumById(albumId);
      if (albumResponse.success) {
        setAlbum(albumResponse.data);
      }

      // جلب صور الألبوم
      const mediaResponse = await adminAPI.getAlbumMedia(albumId);
      if (mediaResponse.success) {
        setMedia(mediaResponse.data);
      }
    } catch (error) {
      console.error("Error fetching album data:", error);
      toast.error("فشل في تحميل بيانات الألبوم");
    } finally {
      setLoading(false);
    }
  };

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

    setSelectedImages(validFiles);
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      toast.error("يرجى اختيار الصور أولاً");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      selectedImages.forEach((file) => {
        formData.append("media_files", file);
      });

      const response = await adminAPI.uploadMedia(albumId, formData);

      if (response.success) {
        toast.success(`تم رفع ${selectedImages.length} صورة بنجاح!`);
        setSelectedImages([]);
        // إعادة تعيين input الملف
        const fileInput = document.getElementById("media-upload");
        if (fileInput) fileInput.value = "";

        fetchAlbumData();
      } else {
        toast.error("فشل في رفع الصور");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("فشل في رفع الصور");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;

    try {
      const response = await adminAPI.deleteMedia(mediaId);

      if (response.success) {
        toast.success("تم حذف الصورة بنجاح!");
        fetchAlbumData();
      } else {
        toast.error("فشل في حذف الصورة");
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("فشل في حذف الصورة");
    }
  };

  const openEditModal = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setFormData({
      alt: mediaItem.alt || "",
      is_cover: mediaItem.is_cover || false,
    });
    setShowEditModal(true);
  };

  const handleUpdateMedia = async (e) => {
    e.preventDefault();

    try {
      const response = await adminAPI.updateMedia(selectedMedia.id, formData);

      if (response.success) {
        toast.success("تم تحديث الصورة بنجاح!");
        setShowEditModal(false);
        setSelectedMedia(null);
        fetchAlbumData();
      } else {
        toast.error("فشل في تحديث الصورة");
      }
    } catch (error) {
      console.error("Error updating media:", error);
      toast.error("فشل في تحديث الصورة");
    }
  };

  const handleReorderMedia = async (result) => {
    if (!result.destination) return;

    const reorderedMedia = Array.from(media);
    const [movedItem] = reorderedMedia.splice(result.source.index, 1);
    reorderedMedia.splice(result.destination.index, 0, movedItem);

    setMedia(reorderedMedia);

    try {
      const mediaIds = reorderedMedia.map((item) => item.id);
      const response = await adminAPI.reorderMedia(albumId, mediaIds);

      if (response.success) {
        toast.success("تم إعادة ترتيب الصور بنجاح!");
      } else {
        toast.error("فشل في إعادة ترتيب الصور");
        fetchAlbumData(); // استرداد الترتيب الأصلي
      }
    } catch (error) {
      console.error("Error reordering media:", error);
      toast.error("فشل في إعادة ترتيب الصور");
      fetchAlbumData(); // استرداد الترتيب الأصلي
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!album) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          الألبوم غير موجود
        </h2>
        <Button onClick={() => navigate("/admin/albums")}>
          العودة للألبومات
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* العنوان والتنقل */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/albums")}
            className="flex items-center gap-2 text-gray-600 hover:text-purple transition-colors"
          >
            <ArrowRight size={20} />
            العودة للألبومات
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              إدارة صور: {album.title}
            </h1>
            <p className="text-gray-600 mt-2">
              {album.category === "macrame" ? "مكرمية" : "براويز"} •{" "}
              {media.length} صورة
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() =>
                window.open(`/album/${album.slug || album.id}`, "_blank")
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye size={18} />
              عرض الألبوم
            </Button>
          </div>
        </div>
      </div>

      {/* منطقة رفع الصور */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          إضافة صور جديدة
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* منطقة اختيار الملفات */}
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Camera size={48} className="text-gray-400 mb-4" />
                <span className="text-lg font-medium text-gray-700 mb-2">
                  اختر الصور لرفعها
                </span>
                <span className="text-sm text-gray-500">
                  PNG, JPG, GIF حتى 10MB لكل صورة
                </span>
              </label>
            </div>
          </div>

          {/* معلومات الصور المختارة */}
          <div className="space-y-4">
            {selectedImages.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  الصور المختارة ({selectedImages.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedImages.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-blue-700 truncate">
                        {file.name}
                      </span>
                      <span className="text-blue-600 ml-2">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={selectedImages.length === 0 || uploading}
              loading={uploading}
              className="w-full"
            >
              <Upload size={18} className="ml-2" />
              {uploading
                ? "جاري الرفع..."
                : `رفع ${selectedImages.length || 0} صورة`}
            </Button>
          </div>
        </div>
      </div>

      {/* عرض الصور الموجودة */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            صور الألبوم ({media.length})
          </h2>
          {media.length > 1 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Move size={16} />
              اسحب الصور لإعادة الترتيب
            </div>
          )}
        </div>

        {media.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد صور في هذا الألبوم
            </h3>
            <p className="text-gray-600">ابدأ برفع أول صورة للألبوم</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleReorderMedia}>
            <Droppable droppableId="media-list" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                >
                  {media.map((mediaItem, index) => (
                    <Draggable
                      key={mediaItem.id}
                      draggableId={mediaItem.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`relative group bg-gray-100 rounded-lg overflow-hidden aspect-square ${
                            snapshot.isDragging
                              ? "shadow-2xl scale-105"
                              : "shadow-md"
                          }`}
                        >
                          <img
                            src={mediaItem.url}
                            alt={mediaItem.alt || `صورة ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* الشارات */}
                          <div className="absolute top-2 right-2 flex gap-1">
                            {mediaItem.is_cover && (
                              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <Star size={12} />
                                غلاف
                              </span>
                            )}
                            <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                              {index + 1}
                            </span>
                          </div>

                          {/* أزرار التحكم */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                              <button
                                onClick={() => openEditModal(mediaItem)}
                                className="bg-white text-gray-700 p-2 rounded-full hover:bg-purple hover:text-white transition-colors"
                                title="تعديل"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteMedia(mediaItem.id)}
                                className="bg-white text-gray-700 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                title="حذف"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* مؤشر الترتيب */}
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            {mediaItem.sort_order || index + 1}
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* مودال تعديل الصورة */}
      <AnimatePresence>
        {showEditModal && selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    تعديل الصورة
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpdateMedia} className="space-y-6">
                  {/* معاينة الصورة */}
                  <div className="text-center">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.alt || "معاينة"}
                      className="w-48 h-48 object-cover rounded-lg mx-auto shadow-md"
                    />
                  </div>

                  {/* حقول التعديل */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف الصورة (Alt Text)
                    </label>
                    <input
                      type="text"
                      value={formData.alt}
                      onChange={(e) =>
                        setFormData({ ...formData, alt: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="وصف مختصر للصورة..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يساعد في تحسين محركات البحث وإمكانية الوصول
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_cover"
                      checked={formData.is_cover}
                      onChange={(e) =>
                        setFormData({ ...formData, is_cover: e.target.checked })
                      }
                      className="w-4 h-4 text-purple border-gray-300 rounded focus:ring-purple"
                    />
                    <label
                      htmlFor="is_cover"
                      className="text-sm font-medium text-gray-700"
                    >
                      جعل هذه الصورة غلاف الألبوم
                    </label>
                  </div>

                  {formData.is_cover && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        ⭐ ستصبح هذه الصورة هي الغلاف الرئيسي للألبوم وستظهر في
                        المعرض
                      </p>
                    </div>
                  )}

                  {/* معلومات الصورة */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الترتيب:</span>
                      <span className="font-medium">
                        {selectedMedia.sort_order || "غير محدد"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الإضافة:</span>
                      <span className="font-medium">
                        {new Date(selectedMedia.created_at).toLocaleDateString(
                          "ar"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحالة الحالية:</span>
                      <span
                        className={`font-medium ${
                          selectedMedia.is_cover
                            ? "text-yellow-600"
                            : "text-gray-600"
                        }`}
                      >
                        {selectedMedia.is_cover ? "صورة غلاف" : "صورة عادية"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      إلغاء
                    </button>
                    <Button type="submit" className="px-6">
                      <Save size={18} className="ml-2" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaAdmin;
