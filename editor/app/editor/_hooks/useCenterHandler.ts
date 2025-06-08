import { useCallback, RefObject } from "react";
import Konva from "konva";
import { usePresenceStore } from "../_utils/zustand/konva/impl";

// Canvas dimensions
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

interface UseCenterHandlerProps {
  stageRef: RefObject<Konva.Stage | null>;
  containerRef: RefObject<HTMLDivElement | null>;
}

export const useCenterHandler = ({ stageRef, containerRef }: UseCenterHandlerProps) => {
  const updateStagePosition = usePresenceStore((s) => s.updateStagePosition);
  const updateStageScale = usePresenceStore((s) => s.updateStageScale);

  const handleCenter = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || !containerRef.current) return;

    const container = containerRef.current;
    const fitScale = Math.min(
      container.clientWidth / CANVAS_WIDTH,
      container.clientHeight / CANVAS_HEIGHT
    );

    stage.scale({ x: fitScale, y: fitScale });

    stage.position({
      x: container.clientWidth / 2,
      y: container.clientHeight / 2,
    });

    updateStagePosition({
      x: container.clientWidth / 2,
      y: container.clientHeight / 2,
    });
    updateStageScale({
      x: fitScale,
      y: fitScale,
    });
  }, [stageRef, containerRef, updateStagePosition, updateStageScale]);

  return { handleCenter };
};
