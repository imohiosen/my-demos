import { useCallback, RefObject } from "react";
import Konva from "konva";

// Canvas dimensions
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

interface UseExportImageHandlerProps {
  stageRef: RefObject<Konva.Stage | null>;
}

export const useExportImageHandler = ({ stageRef }: UseExportImageHandlerProps) => {
  const handleExportImage = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Get the current stage position and scale to calculate the canvas area
    const stagePosition = stage.position();
    const stageScale = stage.scaleX();

    // Calculate the actual canvas position in screen coordinates
    const canvasScreenX = stagePosition.x - (CANVAS_WIDTH / 2) * stageScale;
    const canvasScreenY = stagePosition.y - (CANVAS_HEIGHT / 2) * stageScale;

    const dataURL = stage.toDataURL({
      pixelRatio: 2, // Higher quality
      mimeType: "image/png",
      x: canvasScreenX,
      y: canvasScreenY,
      width: CANVAS_WIDTH * stageScale,
      height: CANVAS_HEIGHT * stageScale,
    });

    console.log("Exporting canvas background area with data URL:", dataURL);

    const link = document.createElement("a");
    link.download = "canvas-export.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [stageRef]);

  return { handleExportImage };
};
