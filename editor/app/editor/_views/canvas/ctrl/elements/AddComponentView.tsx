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
import ShapesTab from "./tabs/ShapesTab";
import IconsTab from "./tabs/IconsTab";
import IllustrationsTab from "./tabs/IllustrationsTab";
import GifsStickersTab from "./tabs/GifsStickersTab";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const AddComponentView = (props: Props) => {
  const addElement = useCanvasEditorStore((state) => state.addElement);
  const addMedia = useCanvasEditorStore((state) => state.addMedia);
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
                    <ShapesTab
                      addElement={addElement}
                      renderCanvas={renderCanvas}
                      selectedSceneId={selectedSceneId!}
                    />
                  </TabsContent>
                  <TabsContent value="icons">
                    <IconsTab
                      addMedia={addMedia}
                      renderCanvas={renderCanvas}
                      selectedSceneId={selectedSceneId!}
                    />
                  </TabsContent>
                  <TabsContent value="illustrations">
                    <IllustrationsTab
                      addElement={addElement}
                      renderCanvas={renderCanvas}
                      selectedSceneId={selectedSceneId!}
                    />
                  </TabsContent>
                  <TabsContent value="gif">
                    <GifsStickersTab
                      addElement={addElement}
                      renderCanvas={renderCanvas}
                      selectedSceneId={selectedSceneId!}
                    />
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

export default AddComponentView;
