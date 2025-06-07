"use client";;
import { Button } from "@/components/ui/button";
import { LucideRedo } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DComponent } from "../../_utils/zustand/konva/types";
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
