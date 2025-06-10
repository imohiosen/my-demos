/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Circle, Rect, Line, Arrow, Image, Text } from "react-konva";
import Enhance from "./Enhance";
import { DComponent, DMediaProps } from "@/app/editor/_utils/zustand/konva/types";
import { useEffect, useState } from "react";
import { D } from "vitest/dist/chunks/reporters.d.DL9pg5DB.js";

// Component for rendering media images
const MediaImage = ({ component, mediaAttrs }: { 
  component: DComponent; 
  mediaAttrs: DMediaProps
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!mediaAttrs?.src) return;
    
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImage(img);
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Failed to load image:", mediaAttrs.src);
      setImageLoaded(false);
    };
    img.src = mediaAttrs.src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [mediaAttrs?.src]);

  if (!imageLoaded || !image) {
    // Show a placeholder while loading
    return (
      <Enhance
        key={component.componentId}
        selection={{
          sceneId: component.sceneId!,
          componentId: component.componentId,
        }}
      >
        <Rect 
          x={mediaAttrs?.x || 0}
          y={mediaAttrs?.y || 0}
          width={mediaAttrs?.width || 100}
          height={mediaAttrs?.height || 100}
          fill="#f0f0f0"
          stroke="#ccc"
          strokeWidth={1}
          id={component.componentId}
        />
      </Enhance>
    );
  }

  return (
    <Enhance
      key={component.componentId}
      selection={{
        sceneId: component.sceneId!,
        componentId: component.componentId,
      }}
    >
      <Image
        image={image}
        x={mediaAttrs?.x || 0}
        y={mediaAttrs?.y || 0}
        width={mediaAttrs?.width || image.width}
        height={mediaAttrs?.height || image.height}
        id={component.componentId}
        alt={mediaAttrs?.alt || "Media"}
      />
    </Enhance>
  );
};
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
      console.error("Text is not defined for component: ", component.componentId);
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
      console.error("Media is not defined for component: ", component.componentId);
      return null;
    }
    
    const media = component.media;
    const mediaAttrs = media.attribute;
    
    // For image-based media types
    if (media.type === "asset-image" || media.type === "image") {
      return (
        <MediaImage
          key={component.componentId}
          component={component}
          mediaAttrs={mediaAttrs}
        />
      );
    } else if (media.type === "asset-icons" || media.type === "icons") {
      // Icons are typically rendered as images
      return (
        <MediaImage
          key={component.componentId}
          component={component}
          mediaAttrs={mediaAttrs}
        />
      );
    } else if (media.type === "asset-video" || media.type === "video") {
      // For videos, we'll create a placeholder image for now
      // In a full implementation, you might want to show a video preview or play button
      return (
        <MediaImage
          key={component.componentId}
          component={component}
          mediaAttrs={mediaAttrs}
        />
      );
    } else {
      console.error("Unsupported media type: ", media.type);
      return null;
    }
  }
  return null;
};

export default XComponent;
