"use client";
import {
  useCanvasEditorStore,
  usePresenceStore,
} from "@/app/editor/_utils/zustand/konva/impl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import CircleButton from "./buttons/CircleButton";
import RectangleButton from "./buttons/RectangleButton";
import SquareButton from "./buttons/SquareButton";
import TriangleButton from "./buttons/TriangleButton";
import LineButton from "./buttons/LineButton";
import ArrowButton from "./buttons/ArrowButton";
import HollowCircleButton from "./buttons/HollowCircleButton";
import HollowRectangleButton from "./buttons/HollowRectangleButton";
import HollowSquareButton from "./buttons/HollowSquareButton";
import HollowTriangleButton from "./buttons/HollowTriangleButton";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const AddElementView = (props: Props) => {
  const addElement = useCanvasEditorStore((state) => state.addElement);
  const renderCanvas = usePresenceStore((state) => state.renderCanvas);
  const selectedSceneId = usePresenceStore((state) => state.selectedStageId);

  return (
    <div className={props.className + " "}>
      <Popover>
        <PopoverTrigger asChild>{props.children}</PopoverTrigger>
        <PopoverContent className=" p-6 w-fit">
          <div className="flex flex-col gap-2">
            <Tabs defaultValue="shapes" className="">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="shapes">Shapes</TabsTrigger>
                    <TabsTrigger value="icons">Icons</TabsTrigger>
                    <TabsTrigger value="illustrations">
                      Illustrations
                    </TabsTrigger>
                    <TabsTrigger value="gif">GIFs & Stickers</TabsTrigger>
                  </TabsList>
                </div>
                <div>
                  <TabsContent value="shapes">
                    <div className="">
                      <div>
                        <div className="grid grid-cols-5 gap-2">
                          <CircleButton
                            insertFn={addElement}
                            postClick={renderCanvas}
                            selectedSceneId={selectedSceneId!}
                          />
                          <RectangleButton
                            insertFn={addElement}
                            postClick={renderCanvas}
                            selectedSceneId={selectedSceneId!}
                          />
                          <SquareButton
                            insertFn={addElement}
                            postClick={renderCanvas}
                            selectedSceneId={selectedSceneId!}
                          />
                          <TriangleButton
                            insertFn={addElement}
                            postClick={renderCanvas}
                            selectedSceneId={selectedSceneId!}
                          />
                          <HollowCircleButton
                            insertFn={addElement}
                            postClick={renderCanvas}
                            selectedSceneId={selectedSceneId!}
                          />
                          <HollowRectangleButton
                            insertFn={addElement}
                            postClick={renderCanvas}
                            selectedSceneId={selectedSceneId!}
                          />
                          <HollowSquareButton
                            insertFn={addElement}
                            postClick={renderCanvas}
                            selectedSceneId={selectedSceneId!}
                          />
                          <HollowTriangleButton
                            insertFn={addElement}
                            postClick={renderCanvas}
                            selectedSceneId={selectedSceneId!}
                          />
                          <LineButton
                            insertFn={addElement}
                            postClick={renderCanvas}
                            selectedSceneId={selectedSceneId!}
                          />
                          <ArrowButton
                            insertFn={addElement}
                            postClick={renderCanvas}
                            selectedSceneId={selectedSceneId!}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="icons">
                    <div className="p-4">Icons will be added here</div>
                  </TabsContent>
                  <TabsContent value="illustrations">
                    <div className="p-4">Illustrations will be added here</div>
                  </TabsContent>
                  <TabsContent value="gif">
                    <div className="p-4">GIFs will be added here</div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddElementView;
