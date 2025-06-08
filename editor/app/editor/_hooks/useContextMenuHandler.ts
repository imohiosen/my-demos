import { useCallback } from "react";
import Konva from "konva";
import { SelectionRectangle } from "../_utils/zustand/konva/types";

interface UseContextMenuHandlerProps {
  selectionRectangle: SelectionRectangle;
  setSelectionRectangle: (rectangle: SelectionRectangle) => void;
}

export const useContextMenuHandler = ({ selectionRectangle, setSelectionRectangle }: UseContextMenuHandlerProps) => {
  const handleContextMenu = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    e.evt.stopPropagation();

    setSelectionRectangle({
      ...selectionRectangle,
      visible: false,
    });

    const contextMenuEvent = new CustomEvent("X:CanvasContextMenuEvent", {
      detail: {
        clientX: e.evt.clientX,
        clientY: e.evt.clientY,
      },
    });
    document.dispatchEvent(contextMenuEvent);
  }, [selectionRectangle, setSelectionRectangle]);

  return { handleContextMenu };
};
