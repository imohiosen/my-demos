/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Text } from "react-konva";
import Enhance from "./Enhance";
import { DComponent } from "@/app/editor/_utils/zustand/konva/types";

type Props = {
  component: DComponent;
};

const XTextComponent = ({ component }: Props) => {
  if (!component.text) {
    console.error(
      "Text is not defined for component: ",
      component.componentId
    );
    return null;
  }

  const textAttrs = component.text.attribute;

  return (
    <Enhance
      key={component.componentId}
      selection={{
        sceneId: component.sceneId!,
        componentId: component.componentId,
      }}
    >
      <Text {...textAttrs} id={component.componentId} />
    </Enhance>
  );
};

export default XTextComponent;
