/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Circle, Rect, Line, Arrow, Text } from "react-konva";
import Enhance from "./Enhance";
import XMedia from "./XMedia";
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
  } else if (component.type === "text") {
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
  } else if (component.type === "media") {
    if (!component.media) {
      console.error(
        "Media is not defined for component: ",
        component.componentId
      );
      return null;
    }

    return (
      <Enhance
        key={component.componentId}
        selection={{
          sceneId: component.sceneId!,
          componentId: component.componentId,
        }}
      >
        <XMedia
          key={component.componentId}
          component={component}
        />
      </Enhance>
    );

  }
  return null;
};

export default XComponent;
