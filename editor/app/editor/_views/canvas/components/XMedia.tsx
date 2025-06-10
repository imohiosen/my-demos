"use client";
import { Rect, Image } from "react-konva";
import Enhance from "./Enhance";
import {
  DComponent,
  DMediaProps,
} from "@/app/editor/_utils/zustand/konva/types";
import { useMediaLoader } from "@/app/editor/_hooks/useMediaLoader";
import Konva from "konva";

// Component for rendering media images and videos
type XMediaProps = Konva.NodeConfig & DMediaProps & { type: string };
const XMedia = (props: XMediaProps) => {
  
  const { image, videoElement, mediaLoaded, isVideo } = useMediaLoader({
    src: props.src,
    mediaType: props.type,
  });

  if (!mediaLoaded || !image) {
    console.error("Media not loaded yet:", props?.src);
    return null;
  }

  return (
      <Image
        image={image}
        id={props.componentId}
        alt={props.alt || ""}
        {...props}
      />
  );
};

export default XMedia;
