"use client";;
import { Button } from "@/components/ui/button";
import { Stage } from "konva/lib/Stage";
import { LucideRedo } from "lucide-react";
import { useCallback } from "react";
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
type Props = {
  sceneId: string;
  selectedStageId?: string;
  updateSelectedStageId: (id: string) => void;
};

// react functional component
const PlaybackScene = ({ 
  sceneId,
  selectedStageId,
  updateSelectedStageId
 }: Props) => {
  
  const isSelected = selectedStageId === sceneId;

  const handleClick = useCallback(() => {
    updateSelectedStageId(sceneId);
  }, [sceneId, updateSelectedStageId]);

  const getThumbnailStringData = (stage: Stage) => {

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

    return dataURL;

  };

  return (
    <>
      <div className="h-full flex flex-row items-center justify-center m-2">
        <div
          className={`aspect-video bg-gray-100 border h-[60%] relative playback-scene cursor-pointer transition-all duration-200 ${
            isSelected
              ? "outline outline-primary outline-offset-2"
              : "hover:border-gray-300"
          }`}
          onClick={handleClick}
        >
        {/* // todo instantiat scene from DComponentList, then getThumbnail data and display it as background image  like thumbnail*/}

          <Button
            variant={"outline"}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2/3 rounded-full opacity-0 hover:opacity-100 active:opacity-100"
            size={"icon"}
          >
            <LucideRedo />
          </Button>
        </div>
      </div>
    </>
  );
};

export default PlaybackScene;
