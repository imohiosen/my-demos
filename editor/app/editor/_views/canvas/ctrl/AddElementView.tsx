"use client";
import {
  useCanvasEditorStore,
  usePresenceStore,
  useUIConfigStore,
} from "@/app/editor/_utils/zustand/konva/impl";
import { useStageRefState } from "@/app/editor/_utils/zustand/konva/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Konva from "konva";
import React from "react";
import Image from "next/image";
import CircleButton from "./buttons/CircleButton";
import { Rectangle } from "recharts";
import RectangleButton from "./buttons/RectangleButton";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const AddElementView = (props: Props) => {

  const addElement = useCanvasEditorStore((state) => state.addElement);
  const renderCanvas = usePresenceStore((state) => state.renderCanvas);
  const selectedSceneId = usePresenceStore((state) => state.selectedStageId);


  return (
    !selectedSceneId || <div className={props.className}>
      <Popover>
        <PopoverTrigger asChild>{props.children}</PopoverTrigger>
        <PopoverContent className=" p-4">
          <div className="flex flex-col gap-2 ">
            <Tabs defaultValue="shapes" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="shapes">Shapes</TabsTrigger>
                <TabsTrigger value="frames">Frames</TabsTrigger>
                <TabsTrigger value="stickers">Stickers</TabsTrigger>
                <TabsTrigger value="icons">Icons</TabsTrigger>
              </TabsList>
              <TabsContent value="shapes">
                <div className="flex flex-row justify-between">
                  <CircleButton 
                    insertFn={addElement}
                    postClick={renderCanvas}
                    selectedSceneId={selectedSceneId}
                  />
                  <RectangleButton
                    insertFn={addElement}
                    postClick={renderCanvas}
                    selectedSceneId={selectedSceneId}
                  />
                </div>
              </TabsContent>
              <TabsContent value="icons">
                <div>icons</div>
              </TabsContent>
              <TabsContent value="frames">
                <div>frames</div>
              </TabsContent>
              <TabsContent value="stickers">
                <div>filled</div>
              </TabsContent>
            </Tabs>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddElementView;
