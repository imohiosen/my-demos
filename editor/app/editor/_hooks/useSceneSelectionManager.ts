import { useEffect } from "react";

interface UseSceneSelectionManagerProps {
  selectedSceneId: string | null | undefined;
  updateSelectedIds: (ids: string[]) => void;
}

export const useSceneSelectionManager = ({
  selectedSceneId,
  updateSelectedIds,
}: UseSceneSelectionManagerProps) => {
  useEffect(() => {
    updateSelectedIds([]);
  }, [selectedSceneId, updateSelectedIds]);
};
