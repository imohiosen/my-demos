import { useCallback } from "react";
import Konva from "konva";
import { usePresenceStore } from "../_utils/zustand/konva/impl";
import { SelectionRectangle } from "../_utils/zustand/konva/types";

interface UseMouseDownHandlerProps {
  setSelectionRectangle: (rectangle: SelectionRectangle) => void;
}

export const useMouseDownHandler = ({ setSelectionRectangle }: UseMouseDownHandlerProps) => {
  const updateIsSelecting = usePresenceStore((s) => s.updateIsSelecting);

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Do nothing if we mousedown on any shape
    if (e.target !== e.target.getStage()) {
      return;
    }

    // if context menu mouse down, do nothing
    if (e.evt.button === 2) {
      // Right click, do nothing
      console.log("Right click detected, ignoring mouse down event");
      e.evt.preventDefault();
      e.evt.stopPropagation();
      return;
    }

    // Start selection rectangle
    updateIsSelecting(true);
    const stage = e.target.getStage();
    if (!stage) {
      console.error("Stage is not defined in handleMouseDown");
      return;
    }

    // Get relative position to stage (accounting for zoom and pan)
    const pos = stage.getRelativePointerPosition();
    if (!pos) {
      console.error("Pointer position is null");
      return;
    }

    setSelectionRectangle({
      visible: true,
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y,
    });
  }, [updateIsSelecting, setSelectionRectangle]);

  return { handleMouseDown };
};
