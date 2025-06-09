/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Circle, Rect } from "react-konva";
import Enhance from "./Enhance";
import { DComponent } from "@/app/editor/_utils/zustand/konva/types";
type Props = {
  key: string;
  component: DComponent;
};

const XComponent = (props: Props) => {
  const component: DComponent = props.component;
  if (component.type === "group") {
    console.error("Group not implemented:");
    return null;
  } else if (component.type === "element") {
    if (!component.element) {
      console.error(
        "Element is not defined for component: ",
        component.componentId
      );
      return null;
    }
    const elem = component.element.attribute;
    if (elem.type === "circle") {
      return (
        <Enhance
          key={component.componentId}
          selection={{
            sceneId: component.sceneId!,
            componentId: component.componentId,
          }}
        >
          <Circle {...elem} id={component.componentId} />
        </Enhance>
      );
    } else if (elem.type === "rect") {
      return (
        <Enhance
          key={component.componentId}
          selection={{
            sceneId: component.sceneId!,
            componentId: component.componentId,
          }}
        >
          <Rect {...elem} id={component.componentId} />
        </Enhance>
      );
    } else {
      console.error(
        "Unsupported element type: ",
        component.element.attribute.type
      );
      return null;
    }
  } else if (component.type === "text") {
    console.error("Text components are not yet implemented in Canvas");
    return null;
  }
  return null;
};

export default XComponent;
