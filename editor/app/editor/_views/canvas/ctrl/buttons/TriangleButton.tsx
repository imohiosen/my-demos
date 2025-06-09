"use client";


import { useUIConfigStore } from "@/app/editor/_utils/zustand/konva/impl";
import { DComponent } from "@/app/editor/_utils/zustand/konva/types";
import Konva from "konva";
import Image from "next/image";

const predefinedComponent = new Konva.Line({
  x: 0,
  y: 0,
  points: [50, 0, 0, 86, 100, 86],
  fill: "black",
  stroke: "black",
  strokeWidth: 2,
  closed: true,
  type: "line",
});

type Props = {
  insertFn: (element: DComponent) => void;
  postClick: () => void;
  selectedSceneId: string;
};

const TriangleButton = (props: Props) => {
  const config = useUIConfigStore((state) => state);

  const handleAddElement = () => {
    const id = `element-triangle-${Date.now()}`;
    props.insertFn({
      componentId: id,
      sceneId: props.selectedSceneId,
      type: "element",
      element: {
        attribute: { ...predefinedComponent.attrs },
      },
    });
    props.postClick();
  };

  return (
    <button
      className="border-1 border-transparent hover:border-1 hover:border-primary bg-primary/10 rounded-xl flex items-center justify-center p-2 m-2"
      onClick={handleAddElement}
    >
      <Image
        src={predefinedComponent.toDataURL()}
        alt="Triangle"
        width={config.ADD_CANVAS_COMPONENT_BUTTON_SIZE}
        height={config.ADD_CANVAS_COMPONENT_BUTTON_SIZE}
      />
    </button>
  );
};

export default TriangleButton;
