import { RefObject, useEffect } from "react";

interface UseViewportUpdaterProps {
  containerRef: RefObject<HTMLDivElement | null>;
  updateStageViewBox: (viewBox: { x: number; y: number }) => void;
}

export const useViewportUpdater = ({ containerRef, updateStageViewBox }: UseViewportUpdaterProps) => {
  useEffect(() => {
    const updateViewport = () => {
      if (containerRef.current) {
        updateStageViewBox({
          x: containerRef.current.clientWidth,
          y: containerRef.current.clientHeight,
        });
      }
    };

    updateViewport();

    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [containerRef, updateStageViewBox]);
};
