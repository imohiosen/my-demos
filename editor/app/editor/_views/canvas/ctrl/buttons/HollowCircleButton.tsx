"use client";
import { useUIConfigStore } from "@/app/editor/_utils/zustand/konva/impl";
import { DComponent } from "@/app/editor/_utils/zustand/konva/types";
import Konva from "konva";
import Image from "next/image";

const predefinedComponent = new Konva.Circle({
  x: 0,
  y: 0,
  radius: 100,
  fill: "transparent",
  stroke: "black",
  strokeWidth: 3,
  type: "circle",
});

type Props = {
  insertFn: (element: DComponent) => void;
  postClick: () => void;
  selectedSceneId: string;
};

const HollowCircleButton = (props: Props) => {
  const config = useUIConfigStore((state) => state);

  const handleAddElement = () => {
    const id = `element-hollow-circle-${Date.now()}`;
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
      className="border-1 border-transparent hover:border-1 hover:border-primary bg-primary/10 rounded-xl flex items-center justify-center size-24"
      onClick={handleAddElement}
    >
      <Image
        src={predefinedComponent.toDataURL()}
        alt="Hollow Circle"
        width={config.ADD_CANVAS_COMPONENT_BUTTON_SIZE}
        height={config.ADD_CANVAS_COMPONENT_BUTTON_SIZE}
      />
    </button>
  );
};

export default HollowCircleButton;
