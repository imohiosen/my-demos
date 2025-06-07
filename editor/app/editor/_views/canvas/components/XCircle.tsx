import { NodeConfig } from "konva/lib/Node";
import { CircleConfig } from "konva/lib/shapes/Circle";
import { useEffect, useRef, useState } from "react";
import { Circle, Transformer } from "react-konva";
import Konva from "konva";
import { useCanvasEditorStore } from "@/app/editor/_utils/zustand/konva/impl";
import X from "./X";
import { DElementProps } from "@/app/editor/_utils/zustand/konva/types";

type Props = CircleConfig & NodeConfig & DElementProps;

const XCircle = (props: Props) => {

  return (
    <>
      {/* Main circle */}
      <X selection={{
        stageId: props.sceneId!,
        componentId: props.componentId,
        groupId: props.groupId,
      }}>
        <Circle {...props}/>
      </X>  

    </>
  );
};

export default XCircle;
