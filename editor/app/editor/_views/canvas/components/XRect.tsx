import { NodeConfig } from "konva/lib/Node";
import { RectConfig } from "konva/lib/shapes/Rect";
import { useEffect, useRef, useState } from "react";
import { Rect } from "react-konva";
import Konva from "konva";
import XOutline from "./XOutline";
import XWrapper from "./XWrapper";

type Props = RectConfig & NodeConfig;

const XRect = (props: Props) => {
  const groupRef = useRef<Konva.Group>(null);
  const rectRef = useRef<Konva.Rect>(null);
  const [showOutline, setShowOutline] = useState(false);

  useEffect(() => {
    // This effect runs once when the component mounts
    if (rectRef.current) {
      console.log("Rect ref:", rectRef.current.attrs);
    }
  }, []);

  const handleMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    console.log("Mouse over rect", e);
    setShowOutline(true);
  };

  const handleMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => {
    console.log("Mouse out rect", e);
    setShowOutline(false);
  };

  // Get the bounding rect of the rendered rectangle
  const getBoundingRect = () => {
    if (rectRef.current) {
      return { 
        x: rectRef.current.attrs.x,
        y: rectRef.current.attrs.y,
        width: rectRef.current.attrs.width,
        height: rectRef.current.attrs.height,
    }
  }
    return { x: 0, y: 0, width: 0, height: 0 };
  };

  // Extract position and size props
  const { x = 0, y = 0, width = 100, height = 100, ...restProps } = props;

  return (
    <XWrapper 
      ref={groupRef}
      draggable
      onMouseOver={handleMouseOver}
      onMouseEnter={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseLeave={handleMouseOut}
    >
      {/* Main rectangle */}
      <Rect
        ref={rectRef}
        x={x}
        y={y}
        width={width}
        height={height}
        {...restProps}
        draggable={false}
      />
      
      {/* Outline rectangle - only show when hovering */}
      <XOutline
          boundingRect={getBoundingRect()}
          shouldDisplay={showOutline}
        />
    </XWrapper>
  );
};

export default XRect