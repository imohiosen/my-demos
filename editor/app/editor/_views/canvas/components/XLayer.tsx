import React, { useEffect } from "react";
import XGroup from "./XGroup";
import { Layer } from "react-konva";
import { DGroup, DLayer, DStage } from "@/app/editor/_utils/zustand/konva/store";
import XElement from "./XElement";
import { useCanvasEditorStore } from "@/app/editor/_utils/zustand/konva/impl";

type Props = {
  layer: DLayer;
  currentStage: DStage;
};

const XLayer = (props: Props) => {


    const { layer, currentStage } = props;

    


  return (
    <Layer key={layer.id} {...layer.attributes}>
      {layer.groups.map((group) => {
        return (
          
        );
      })}
    </Layer>
  );
};

export default XLayer;
