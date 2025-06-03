import { Rect } from "react-konva";

type Props =  {
  boundingRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  shouldDisplay?: boolean;
};

const XOutline = (props: Props) => {

  if (!props.shouldDisplay) 
    return null;
  return (
    <Rect
          {...props.boundingRect}
          fill="transparent"
          stroke="rgba(0, 123, 255, 1)"
          strokeWidth={2}
          draggable={false}
          listening={false}
          perfectDrawEnabled={false}
        />
  );
};

export default XOutline;