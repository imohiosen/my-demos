"use client";;
import { Button } from "@/components/ui/button";
import { Stage } from "konva/lib/Stage";
import { LucideRedo } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DComponent } from "../../_utils/zustand/konva/types";
import Konva from "konva";
import React from "react";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
type Props = {
  sceneId: string;
  selectedStageId?: string;
  updateSelectedStageId: (id: string) => void;
  scene: DComponent[]
};

// react functional component
const PlaybackScene = ({ 
  sceneId,
  selectedStageId,
  updateSelectedStageId,
  scene,
 }: Props) => {
  
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const ref = React.useRef<HTMLDivElement>(null);

  const isSelected = selectedStageId === sceneId;

  useEffect(() => {
    if (ref.current && isSelected) {
      ref.current.focus();
    }
  }, [ref, isSelected, sceneId]);


  const handleClick = useCallback(() => {
    updateSelectedStageId(sceneId);
  }, [sceneId, updateSelectedStageId]);

  const generateThumbnail = useCallback(() => {
    // Create a temporary stage for thumbnail generation
    const tempContainer = document.createElement("div");
    const tempStage = new Stage({
      container: tempContainer,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });

    const layer = new Konva.Layer({
      listening: false, // Disable interaction for the thumbnail
    });
    tempStage.add(layer);

    // Render scene components
    for (const component of scene) {
      if (component.type === "element") {
        // Create Konva objects based on component data
      }
    }

    // Generate thumbnail data URL
    const dataURL = tempStage.toDataURL({
      pixelRatio: 0.2, // Lower resolution for thumbnail
      mimeType: "image/png",
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });

    // Clean up temporary stage
    tempStage.destroy();
    tempContainer.remove();

    return dataURL;
  }, [scene]);

  useEffect(() => {
    if (scene.length > 0) {
      const thumbnail = generateThumbnail();
      setThumbnailUrl(thumbnail);
    }
  }, [scene, generateThumbnail]);

  return (
    <>
      <div className="h-full flex flex-row items-center justify-center m-2" ref={ref}>
        <div
          className={`aspect-video bg-gray-100 border h-[60%] relative playback-scene cursor-pointer transition-all duration-200 ${
            isSelected
              ? "outline outline-primary outline-offset-2"
              : "hover:border-gray-300"
          }`}
          onClick={handleClick}
          style={{
            backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
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
