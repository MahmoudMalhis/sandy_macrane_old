import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

/**
 * Hook مخصص لإدارة إعادة ترتيب الوسائط مع تحسينات الأداء
 * @param {Array} initialMedia - الوسائط الأولية
 * @param {Function} onReorderAPI - دالة API لحفظ الترتيب
 * @returns {Object} حالات ووظائف إدارة الترتيب
 */
export const useMediaReorder = (initialMedia, onReorderAPI) => {
  const [media, setMedia] = useState(initialMedia || []);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [originalOrder, setOriginalOrder] = useState([]);

  /**
   * تحديث الوسائط
   */
  const updateMedia = useCallback((newMedia) => {
    setMedia(newMedia);
  }, []);

  /**
   * بداية عملية السحب
   */
  const handleDragStart = useCallback(
    (result) => {
      const draggedItemData = media[result.source.index];
      setDraggedItem(draggedItemData);
      setOriginalOrder([...media]);

      // إضافة تأثيرات بصرية
      document.body.classList.add("dragging");
    },
    [media]
  );

  /**
   * انتهاء عملية السحب
   */
  const handleDragEnd = useCallback(
    async (result) => {
      setDraggedItem(null);
      document.body.classList.remove("dragging");

      // التحقق من صحة النتيجة
      if (!result.destination) {
        return;
      }

      const { source, destination } = result;

      // إذا لم يتغير الموضع
      if (source.index === destination.index) {
        return;
      }

      // تحديث الترتيب محلياً للاستجابة السريعة
      const newMedia = Array.from(media);
      const [reorderedItem] = newMedia.splice(source.index, 1);
      newMedia.splice(destination.index, 0, reorderedItem);

      setMedia(newMedia);
      setIsReordering(true);

      try {
        // إرسال الترتيب الجديد للخادم
        const reorderData = newMedia.map((item, index) => ({
          id: item.id,
          order_index: index + 1,
          position: index,
        }));

        await onReorderAPI(reorderData);

        toast.success("تم حفظ الترتيب الجديد بنجاح", {
          icon: "✅",
          duration: 2000,
        });

        // تحديث الترتيب الأصلي
        setOriginalOrder([...newMedia]);
      } catch (error) {
        // في حالة الفشل، استرجاع الترتيب الأصلي
        setMedia(originalOrder);

        toast.error("فشل في حفظ الترتيب الجديد", {
          icon: "❌",
          duration: 3000,
        });

        console.error("Error reordering media:", error);
      } finally {
        setIsReordering(false);
      }
    },
    [media, originalOrder, onReorderAPI]
  );

  /**
   * نقل عنصر إلى موضع محدد
   */
  const moveItemToPosition = useCallback(
    async (itemId, newPosition) => {
      const currentIndex = media.findIndex((item) => item.id === itemId);

      if (currentIndex === -1 || currentIndex === newPosition) {
        return;
      }

      const newMedia = Array.from(media);
      const [movedItem] = newMedia.splice(currentIndex, 1);
      newMedia.splice(newPosition, 0, movedItem);

      setMedia(newMedia);
      setIsReordering(true);

      try {
        const reorderData = newMedia.map((item, index) => ({
          id: item.id,
          order_index: index + 1,
          position: index,
        }));

        await onReorderAPI(reorderData);
        toast.success("تم تحديث الموضع بنجاح");
      } catch (error) {
        setMedia(originalOrder);
        toast.error("فشل في تحديث الموضع");
      } finally {
        setIsReordering(false);
      }
    },
    [media, originalOrder, onReorderAPI]
  );

  /**
   * إعادة تعيين الترتيب إلى الحالة الأصلية
   */
  const resetOrder = useCallback(() => {
    setMedia(originalOrder);
    toast.info("تم إعادة تعيين الترتيب");
  }, [originalOrder]);

  /**
   * نقل عنصر خطوة واحدة للأمام
   */
  const moveItemForward = useCallback(
    (itemId) => {
      const currentIndex = media.findIndex((item) => item.id === itemId);

      if (currentIndex < media.length - 1) {
        moveItemToPosition(itemId, currentIndex + 1);
      }
    },
    [media, moveItemToPosition]
  );

  /**
   * نقل عنصر خطوة واحدة للخلف
   */
  const moveItemBackward = useCallback(
    (itemId) => {
      const currentIndex = media.findIndex((item) => item.id === itemId);

      if (currentIndex > 0) {
        moveItemToPosition(itemId, currentIndex - 1);
      }
    },
    [media, moveItemToPosition]
  );

  /**
   * نقل عنصر إلى البداية
   */
  const moveItemToStart = useCallback(
    (itemId) => {
      moveItemToPosition(itemId, 0);
    },
    [moveItemToPosition]
  );

  /**
   * نقل عنصر إلى النهاية
   */
  const moveItemToEnd = useCallback(
    (itemId) => {
      moveItemToPosition(itemId, media.length - 1);
    },
    [media.length, moveItemToPosition]
  );

  /**
   * ترتيب تلقائي حسب معيار معين
   */
  const autoSort = useCallback(
    async (sortBy = "name") => {
      let sortedMedia = [...media];

      switch (sortBy) {
        case "name":
          sortedMedia.sort((a, b) => (a.alt || "").localeCompare(b.alt || ""));
          break;
        case "date":
          sortedMedia.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          break;
        case "size":
          sortedMedia.sort((a, b) => (b.file_size || 0) - (a.file_size || 0));
          break;
        default:
          return;
      }

      setMedia(sortedMedia);
      setIsReordering(true);

      try {
        const reorderData = sortedMedia.map((item, index) => ({
          id: item.id,
          order_index: index + 1,
          position: index,
        }));

        await onReorderAPI(reorderData);
        toast.success(
          `تم ترتيب الصور حسب ${
            sortBy === "name"
              ? "الاسم"
              : sortBy === "date"
              ? "التاريخ"
              : "الحجم"
          }`
        );
      } catch (error) {
        setMedia(originalOrder);
        toast.error("فشل في الترتيب التلقائي");
      } finally {
        setIsReordering(false);
      }
    },
    [media, originalOrder, onReorderAPI]
  );

  /**
   * الحصول على موضع عنصر
   */
  const getItemPosition = useCallback(
    (itemId) => {
      return media.findIndex((item) => item.id === itemId) + 1;
    },
    [media]
  );

  /**
   * التحقق من إمكانية النقل
   */
  const canMoveForward = useCallback(
    (itemId) => {
      const currentIndex = media.findIndex((item) => item.id === itemId);
      return currentIndex < media.length - 1;
    },
    [media]
  );

  const canMoveBackward = useCallback(
    (itemId) => {
      const currentIndex = media.findIndex((item) => item.id === itemId);
      return currentIndex > 0;
    },
    [media]
  );

  return {
    // البيانات
    media,
    draggedItem,
    isReordering,
    originalOrder,

    // الوظائف الأساسية
    updateMedia,
    handleDragStart,
    handleDragEnd,

    // وظائف النقل المتقدمة
    moveItemToPosition,
    moveItemForward,
    moveItemBackward,
    moveItemToStart,
    moveItemToEnd,

    // وظائف مساعدة
    resetOrder,
    autoSort,
    getItemPosition,
    canMoveForward,
    canMoveBackward,

    // معلومات إضافية
    hasChanges:
      media.length !== originalOrder.length ||
      !media.every((item, index) => item.id === originalOrder[index]?.id),
    totalItems: media.length,
  };
};
