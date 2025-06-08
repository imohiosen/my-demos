import { RefObject, useCallback } from "react";

// Constants for initial scale calculation
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

interface UseInitialScaleProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export const useInitialScale = ({ containerRef }: UseInitialScaleProps) => {
  const getInitialScale = useCallback(() => {
    if (!containerRef.current) return 1;
    return Math.min(
      containerRef.current.clientWidth / CANVAS_WIDTH,
      containerRef.current.clientHeight / CANVAS_HEIGHT
    );
  }, [containerRef]);

  return { getInitialScale };
};
