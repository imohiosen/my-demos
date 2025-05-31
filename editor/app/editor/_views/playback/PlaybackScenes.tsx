"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { LucidePlay, LucidePlus } from "lucide-react";
import PlaybackScene from "./PlaybackScene";
import { useCanvasStore } from "../../_utils/zustand/canvas/canvasStore";
import { useCanvasEditorStore } from "../../_utils/zustand/konva/impl";

type Props = {
};

// react functional component
const PlaybackScenes = (props: Props) => {
  const addScene = useCanvasEditorStore((state) => state.addStage);
  const scenes = useCanvasEditorStore((state) => state.current.stages);


  // Convert scenes object to array for rendering
  const sceneArray = Object.values(scenes || []);

  const handleAddScene = () => {
    addScene();
  };

  return (
    <div className="h-full flex flex-row items-center px-4 justify-between gap-6 m-0 p-0 ">
      <Button className="rounded-full" variant={"outline"} size={"icon"}>
        <LucidePlay />
      </Button>
      <ScrollArea className="flex-1 mx-4 w-[60%]">
        <div className=" flex flex-row items-center gap-2 h-[160px] m-0 p-0">
          {sceneArray.map((scene) => (
            <PlaybackScene key={scene.id} sceneId={scene.id} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Button
        className="rounded-full shadow"
        variant={"default"}
        size={"icon"}
        onClick={handleAddScene}
      >
        <LucidePlus /> 
      </Button>
    </div>
  );
};

export default PlaybackScenes;
