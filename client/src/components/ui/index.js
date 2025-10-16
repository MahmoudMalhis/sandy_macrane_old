// client/src/components/ui/index.js
export { default as AnimatedSection } from "./AnimatedSection";
export { default as PageHero } from "./PageHero";
export { default as FilterBar } from "./FilterBar";
export {
  BaseCard,
  ImageCard,
  AlbumCard,
  ReviewCard,
  ContactCard,
  StatsCard,
} from "./Cards";

// client/src/components/forms/index.js
export { default as UnifiedForm } from "./UnifiedForm";
export { default as FormModal } from "../common/FormModal";

// client/src/components/admin/index.js
export { default as SettingsLayout } from "./settings/SettingsLayout";
export { default as AdminLayout } from "./AdminLayout";
export { default as ProtectedRoute } from "./ProtectedRoute";

// client/src/hooks/index.js
export { useApi } from "./useApi";
export { usePagination } from "./usePagination";
export { useFilter } from "./useFilter";
export { useSearch } from "./useSearch";
export { useModal } from "./useModal";
