import { useEffect, useRef, useState } from "react";
import { Transformer } from "react-konva";
import Konva from "konva";
import { useCanvasEditorStore } from "@/app/editor/_utils/zustand/konva/impl";
import React from "react";
import { Selection } from "@/app/editor/_utils/zustand/konva/types";


type Props =  {children: React.ReactNode; selection: Selection}

const Enhance = (props: Props) => {
  const nodeRef = useRef<Konva.Node>(null);
  const outlineRef = useRef<Konva.Transformer>(null);
  const mergeAttributes = useCanvasEditorStore(
    (state) => state.mergeAttributes
  );

  const [showOutline, setShowOutline] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {

    if (nodeRef.current && outlineRef.current) {
      outlineRef.current.nodes([nodeRef.current]);
      outlineRef.current.getLayer()?.batchDraw();
    }
  }, [nodeRef, outlineRef, props.children]);

  const handleDragMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setIsDragging(true);
  };
  const handleDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (nodeRef.current) {
      mergeAttributes(
        props.selection,
        {
          ...e.target.attrs,
        }
      );
    }

    setIsDragging(false);
  };
  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    if (nodeRef.current) {
      mergeAttributes(
        props.selection,
        {
          ...nodeRef.current.attrs,
        }
      );
    }
  };
  const handleMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) =>
    setShowOutline(true);
  const handleMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) =>
    setShowOutline(false);


  return (
    <>
      {React.cloneElement(props.children as React.ReactElement<any>, {
        ...props.selection,
        ref: nodeRef,
        draggable: true,
        onDragMove: handleDragMove,
        onDragEnd: handleDragEnd,
        onMouseOver: handleMouseOver,
        onMouseOut: handleMouseOut,
        onTransformEnd: handleTransformEnd,
      })}

      {/* Outline rectangle - only show when hovering */}
      <Transformer
        ref={outlineRef}
        rotateEnabled={false}
        enabledAnchors={[]}
        visible={showOutline || isDragging}
      />
    </>
  );
};

export default Enhance;
