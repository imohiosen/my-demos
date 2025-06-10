/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Enhance from "./Enhance";
import XMedia from "./XMedia";
import { DComponent } from "@/app/editor/_utils/zustand/konva/types";

type Props = {
  component: DComponent;
};

const XMediaComponent = ({ component }: Props) => {
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
        {...component.media.attribute}
        type={component.media.type}
      />
    </Enhance>
  );
};

export default XMediaComponent;
