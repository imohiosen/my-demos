"use client";
import XElementComponent from "./XElementComponent";
import XTextComponent from "./XTextComponent";
import XMediaComponent from "./XMediaComponent";
import XGroupComponent from "./XGroupComponent";
import { DComponent } from "@/app/editor/_utils/zustand/konva/types";

type Props = {
  key: string;
  component: DComponent;
};

const XComponent = (props: Props) => {
  const component: DComponent = props.component;
  
  if (component.type === "group") {
    return <XGroupComponent component={component} />;
  } else if (component.type === "element") {
    return <XElementComponent component={component} />;
  } else if (component.type === "text") {
    return <XTextComponent component={component} />;
  } else if (component.type === "media") {
    return <XMediaComponent component={component} />;
  } else if (component.type === "avatar") {
    // Handle avatar component rendering
    return <XMediaComponent component={component} />;
  }
  
  console.error("Unknown component type:", component.type, "for component:", component.componentId);

  return null;
};

export default XComponent;
