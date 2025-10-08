/* eslint-disable no-unused-vars */
// client/src/pages/admin/MediaAdmin.jsx - الملف الرئيسي المُعاد هيكلته
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera } from "lucide-react";
import { toast } from "react-hot-toast";

import Loading from "../../utils/LoadingSettings";
import { adminAPI } from "../../api/admin";

// استيراد المكونات الفرعية
import MediaHeader from "../../components/admin/media/MediaHeader";
import MediaUploader from "../../components/admin/media/MediaUploader";
import MediaGrid from "../../components/admin/media/MediaGrid";
import MediaEditModal from "../../components/admin/media/MediaEditModal";
import MediaStats from "../../components/admin/media/MediaStats";

/**
 * صفحة إدارة وسائط الألبوم
 * تم تقسيمها إلى مكونات منفصلة لسهولة الصيانة
 */
const MediaAdmin = () => {
  const { id: albumId } = useParams();
  const navigate = useNavigate();

  // حالات البيانات الأساسية
  const [album, setAlbum] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  // حالات التفاعل
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAlbumData();
  }, [albumId]);

  /**
   * جلب بيانات الألبوم والوسائط
   */
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

  /**
   * معالجة رفع صور جديدة
   */
  const handleImagesUploaded = (newMedia) => {
    setMedia((prev) => [...prev, ...newMedia]);
    toast.success(`تم رفع ${newMedia.length} صورة بنجاح`);
  };

  /**
   * معالجة حذف وسائط
   */
  const handleMediaDelete = async (mediaIds) => {
    try {
      await adminAPI.deleteMedia(mediaIds);
      setMedia((prev) => prev.filter((item) => !mediaIds.includes(item.id)));
      setSelectedImages([]);
      toast.success("تم حذف الوسائط المحددة");
    } catch (error) {
      toast.error("فشل في حذف الوسائط");
    }
  };

  /**
   * معالجة تحديث وسائط
   */
  const handleMediaUpdate = async (mediaId, updateData) => {
    try {
      const response = await adminAPI.updateMedia(mediaId, updateData);
      if (response.success) {
        setMedia((prev) =>
          prev.map((item) =>
            item.id === mediaId ? { ...item, ...updateData } : item
          )
        );
        toast.success("تم تحديث الوسائط بنجاح");
      }
    } catch (error) {
      toast.error("فشل في تحديث الوسائط");
    }
  };

  /**
   * معالجة إعادة ترتيب الوسائط
   */
  const handleMediaReorder = async (newOrder) => {
    try {
      // تحديث الترتيب محلياً أولاً للاستجابة السريعة
      setMedia(newOrder);

      // إرسال الترتيب الجديد للخادم
      const reorderData = newOrder.map((item, index) => ({
        id: item.id,
        order_index: index + 1,
      }));

      await adminAPI.reorderMedia(albumId, reorderData);
      toast.success("تم حفظ الترتيب الجديد");
    } catch (error) {
      // إعادة البيانات الأصلية في حالة الفشل
      await fetchAlbumData();
      toast.error("فشل في حفظ الترتيب");
    }
  };
  const handleAlbumUpdate = async (newTitle) => {
    try {
      const response = await adminAPI.updateAlbum(albumId, { title: newTitle });
      if (response.success) {
        setAlbum((prev) => ({ ...prev, title: newTitle }));
        toast.success("تم تحديث اسم الألبوم بنجاح");
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error("فشل في تحديث اسم الألبوم");
      return false;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header مع إمكانية تعديل الاسم */}
      <MediaHeader
        album={album}
        onBackClick={() => navigate("/admin/albums")}
        onAlbumUpdate={handleAlbumUpdate}
      />

      {/* Stats */}
      <MediaStats
        totalMedia={media.length}
        selectedCount={selectedImages.length}
        albumTitle={album?.title}
      />

      {/* Uploader */}
      <MediaUploader albumId={albumId} onUploadSuccess={handleImagesUploaded} />

      {/* Media Grid */}
      <MediaGrid
        media={media}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        onMediaDelete={handleMediaDelete}
        onMediaEdit={(mediaItem) => {
          setSelectedMedia(mediaItem);
          setShowEditModal(true);
        }}
        onMediaUpdate={handleMediaUpdate}
        onMediaReorder={handleMediaReorder}
      />

      {/* Edit Modal */}
      <MediaEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMedia(null);
        }}
        media={selectedMedia}
        onUpdate={handleMediaUpdate}
      />
    </div>
  );
};

export default MediaAdmin;
