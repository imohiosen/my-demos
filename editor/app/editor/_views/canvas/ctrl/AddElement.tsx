"use client";
import { useCanvasEditorStore } from "@/app/editor/_utils/zustand/konva/impl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
};
const AddElement = (props: Props) => {




  return (
    <div className={props.className}>
      <Popover>
        <PopoverTrigger asChild>{props.children}</PopoverTrigger>
        <PopoverContent className="w-150 p-2">
          <div className="flex flex-col gap-2 shape p-4">
            <Tabs defaultValue="shapes" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="shapes">Shapes</TabsTrigger>
                <TabsTrigger value="frames">Frames</TabsTrigger>
                <TabsTrigger value="stickers">Stickers</TabsTrigger>
                <TabsTrigger value="icons">Icons</TabsTrigger>
              </TabsList>
              <TabsContent value="shapes">
                  <div className="flex flex-row justify-between p-4">
                    <CircleButton />
                    <RectangleButton />
                    <SquareButton />
                    <TriangleButton />
                  </div>
                  <div className="flex flex-row justify-between p-4">
                    <CircleButton />
                    <RectangleButton />
                    <SquareButton />
                    <TriangleButton />
                  </div>
                  <div className="flex flex-row justify-between p-4">
                    <CircleButton />
                    <RectangleButton />
                    <SquareButton />
                    <TriangleButton />
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

export default AddElement;

import React from "react";

type Props = {};

const CircleButton = () => {
  const addElement = useCanvasEditorStore(state => state.addElement);
  const getCurrentLayerSelection = useCanvasEditorStore(state => state.getCurrentLayerSelection);

  const handleAddElement = () => {
    // alert("Adding element");
    // addElement({
    //   id: `element-circle-${Date.now()}`,
    //   type: "element",
    //   element: {
    //     attribute: {
    //       x: 0,
    //       y: 0,
    //     }
    //   },
    // }, getCurrentLayerSelection());
  };

  return (
    <button className="border-1 border-transparent hover:border-1 hover:border-primary bg-primary/10 rounded-xl flex items-center justify-center p-2 m-2"

      onClick={() => {
        alert("Adding element");
      }}  
    >  
      <div className="w-12 h-24 bg-primary rounded-full"></div>
    </button>
  );
};
const RectangleButton = () => {
  return <CircleButton />;
};
const SquareButton = () => {
  return <CircleButton />;
};
const TriangleButton = () => {
  return <CircleButton />;
};
const LineButton = () => {
  return <CircleButton />;
};

const FilledCircleButton = () => {
  return <CircleButton />;
};
const FilledRectangleButton = () => {
  return <CircleButton />;
};
const FilledSquareButton = () => {
  return <CircleButton />;
};
const FilledTriangleButton = () => {
  return <CircleButton />;
};
const ArrowButton = () => {
  return <CircleButton />;
};
