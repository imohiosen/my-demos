import { useCallback } from "react";
import Konva from "konva";
import { usePresenceStore } from "../_utils/zustand/konva/impl";
import { SelectionRectangle } from "../_utils/zustand/konva/types";

interface UseStageClickHandlerProps {
  selectionRectangle: SelectionRectangle;
}

export const useStageClickHandler = ({ selectionRectangle }: UseStageClickHandlerProps) => {
  const selectedIds = usePresenceStore((s) => s.selectedIds);
  const updateSelectedIds = usePresenceStore((s) => s.updateSelectedIds);

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // If we are selecting with rect, do nothing
    if (e.evt.button === 2) {
      // Right click, do nothing
      console.log("Right click detected, ignoring stage click event");
      e.evt.preventDefault();
      e.evt.stopPropagation();
      return;
    }

    if (selectionRectangle.visible) {
      return;
    }

    if (e.target === e.target.getStage()) {
      updateSelectedIds([]);
      return;
    }

    const clickedId = e.target.id();

    // Do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectedIds.includes(clickedId);

    if (!metaPressed && !isSelected) {
      // If no key pressed and the node is not selected
      // select just one
      updateSelectedIds([clickedId]);
    } else if (metaPressed && isSelected) {
      // If we pressed keys and node was selected
      // we need to remove it from selection
      updateSelectedIds(selectedIds.filter((id) => id !== clickedId));
    } else if (metaPressed && !isSelected) {
      // Add the node into selection
      updateSelectedIds([...selectedIds, clickedId]);
    }
  }, [selectionRectangle.visible, selectedIds, updateSelectedIds]);

  return { handleStageClick };
};
