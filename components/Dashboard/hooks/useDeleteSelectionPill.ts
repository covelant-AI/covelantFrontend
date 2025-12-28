import { useEffect, useState } from "react";

export function useDeleteSelectionPill(selectionMode: boolean) {
  const [showDeletePill, setShowDeletePill] = useState(false);
  const [deleteBtnVisible, setDeleteBtnVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (selectionMode) {
      setShowDeletePill(true);
      setDeleteBtnVisible(false);
      const id = requestAnimationFrame(() => setDeleteBtnVisible(true));
      return () => cancelAnimationFrame(id);
    }

    setDeleteBtnVisible(false);
    timeout = setTimeout(() => setShowDeletePill(false), 220);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [selectionMode]);

  return { showDeletePill, deleteBtnVisible };
}
