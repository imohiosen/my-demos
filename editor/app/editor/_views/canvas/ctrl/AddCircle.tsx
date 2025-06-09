
import Konva from "konva";
import Image from "next/image";

const c = new Konva.Circle({
  x: 0,
  y: 0,
  radius: 100,
  fill: "black",
  type: "circle",
});

type Props = {
  insertFn: (element: any) => void;
  postClick: () => void;
  selectedSceneId?: string;
};

const CircleButton = (props: Props) => {

  const handleAddElement = () => {
    const id = `element-circle-${Date.now()}`;
    props.insertFn({
      componentId: id,
      sceneId: props.selectedSceneId,
      type: "element",
      element: {
        attribute: { ...c.attrs },
      },
    });
    props.postClick();
  };

  return (
    <button
      className="border-1 border-transparent hover:border-1 hover:border-primary bg-primary/10 rounded-xl flex items-center justify-center p-2 m-2"
      onClick={handleAddElement}
    >
      <Image src={c.toDataURL()} alt="Circle" width={100} height={100} />
    </button>
  );
};

export default CircleButton;