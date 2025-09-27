/* eslint-disable no-unused-vars */
// client/src/pages/admin/AlbumsAdmin.jsx - مع إمكانية رفع الصور
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Image as ImageIcon,
  Save,
  X,
  Star,
  Calendar,
  Upload,
  ExternalLink,
  Camera,
  Trash,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Loading from "../../utils/LoadingSettings";
import { adminAPI } from "../../api/admin";

export default function AlbumsAdmin() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0,
  });
  const [formData, setFormData] = useState({
    title: "",
    category: "macrame",
    description: "",
    maker_note: "",
    status: "draft",
    tags: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // باقي الوظائف كما هي...
  useEffect(() => {
    fetchAlbums();
    fetchStats();
  }, [pagination.page, filterStatus, filterCategory]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page === 1) {
        fetchAlbums();
      } else {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filterStatus !== "all") {
        params.status = filterStatus;
      }
      if (filterCategory !== "all") {
        params.category = filterCategory;
      }
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const response = await adminAPI.getAlbums(params);
      if (response.success) {
        setAlbums(response.data);
        setPagination(response.pagination);
      } else {
        toast.error("فشل في تحميل الألبومات");
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      toast.error("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getAlbumsStats();
      if (response.success) {
        setStats({
          total: response.data.total || 0,
          published: response.data.published || 0,
          draft: response.data.total - response.data.published || 0,
          totalViews: albums.reduce(
            (sum, album) => sum + (album.view_count || 0),
            0
          ),
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // معالجة اختيار الصور
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    // فلترة أنواع الملفات المقبولة
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024 // 10MB
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

  // حذف صورة من المعاينة
  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // إنشاء ألبوم مع الصور
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. إنشاء الألبوم أولاً
      let tagsArray = formData.tags;
      if (typeof tagsArray === "string") {
        tagsArray = tagsArray
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      const albumData = {
        ...formData,
        tags: tagsArray,
      };

      const albumResponse = await adminAPI.createAlbum(albumData);

      if (!albumResponse.success) {
        throw new Error(albumResponse.message || "فشل في إنشاء الألبوم");
      }

      const newAlbumId = albumResponse.data.id;

      // 2. رفع الصور إذا كانت موجودة
      if (selectedImages.length > 0) {
        const uploadFormData = new FormData();
        selectedImages.forEach((file, index) => {
          uploadFormData.append("media_files", file);
        });

        const uploadResponse = await adminAPI.uploadMedia(
          newAlbumId,
          uploadFormData
        );

        if (!uploadResponse.success) {
          console.warn("فشل في رفع بعض الصور:", uploadResponse.message);
          toast.warning("تم إنشاء الألبوم ولكن فشل في رفع بعض الصور");
        } else {
          toast.success(
            `تم إنشاء الألبوم مع ${selectedImages.length} صورة بنجاح!`
          );
        }
      } else {
        toast.success("تم إنشاء الألبوم بنجاح!");
      }

      setShowCreateModal(false);
      resetForm();
      fetchAlbums();
      fetchStats();
    } catch (error) {
      console.error("Error creating album:", error);
      toast.error(error.message || "فشل في إنشاء الألبوم");
    } finally {
      setUploading(false);
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      title: "",
      category: "macrame",
      description: "",
      maker_note: "",
      status: "draft",
      tags: [],
    });
    setSelectedImages([]);
    setImagePreviews([]);
  };

  // باقي الوظائف كما هي...
  const handleEditAlbum = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let tagsArray = formData.tags;
      if (typeof tagsArray === "string") {
        tagsArray = tagsArray
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      const albumData = {
        ...formData,
        tags: tagsArray,
      };

      const response = await adminAPI.updateAlbum(selectedAlbum.id, albumData);

      if (response.success) {
        toast.success("تم تحديث الألبوم بنجاح!");
        setShowEditModal(false);
        setSelectedAlbum(null);
        fetchAlbums();
        fetchStats();
      } else {
        toast.error(response.message || "فشل في تحديث الألبوم");
      }
    } catch (error) {
      console.error("Error updating album:", error);
      toast.error("فشل في تحديث الألبوم");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (
      !confirm(
        "هل أنت متأكد من حذف هذا الألبوم؟ سيتم حذف جميع الصور المرتبطة به أيضاً."
      )
    )
      return;

    try {
      const response = await adminAPI.deleteAlbum(albumId);

      if (response.success) {
        toast.success("تم حذف الألبوم بنجاح!");
        fetchAlbums();
        fetchStats();
      } else {
        toast.error(response.message || "فشل في حذف الألبوم");
      }
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("فشل في حذف الألبوم");
    }
  };

const toggleStatus = async (albumId) => {
  try {
    const album = albums.find((a) => a.id === albumId);
    if (!album) return;

    const newStatus = album.status === "published" ? "draft" : "published";

    // معالجة tags إذا كانت string
    let tagsArray = album.tags || [];
    if (typeof tagsArray === "string") {
      try {
        tagsArray = JSON.parse(tagsArray);
      } catch {
        tagsArray = [];
      }
    }

    // إرسال جميع البيانات المطلوبة
    const updateData = {
      title: album.title,
      category: album.category,
      description: album.description || "",
      maker_note: album.maker_note || "",
      status: newStatus,
      tags: tagsArray,
    };

    const response = await adminAPI.updateAlbum(albumId, updateData);

    if (response.success) {
      toast.success(
        `تم تغيير الحالة إلى ${newStatus === "published" ? "منشور" : "مسودة"}!`
      );
      fetchAlbums();
      fetchStats();
    } else {
      toast.error("فشل في تغيير الحالة");
    }
  } catch (error) {
    console.error("Error toggling status:", error);
    toast.error("فشل في تغيير الحالة");
  }
};

  const openEditModal = (album) => {
    setSelectedAlbum(album);

    let tagsArray = album.tags || [];
    if (typeof tagsArray === "string") {
      try {
        tagsArray = JSON.parse(tagsArray);
      } catch {
        tagsArray = [];
      }
    }

    setFormData({
      title: album.title,
      category: album.category,
      description: album.description || "",
      maker_note: album.maker_note || "",
      status: album.status,
      tags: tagsArray,
    });
    setShowEditModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleManageMedia = (album) => {
    navigate(`/admin/albums/${album.id}/media`);
  };

  const handleViewAlbum = (album) => {
    const url = `/album/${album.slug || album.id}`;
    window.open(url, "_blank");
  };

  if (loading && albums.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      {/* العنوان والإحصائيات - كما هو */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6 max-sm:flex-col max-md:flex-row md:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              إدارة الألبومات
            </h1>
            <p className="text-gray-600 mt-2">إدارة مجموعة الأعمال والمنتجات</p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center max-sm:mt-2 gap-2"
          >
            <Plus size={20} />
            إضافة ألبوم جديد
          </Button>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid max-sm:grid-cols-1 max-md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الألبومات
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <ImageIcon size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">منشور</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.published}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <Eye size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مسودة</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.draft}
                </p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <Edit size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي المشاهدات
                </p>
                <p className="text-3xl font-bold text-purple">
                  {albums.reduce(
                    (sum, album) => sum + (album.view_count || 0),
                    0
                  )}
                </p>
              </div>
              <div className="bg-purple p-3 rounded-full">
                <Star size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث في الألبومات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          >
            <option value="all">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
          >
            <option value="all">جميع الفئات</option>
            <option value="macrame">مكرمية</option>
            <option value="frame">براويز</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            عرض {albums.length} من أصل {pagination.total}
          </div>
        </div>
      </div>

      {/* قائمة الألبومات - مختصرة */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الألبوم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {albums.map((album, index) => (
                <tr key={album.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={album.cover_image || "/images/placeholder.jpg"}
                          alt={album.title}
                        />
                      </div>
                      <div className="mr-3">
                        <div className="text-sm font-medium text-gray-900">
                          {album.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {album.view_count || 0} مشاهدة
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="category">
                      {album.category === "macrame" ? "مكرمية" : "براويز"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(album.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        album.status === "published"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                      }`}
                    >
                      {album.status === "published" ? "منشور" : "مسودة"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewAlbum(album)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded cursor-pointer"
                        title="عرض"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button
                        onClick={() => handleManageMedia(album)}
                        className="text-green-600 hover:text-green-900 p-1 rounded cursor-pointer"
                        title="إدارة الصور"
                      >
                        <Upload size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(album)}
                        className="text-purple hover:text-purple-hover p-1 rounded cursor-pointer"
                        title="تعديل"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAlbum(album.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* مودال إنشاء ألبوم مع الصور */}
      <AnimatePresence>
        {showCreateModal && (
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
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    إنشاء ألبوم جديد
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateAlbum} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* بيانات الألبوم */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          عنوان الألبوم *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                          placeholder="مثل: مكرمية الورود الجميلة"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الفئة *
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                          >
                            <option value="macrame">مكرمية</option>
                            <option value="frame">براويز</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الحالة
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                          >
                            <option value="draft">مسودة</option>
                            <option value="published">منشور</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          وصف الألبوم
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                          placeholder="وصف قصير للألبوم..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ملاحظة الصانعة
                        </label>
                        <textarea
                          value={formData.maker_note}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maker_note: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                          placeholder="ملاحظة شخصية..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الكلمات المفتاحية
                        </label>
                        <input
                          type="text"
                          value={
                            Array.isArray(formData.tags)
                              ? formData.tags.join(", ")
                              : formData.tags
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tags: e.target.value
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                          placeholder="مكرمية, ورود, ديكور (افصل بفاصلة)"
                        />
                      </div>
                    </div>

                    {/* قسم الصور */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          صور الألبوم (اختياري)
                        </label>

                        {/* منطقة رفع الصور */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple transition-colors">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <Camera size={48} className="text-gray-400 mb-4" />
                            <span className="text-sm font-medium text-gray-700 mb-2">
                              اضغط لاختيار الصور
                            </span>
                            <span className="text-xs text-gray-500">
                              PNG, JPG, GIF حتى 10MB لكل صورة
                            </span>
                          </label>
                        </div>

                        {/* معاينة الصور المختارة */}
                        {imagePreviews.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              الصور المختارة ({imagePreviews.length})
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                              {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={preview.url}
                                    alt={preview.name}
                                    className="w-full h-20 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash size={12} />
                                  </button>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                                    {preview.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      إلغاء
                    </button>
                    <Button type="submit" loading={uploading} className="px-6">
                      <Save size={18} className="ml-2" />
                      {uploading
                        ? selectedImages.length > 0
                          ? "إنشاء الألبوم ورفع الصور..."
                          : "إنشاء الألبوم..."
                        : selectedImages.length > 0
                        ? `إنشاء الألبوم مع ${selectedImages.length} صورة`
                        : "إنشاء الألبوم"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مودال تعديل الألبوم (بدون الصور) */}
      <AnimatePresence>
        {showEditModal && selectedAlbum && (
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
                    تعديل الألبوم: {selectedAlbum.title}
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleEditAlbum} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      عنوان الألبوم *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الفئة *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      >
                        <option value="macrame">مكرمية</option>
                        <option value="frame">براويز</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الحالة
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      >
                        <option value="draft">مسودة</option>
                        <option value="published">منشور</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      وصف الألبوم
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ملاحظة الصانعة
                    </label>
                    <textarea
                      value={formData.maker_note}
                      onChange={(e) =>
                        setFormData({ ...formData, maker_note: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الكلمات المفتاحية
                    </label>
                    <input
                      type="text"
                      value={
                        Array.isArray(formData.tags)
                          ? formData.tags.join(", ")
                          : formData.tags
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
                      placeholder="مكرمية, ورود, ديكور (افصل بفاصلة)"
                    />
                  </div>

                  {/* ملاحظة لإدارة الصور */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Upload className="text-blue-400 mt-0.5 ml-3" size={20} />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800">
                          إدارة الصور
                        </h3>
                        <p className="text-sm text-blue-600 mt-1">
                          لإضافة أو تعديل صور الألبوم، استخدم زر "إدارة الصور"
                          من القائمة الرئيسية
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setShowEditModal(false);
                            handleManageMedia(selectedAlbum);
                          }}
                          className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                        >
                          إدارة صور هذا الألبوم
                        </button>
                      </div>
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
                    <Button type="submit" loading={uploading} className="px-6">
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
}
