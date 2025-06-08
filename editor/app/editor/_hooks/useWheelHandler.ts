import { useCallback, RefObject } from "react";
import Konva from "konva";
import { usePresenceStore } from "../_utils/zustand/konva/impl";

// Constants for zoom functionality
const MAX_ZOOM_RATIO = 10;
const MIN_ZOOM_RATIO = 0.1;
const ZOOM_SCALE_FACTOR = 1.1;

interface UseWheelHandlerProps {
  stageRef: RefObject<Konva.Stage | null>;
}

export const useWheelHandler = ({ stageRef }: UseWheelHandlerProps) => {
  const updateStagePosition = usePresenceStore((s) => s.updateStagePosition);
  const updateStageScale = usePresenceStore((s) => s.updateStageScale);

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    let newScale =
      direction > 0
        ? oldScale * ZOOM_SCALE_FACTOR
        : oldScale / ZOOM_SCALE_FACTOR;

    newScale = Math.max(MIN_ZOOM_RATIO, Math.min(MAX_ZOOM_RATIO, newScale));

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    updateStagePosition(newPos);
    updateStageScale({
      x: newScale,
      y: newScale,
    });
  }, [stageRef, updateStagePosition, updateStageScale]);

  return { handleWheel };
};
