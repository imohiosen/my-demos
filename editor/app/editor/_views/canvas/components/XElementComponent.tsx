/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Circle, Rect, Line, Arrow } from "react-konva";
import Enhance from "./Enhance";
import { DComponent } from "@/app/editor/_utils/zustand/konva/types";

type Props = {
  component: DComponent;
};

const XElementComponent = ({ component }: Props) => {

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
  } else if (elem.type === "line") {
    return (
      <Enhance
        key={component.componentId}
        selection={{
          sceneId: component.sceneId!,
          componentId: component.componentId,
        }}
      >
        <Line
          {...elem}
          points={elem.points || [0, 0, 100, 100]}
          id={component.componentId}
        />
      </Enhance>
    );
  } else if (elem.type === "arrow") {
    return (
      <Enhance
        key={component.componentId}
        selection={{
          sceneId: component.sceneId!,
          componentId: component.componentId,
        }}
      >
        <Arrow
          {...elem}
          points={elem.points || [0, 0, 100, 100]}
          id={component.componentId}
        />
      </Enhance>
    );
  } else {
    console.error(
      "Unsupported element type: ",
      component.element.attribute.type
    );
    return null;
  }
};

export default XElementComponent;
