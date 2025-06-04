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

    

    useEffect(() => {
      // This effect runs when the layer or currentStage changes
      console.log("XLayer updated:", layer.id, "Stage:", currentStage.id);
    }, [layer.groups.length]);
    console.log(layer.groups.length)

  return (
    <Layer key={layer.id} {...layer.attributes}>
      {layer.groups.map((group) => {
        return (
          <XGroup key={group.id} {...group.attributes} draggable={true}>
            {group.components.map((component) => {
              return (
                component.type === "element" &&
                component.element && (
                  <XElement
                    key={component.id}
                    {...component.element.attribute}
                    groupId={group.id}
                    layerId={layer.id}
                    stageId={currentStage.id}
                  />
                )
              );
            })}
          </XGroup>
        );
      })}
    </Layer>
  );
};

export default XLayer;
