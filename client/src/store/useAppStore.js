// client/src/store/useAppStore.js
import { create } from "zustand";

const useAppStore = create((set, get) => ({
  // Order Form State
  isOrderFormOpen: false,
  selectedAlbum: null,

  // Lightbox State
  isLightboxOpen: false,
  currentImages: [],
  currentImageIndex: 0,

  // Loading States
  isLoading: false,
  error: null,

  // Actions
  openOrderForm: (album = null) => {
    set({ isOrderFormOpen: true, selectedAlbum: album });
  },

  closeOrderForm: () => {
    set({ isOrderFormOpen: false, selectedAlbum: null });
  },

  openLightbox: (images, initialIndex = 0) => {
    set({
      isLightboxOpen: true,
      currentImages: images,
      currentImageIndex: initialIndex,
    });
  },

  closeLightbox: () => {
    set({
      isLightboxOpen: false,
      currentImages: [],
      currentImageIndex: 0,
    });
  },

  setCurrentImage: (index) => {
    const { currentImages } = get();
    if (index >= 0 && index < currentImages.length) {
      set({ currentImageIndex: index });
    }
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAppStore;
