import { useUIConfigStore } from "@/app/editor/_utils/zustand/konva/impl";
import { DComponent } from "@/app/editor/_utils/zustand/konva/types";
import Konva from "konva";
import Image from "next/image";

const predefinedComponent = new Konva.Rect({
  x: 0,
  y: 0,
  width: 150,
  height: 100,
  fill: "black",
  type: "rect",
});

type Props = {
  insertFn: (element: DComponent) => void;
  postClick: () => void;
  selectedSceneId: string;
};

const RectangleButton = (props: Props) => {
  const config = useUIConfigStore((state) => state);

  const handleAddElement = () => {
    const id = `element-rectangle-${Date.now()}`;
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
        alt="Rectangle"
        width={config.ADD_CANVAS_COMPONENT_BUTTON_SIZE}
        height={config.ADD_CANVAS_COMPONENT_BUTTON_SIZE}
      />
    </button>
  );
};

export default RectangleButton;
