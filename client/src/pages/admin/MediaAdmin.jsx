import { useState } from "react";
import {
  useAlbum,
  useAlbumMedia,
  useUpdateMedia,
  useBulkDeleteMedia,
  useReorderMedia,
  useUpdateAlbumTitle,
  albumsKeys,
} from "../../hooks/queries/useAlbums";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../utils/LoadingSettings";
import MediaHeader from "../../components/admin/media/MediaHeader";
import MediaUploader from "../../components/admin/media/MediaUploader";
import MediaGrid from "../../components/admin/media/MediaGrid";
import MediaEditModal from "../../components/admin/media/MediaEditModal";
import MediaStats from "../../components/admin/media/MediaStats";
import Error from "../../utils/Error";
import { useQueryClient } from "@tanstack/react-query";

const MediaAdmin = () => {
  const { id: albumId } = useParams();
  const navigate = useNavigate();

  const { data: album, isLoading: albumLoading, error } = useAlbum(albumId);
  const { data: media = [], isLoading: mediaLoading } = useAlbumMedia(albumId);

  const updateMediaMutation = useUpdateMedia();
  const bulkDeleteMutation = useBulkDeleteMedia();
  const reorderMediaMutation = useReorderMedia();
  const updateTitleMutation = useUpdateAlbumTitle();
  const queryClient = useQueryClient();

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const loading = albumLoading || mediaLoading;

  const handleImagesUploaded = () => {
    queryClient.invalidateQueries({
      queryKey: albumsKeys.media(albumId),
    });
  };

  const handleMediaDelete = (mediaIds) => {
    bulkDeleteMutation.mutate(mediaIds, {
      onSuccess: () => {
        setSelectedImages([]);
      },
    });
  };

  const handleMediaUpdate = (mediaId, updateData) => {
    updateMediaMutation.mutate({ mediaId, updateData });
  };

  const handleMediaReorder = (newOrder) => {
    const mediaIds = newOrder.map((item) => ({
      id: item.id,
      order_index: newOrder.indexOf(item) + 1,
    }));

    reorderMediaMutation.mutate({ albumId, mediaIds });
  };

  const handleAlbumUpdate = async (newTitle) => {
    return new Promise((resolve) => {
      updateTitleMutation.mutate(
        { albumId, title: newTitle },
        {
          onSuccess: () => resolve(true),
          onError: () => resolve(false),
        }
      );
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <MediaHeader
        album={album}
        onBackClick={() => navigate("/admin/albums")}
        onAlbumUpdate={handleAlbumUpdate}
      />

      <MediaStats
        totalMedia={media.length}
        selectedCount={selectedImages.length}
        albumTitle={album?.title}
      />

      <MediaUploader albumId={albumId} onUploadSuccess={handleImagesUploaded} />

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
