"use client";
import { Button } from "@/components/ui/button";
import { LucideRedo } from "lucide-react";
import { useCanvasStore } from "../../_utils/zustand/canvas/canvasStore";

type Props = {
  sceneId: string;
};

// react functional component
const PlaybackScene = ({ sceneId }: Props) => {
  const selectedSceneId = useCanvasStore((state) => state.present.selectedSceneId);
  const isSelected = selectedSceneId === sceneId;
  const selectScene = useCanvasStore((state) => state.selectScene);

  const handleClick = () => {
    selectScene(sceneId);
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
