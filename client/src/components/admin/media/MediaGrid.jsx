import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Trash2,
  Edit,
  Star,
  Eye,
  CheckSquare,
  Square,
  GripVertical,
} from "lucide-react";
import Button from "../../common/Button";

const MediaGrid = ({
  media,
  selectedImages,
  setSelectedImages,
  selectedItemForReorder,
  onSelectForReorder,
  onMediaDelete,
  onMediaEdit,
  onDragStart,
  onDragEnd,
  onMediaUpdate,
  onMediaReorder,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const toggleImageSelection = (mediaId) => {
    setSelectedImages((prev) =>
      prev.includes(mediaId)
        ? prev.filter((id) => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === media.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(media.map((item) => item.id));
    }
  };

  const handleDragStart = (start) => {
    setIsDragging(true);
    const draggedItemData = media[start.source.index];
    setDraggedItem(draggedItemData);

    if (onDragStart) {
      onDragStart(start);
    }

    document.body.style.cursor = "grabbing";
    document.body.classList.add("dragging");
  };

  const handleDragEnd = (result) => {
    setIsDragging(false);
    setDraggedItem(null);

    document.body.style.cursor = "";
    document.body.classList.remove("dragging");

    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    if (source.index === destination.index) {
      return;
    }

    const reorderedMedia = Array.from(media);
    const [removed] = reorderedMedia.splice(source.index, 1);
    reorderedMedia.splice(destination.index, 0, removed);

    if (onMediaReorder) {
      onMediaReorder(reorderedMedia);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedImages.length === 0) return;

    if (window.confirm(`هل تريد حذف ${selectedImages.length} صورة محددة؟`)) {
      onMediaDelete(selectedImages);
    }
  };

  const handleSetAsCover = async (mediaId) => {
    try {
      await onMediaUpdate(mediaId, { is_cover: true });
    } catch (error) {
      console.error("Error setting cover:", error);
    }
  };

  if (media.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-500 mb-2">
          لا توجد صور في هذا الألبوم
        </h3>
        <p className="text-gray-400">
          ابدأ برفع بعض الصور لإنشاء مجموعتك الأولى
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">الصور ({media.length})</h2>

          {selectedImages.length > 0 && (
            <span className="bg-purple text-white px-3 py-1 rounded-full text-sm">
              {selectedImages.length} محدد
            </span>
          )}

          {isDragging && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
              جاري إعادة الترتيب...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={toggleSelectAll}
            className="flex items-center gap-2"
          >
            {selectedImages.length === media.length ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {selectedImages.length === media.length
              ? "إلغاء تحديد الكل"
              : "تحديد الكل"}
          </Button>

          {selectedImages.length > 0 && (
            <Button
              variant="danger"
              onClick={handleDeleteSelected}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              حذف المحدد
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <GripVertical className="w-4 h-4" />
          <strong>نصيحة:</strong> اسحب الصور لإعادة ترتيبها • اضغط على النجمة
          لجعل الصورة غلاف الألبوم • استخدم مربعات التحديد للعمليات المجمعة
        </p>
      </div>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="media-grid"
          direction="horizontal"
          isDropDisabled={false}
          isCombineEnabled={false}
        >
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-all duration-200 ${
                snapshot.isDraggingOver ? "bg-blue-50 rounded-lg p-2" : ""
              }`}
            >
              {media.map((item, index) => (
                <Draggable
                  key={item.id.toString()}
                  draggableId={item.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative group bg-white rounded-lg overflow-hidden shadow-sm border-2 transition-all duration-200 ${
                        selectedImages.includes(item.id)
                          ? "border-purple shadow-lg ring-2 ring-purple ring-opacity-50"
                          : selectedItemForReorder === item.id
                          ? "border-blue-500 shadow-lg ring-2 ring-blue-500 ring-opacity-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${
                        snapshot.isDragging
                          ? "rotate-3 shadow-xl scale-105 z-50"
                          : "hover:shadow-md"
                      }`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: snapshot.isDragging ? 1.05 : 1,
                      }}
                      transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-2 left-2 bg-purple bg-opacity-70 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-20"
                        title="اسحب لإعادة الترتيب"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <button
                        onClick={() => toggleImageSelection(item.id)}
                        className="absolute top-2 right-2 z-20 transition-all duration-200"
                      >
                        {selectedImages.includes(item.id) ? (
                          <CheckSquare className="w-5 h-5 text-purple bg-white rounded shadow-sm" />
                        ) : (
                          <Square className="w-5 h-5 text-white bg-purple bg-opacity-50 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>

                      {item.is_cover && (
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold z-20 shadow-lg">
                          <Star className="w-3 h-3 inline ml-1" />
                          غلاف
                        </div>
                      )}

                      <div className="aspect-square overflow-hidden">
                        <img
                          src={item.url}
                          alt={item.alt || "صورة الألبوم"}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            snapshot.isDragging
                              ? "filter brightness-110"
                              : "group-hover:scale-105"
                          }`}
                          loading="lazy"
                        />
                      </div>

                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 truncate flex-1">
                            {item.alt || "بدون وصف"}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              #{index + 1}
                            </span>

                            {onSelectForReorder && (
                              <button
                                onClick={() => onSelectForReorder(item.id)}
                                className={`p-1 rounded transition-colors ${
                                  selectedItemForReorder === item.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-blue-100"
                                }`}
                                title={
                                  selectedItemForReorder === item.id
                                    ? "إلغاء التحديد"
                                    : "تحديد للترتيب"
                                }
                              >
                                <GripVertical className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 z-10">
                        {!item.is_cover && (
                          <Button
                            size="sm"
                            onClick={() => handleSetAsCover(item.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
                            title="جعل صورة الغلاف"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          onClick={() => onMediaEdit(item)}
                          className="shadow-lg"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onMediaDelete([item.id])}
                          className="shadow-lg"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
    </div>
  );
};

export default MediaGrid;
