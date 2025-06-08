import { useCallback, RefObject } from "react";
import Konva from "konva";
import { usePresenceStore } from "../_utils/zustand/konva/impl";
import { SelectionRectangle } from "../_utils/zustand/konva/types";

interface UseMouseMoveHandlerProps {
  containerRef: RefObject<HTMLDivElement | null>;
  selectionRectangle: SelectionRectangle;
  setSelectionRectangle: (rectangle: SelectionRectangle) => void;
}

export const useMouseMoveHandler = ({ 
  containerRef, 
  selectionRectangle, 
  setSelectionRectangle 
}: UseMouseMoveHandlerProps) => {
  const updateCursorPosition = usePresenceStore((s) => s.updateCursorPosition);
  const isSelecting = usePresenceStore((s) => s.isSelecting);

  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    updateCursorPosition({
      x: e.evt.clientX - containerRef.current!.getBoundingClientRect().left,
      y: e.evt.clientY - containerRef.current!.getBoundingClientRect().top,
    });

    // Do nothing if we didn't start selection
    if (!isSelecting) {
      return;
    }
    const stage = e.target.getStage();
    if (!stage) {
      console.error("Stage is not defined in handleMouseMove");
      return;
    }

    // Get relative position to stage (accounting for zoom and pan)
    const pos = stage.getRelativePointerPosition();
    if (!pos) {
      console.error("Pointer position is null in handleMouseMove");
      return;
    }

    setSelectionRectangle({
      ...selectionRectangle,
      x2: pos.x,
      y2: pos.y,
    });
  }, [containerRef, updateCursorPosition, isSelecting, selectionRectangle, setSelectionRectangle]);

  return { handleMouseMove };
};
