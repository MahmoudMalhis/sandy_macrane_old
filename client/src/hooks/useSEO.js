// hooks/useSEO.js
import { useEffect } from "react";

export const useSEO = (pageData) => {
  useEffect(() => {
    if (pageData) {
      // تحديث title
      document.title = pageData.title || "Sandy Macrame";

      // تحديث meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", pageData.description || "");

      // تحديث meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", pageData.keywords || "");
    }
  }, [pageData]);
};
