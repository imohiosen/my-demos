import { NodeConfig } from "konva/lib/Node";
import { CircleConfig } from "konva/lib/shapes/Circle";
import { useEffect, useRef, useState } from "react";
import { Group, Circle, Rect } from "react-konva";
import Konva from "konva";

type Props = CircleConfig & NodeConfig;

const XCircle = (props: Props) => {
  const groupRef = useRef<Konva.Group>(null);
  const circleRef = useRef<Konva.Circle>(null);
  const [showOutline, setShowOutline] = useState(false);

  useEffect(() => {
    // This effect runs once when the component mounts
    if (circleRef.current) {
      console.log("Circle ref:", circleRef.current.attrs);
    }
  }, []);

  const handleMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    console.log("Mouse over circle", e);
    setShowOutline(true);
  };

  const handleMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => {
    console.log("Mouse out circle", e);
    setShowOutline(false);
  };

  // Get the bounding rect of the rendered circle
  const getBoundingRect = () => {
    if (circleRef.current) {
      return { 
        x: circleRef.current.attrs.x - circleRef.current.attrs.radius, 
        y: circleRef.current.attrs.y - circleRef.current.attrs.radius, 
        width: circleRef.current.attrs.radius * 2, 
        height: circleRef.current.attrs.radius * 2 
      };
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  };

  // Extract position and size props
  const { x = 0, y = 0, radius = 50, ...restProps } = props;

  return (
    <Group 
      ref={groupRef}
      draggable
      onMouseOver={handleMouseOver}
      onMouseEnter={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseLeave={handleMouseOut}
    >
      {/* Main circle */}
      <Circle
        ref={circleRef}
        x={x}
        y={y}
        radius={radius}
        {...restProps}
        draggable={false}
      />
      
      {/* Outline rectangle - only show when hovering */}
      {showOutline && (
        <Rect
          {...(() => {
            const boundingRect = getBoundingRect();
            return {
              x: boundingRect.x,
              y: boundingRect.y,
              width: boundingRect.width,
              height: boundingRect.height,
            };
          })()}
          fill="transparent"
          stroke="rgba(0, 123, 255, 1)"
          strokeWidth={2}
          draggable={false}
          listening={false}
          perfectDrawEnabled={false}
        />
      )}
    </Group>
  );
};

export default XCircle;