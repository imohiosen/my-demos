import { useCallback, RefObject } from "react";
import Konva from "konva";
import { usePresenceStore } from "../_utils/zustand/konva/impl";

interface UseDragHandlerProps {
  stageRef: RefObject<Konva.Stage | null>;
  containerRef: RefObject<HTMLDivElement | null>;
}

export const useDragHandler = ({ stageRef, containerRef }: UseDragHandlerProps) => {
  const updateStagePosition = usePresenceStore((s) => s.updateStagePosition);

  const handleDrag = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || !containerRef.current) return;

    const pos = stage.getPosition();
    updateStagePosition(pos);
  }, [stageRef, containerRef, updateStagePosition]);

  return { handleDrag };
};
