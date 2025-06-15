/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";;
import Enhance from "./Enhance";
import { DComponent } from "@/app/editor/_utils/zustand/konva/types";
import XText from "./XText";

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
      <XText {...textAttrs} id={component.componentId} />
    </Enhance>
  );
  
};

export default XTextComponent;
