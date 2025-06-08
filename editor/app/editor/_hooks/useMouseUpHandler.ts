import { useCallback, RefObject } from "react";
import Konva from "konva";
import { usePresenceStore, useCanvasEditorStore } from "../_utils/zustand/konva/impl";
import { SelectionRectangle } from "../_utils/zustand/konva/types";

interface UseMouseUpHandlerProps {
  stageRef: RefObject<Konva.Stage | null>;
  selectionRectangle: SelectionRectangle;
  setSelectionRectangle: (rectangle: SelectionRectangle) => void;
  selectedSceneId: string;
}

export const useMouseUpHandler = ({ 
  stageRef, 
  selectionRectangle, 
  setSelectionRectangle,
  selectedSceneId 
}: UseMouseUpHandlerProps) => {
  const isSelecting = usePresenceStore((s) => s.isSelecting);
  const updateIsSelecting = usePresenceStore((s) => s.updateIsSelecting);
  const updateSelectedIds = usePresenceStore((s) => s.updateSelectedIds);
  const getSceneById = useCanvasEditorStore((s) => s.getSceneById);

  const handleMouseUp = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Do nothing if we didn't start selection
    if (e.evt.button === 2) {
      // Right click, do nothing
      console.log("Right click detected, ignoring mouse up event");
      e.evt.preventDefault();
      e.evt.stopPropagation();
      return;
    }

    if (!isSelecting) {
      return;
    }
    updateIsSelecting(false);

    const selBox = {
      x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
      y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
      width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
      height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
    };

    const selectedScene = getSceneById(selectedSceneId);
    if (!selectedScene) {
      console.error("Selected scene not found");
      return;
    }

    const selected = selectedScene.filter((compAttrs) => {
      // Check if rectangle intersects with selection box
      const compNode = stageRef.current?.findOne(`#${compAttrs.componentId}`);
      if (!compNode) {
        console.warn(`Component with id ${compAttrs.componentId} not found`);
        return false;
      }

      if (stageRef.current) {
        const compBox = compNode.getClientRect({
          relativeTo: stageRef.current,
        });
        return Konva.Util.haveIntersection(selBox, compBox);
      } else {
        console.error("Stage reference is not defined in handleMouseUp");
        return false;
      }
    });

    updateSelectedIds(selected.map((comp) => comp.componentId));

    // Update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      setSelectionRectangle({
        ...selectionRectangle,
        visible: false,
      });
    }, 100);
  }, [
    isSelecting, 
    updateIsSelecting, 
    updateSelectedIds, 
    getSceneById, 
    selectedSceneId, 
    stageRef, 
    selectionRectangle, 
    setSelectionRectangle
  ]);

  return { handleMouseUp };
};
