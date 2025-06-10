"use client";
import { Rect, Image } from "react-konva";
import Enhance from "./Enhance";
import {
  DComponent,
  DMediaProps,
} from "@/app/editor/_utils/zustand/konva/types";
import { useEffect, useState } from "react";

// Component for rendering media images and videos
const XMedia = ({
  component,
}: {
  component: DComponent;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const mediaType = component.media?.type;
  const mediaAttrs = component.media?.attribute as DMediaProps;

  useEffect(() => {
    if (!mediaAttrs?.src) return;

    const isVideoType = mediaType === "asset-video" || mediaType === "video";
    setIsVideo(isVideoType);

    if (isVideoType) {
      // Handle video
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.muted = true; // Muted by default for autoplay policies
      video.playsInline = true;

      video.onloadeddata = () => {
        // Create a canvas to capture the first frame
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert canvas to image for Konva
          const img = new window.Image();
          img.onload = () => {
            setImage(img);
            setVideoElement(video);
            setMediaLoaded(true);
          };
          img.src = canvas.toDataURL();
        }
      };

      video.onerror = () => {
        console.error("Failed to load video:", mediaAttrs.src);
        setMediaLoaded(false);
      };

      video.src = mediaAttrs.src;
      video.load();
    } else {
      // Handle image
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setImage(img);
        setMediaLoaded(true);
      };
      img.onerror = () => {
        console.error("Failed to load image:", mediaAttrs.src);
        setMediaLoaded(false);
      };
      img.src = mediaAttrs.src;
    }

    return () => {
      // Cleanup will be handled by the separate effect
    };
  }, [mediaAttrs?.src, mediaType]);

  // Separate cleanup effect for video element
  useEffect(() => {
    return () => {
      if (videoElement) {
        videoElement.pause();
        videoElement.src = "";
      }
    };
  }, [videoElement]);

  if (!mediaLoaded || !image) {
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
        {/* Add a play icon overlay for videos */}
        {isVideo && (
          <Rect
            x={(mediaAttrs?.x || 0) + (mediaAttrs?.width || 100) / 2 - 15}
            y={(mediaAttrs?.y || 0) + (mediaAttrs?.height || 100) / 2 - 15}
            width={30}
            height={30}
            fill="#000000"
            opacity={0.7}
            cornerRadius={15}
          />
        )}
      </Enhance>
    );
  }

  return (
    <>
      <Image
        image={image}
        x={mediaAttrs?.x || 0}
        y={mediaAttrs?.y || 0}
        width={mediaAttrs?.width || image.width}
        height={mediaAttrs?.height || image.height}
        id={component.componentId}
        alt={component.componentId}
      />
      {/* Add a play icon overlay for videos */}
      {isVideo && (
        <Rect
          x={(mediaAttrs?.x || 0) + (mediaAttrs?.width || image.width) / 2 - 20}
          y={
            (mediaAttrs?.y || 0) + (mediaAttrs?.height || image.height) / 2 - 20
          }
          width={40}
          height={40}
          fill="#000000"
          opacity={0.7}
          cornerRadius={20}
        />
      )}
    </>
  );
};

export default XMedia;
