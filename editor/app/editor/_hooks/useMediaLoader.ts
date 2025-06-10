import { useEffect, useState } from "react";

interface UseMediaLoaderProps {
  src?: string;
  mediaType?: string;
}

interface UseMediaLoaderReturn {
  image: HTMLImageElement | null;
  videoElement: HTMLVideoElement | null;
  mediaLoaded: boolean;
  isVideo: boolean;
}

export const useMediaLoader = ({ src, mediaType }: UseMediaLoaderProps): UseMediaLoaderReturn => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    if (!src) return;

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
        console.error("Failed to load video:", src);
        setMediaLoaded(false);
      };

      video.src = src;
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
        console.error("Failed to load image:", src);
        setMediaLoaded(false);
      };
      img.src = src;
    }

    return () => {
      // Cleanup will be handled by the separate effect
    };
  }, [src, mediaType]);

  // Separate cleanup effect for video element
  useEffect(() => {
    return () => {
      if (videoElement) {
        videoElement.pause();
        videoElement.src = "";
      }
    };
  }, [videoElement]);

  return {
    image,
    videoElement,
    mediaLoaded,
    isVideo,
  };
};
