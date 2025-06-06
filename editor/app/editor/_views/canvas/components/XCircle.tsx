import { NodeConfig } from "konva/lib/Node";
import { CircleConfig } from "konva/lib/shapes/Circle";
import { useEffect, useRef, useState } from "react";
import { Circle, Transformer } from "react-konva";
import Konva from "konva";
import { useCanvasEditorStore } from "@/app/editor/_utils/zustand/konva/impl";

type Props = CircleConfig & NodeConfig;

const XCircle = (props: Props) => {
  const circleRef = useRef<Konva.Circle>(null);
  const outlineRef = useRef<Konva.Transformer>(null);
  const mergeCircleAttrs = useCanvasEditorStore(state => state.mergeCircleAttrs);
  
  const [showOutline, setShowOutline] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // This effect runs once when the component mounts
    if (circleRef.current && outlineRef.current) {
      outlineRef.current.nodes([circleRef.current]);
      outlineRef.current.getLayer()?.batchDraw();
    }
  }
  , []);

  const handleCircleDragMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setIsDragging(true);
  };
  const handleCircleDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (circleRef.current) {
      mergeCircleAttrs({
        stageId: props.stageId,
        componentId: props.componentId,
        groupId: props.groupId,
      }, {
        ...e.target.attrs,
      });
    }
    setIsDragging(false);
  };
  const handleMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => setShowOutline(true);
  const handleMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => setShowOutline(false);

  // Extract position and size props

  return (
    <> 
      {/* Main circle */}
      <Circle
        ref={circleRef}
        {...props}
        draggable
        onMouseOver={handleMouseOver}
        onMouseEnter={handleMouseOver}
        onMouseOut={handleMouseOut}
        onMouseLeave={handleMouseOut}
        onDragMove={handleCircleDragMove}
        onDragEnd={handleCircleDragEnd}
      />
      
      {/* Outline rectangle - only show when hovering */}
      <Transformer 
        ref={outlineRef}
        anchorSize={8}
        // borderDash={[3, 3]}
        rotateEnabled={false}
        enabledAnchors={[]}
        boundBoxFunc={(oldBox, newBox) => {
          // Prevent resizing to negative dimensions
          if (newBox.width < 0 || newBox.height < 0) {
            return oldBox;
          }
          return newBox;
        }}
        visible={showOutline || isDragging}
      />
    </>
  );
};

export default XCircle;