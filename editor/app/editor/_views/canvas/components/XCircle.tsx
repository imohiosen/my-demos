import { NodeConfig } from "konva/lib/Node";
import { CircleConfig } from "konva/lib/shapes/Circle";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { Group, Circle } from "react-konva";
import Konva from "konva";
import XWrapper from "./XWrapper";
import XOutline from "./XOutline";
import { useCanvasEditorStore } from "@/app/editor/_utils/zustand/konva/impl";

type Props = CircleConfig & NodeConfig;

const XCircle = (props: Props) => {
  const groupRef = useRef<Konva.Group>(null);
  const circleRef = useRef<Konva.Circle>(null);
  const [showOutline, setShowOutline] = useState(false);
  const mergeCircleAttrs = useCanvasEditorStore(state => state.mergeCircleAttrs);

  useEffect(() => {
    // This effect runs once when the component mounts
    if (circleRef.current) {
      console.log("Circle ref:", circleRef.current.attrs);
    }
  }
  , []);

  const handleCircleDragMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (circleRef.current) {
      mergeCircleAttrs({
        stageId: props.stageId,
        componentId: props.componentId,
        type: "component",
        layerId: props.layerId,
        groupId: props.groupId,
      }, {
        ...getBoundingRect()
      });
    }
  };
  const handleCircleDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (circleRef.current) {
      
    }
  };
  const handleMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => setShowOutline(true);
  const handleMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => setShowOutline(false);

  // Get the bounding rect of the rendered circle
  const getBoundingRect = useCallback(() => {
    if (circleRef.current) {
      return { 
        x: circleRef.current.attrs.x - circleRef.current.attrs.radius, 
        y: circleRef.current.attrs.y - circleRef.current.attrs.radius, 
        width: circleRef.current.attrs.radius * 2, 
        height: circleRef.current.attrs.radius * 2 
      };
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  }, [circleRef]);

  // Extract position and size props
  const { x = 0, y = 0, radius = 50, ...restProps } = props;

  return (
    <XWrapper 
      ref={groupRef}
      draggable
      onMouseOver={handleMouseOver}
      onMouseEnter={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseLeave={handleMouseOut}
      onDragMove={handleCircleDragMove}
      onDragEnd={handleCircleDragEnd}
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
      <XOutline 
        boundingRect={getBoundingRect()}
        shouldDisplay={showOutline}
      />
    </XWrapper>
  );
};

export default XCircle;