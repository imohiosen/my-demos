import { Rect } from "react-konva";

interface SelectionRectangleProps {
  visible: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const SelectionRectangle = ({ visible, x1, y1, x2, y2 }: SelectionRectangleProps) => {
  if (!visible) return null;

  return (
    <Rect
      x={Math.min(x1, x2)}
      y={Math.min(y1, y2)}
      width={Math.abs(x2 - x1)}
      height={Math.abs(y2 - y1)}
      stroke="rgba(0, 0, 255, 0.5)"
      strokeWidth={2}
      fill="rgba(0,0,255,0.2)"
    />
  );
};

export default SelectionRectangle;
