import { useState, useEffect } from "react";
import { likesAPI } from "../api/likes";
import { toast } from "react-hot-toast";

const LIKES_STORAGE_KEY = "sandy_macrame_likes";

export const useLikes = (albumId, initialLikesCount = 0) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const likedAlbums = getLikedAlbums();
    const liked = likedAlbums.includes(albumId);
    setIsLiked(liked);

    if (liked) {
      fetchRealLikesCount();
    }
  }, [albumId]);

  const fetchRealLikesCount = async () => {
    try {
      const response = await likesAPI.getCount(albumId);
      if (response.success) {
        setLikesCount(response.data.likesCount);
      }
    } catch (error) {
      console.error("Error fetching likes count:", error);
    }
  };

  const getLikedAlbums = () => {
    try {
      const stored = localStorage.getItem(LIKES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading likes from localStorage:", error);
      return [];
    }
  };

  const saveLikedAlbums = (albums) => {
    try {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(albums));
    } catch (error) {
      console.error("Error saving likes to localStorage:", error);
    }
  };

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await likesAPI.like(albumId);

      if (response.success) {
        setLikesCount(response.data.likesCount);
        setIsLiked(true);

        const likedAlbums = getLikedAlbums();
        if (!likedAlbums.includes(albumId)) {
          likedAlbums.push(albumId);
          saveLikedAlbums(likedAlbums);
        }
      }
    } catch (error) {
      console.error("Error liking album:", error);
      toast.error("فشل في إضافة الإعجاب");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlike = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await likesAPI.unlike(albumId);

      if (response.success) {
        setLikesCount(response.data.likesCount);
        setIsLiked(false);

        const likedAlbums = getLikedAlbums();
        const updatedLikes = likedAlbums.filter((id) => id !== albumId);
        saveLikedAlbums(updatedLikes);
      }
    } catch (error) {
      console.error("Error unliking album:", error);
      toast.error("فشل في إلغاء الإعجاب");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = () => {
    if (isLiked) {
      handleUnlike();
    } else {
      handleLike();
    }
  };

  return {
    likesCount,
    isLiked,
    isLoading,
    toggleLike,
    handleLike,
    handleUnlike,
  };
};

export default useLikes;
