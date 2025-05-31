"use client";
import { useEffect, useRef, useState } from "react";
import { Group, Layer, Rect, Stage } from "react-konva";
import Konva from "konva";
import { useCanvasEditorStore } from "../../_utils/zustand/konva/impl";

// Constants
const MAX_ZOOM_RATIO = 10;
const MIN_ZOOM_RATIO = 0.1;
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const ZOOM_SCALE_FACTOR = 1.1;
const OVERLAY_MULTIPLIER = 5;

type Props = {};

// Utility function
function getFittingViewport(viewport: { width: number; height: number }) {
  const aspectRatio = 16 / 9;
  const maxWidth = viewport.width;
  const maxHeight = viewport.height;

  const widthBasedHeight = maxWidth / aspectRatio;
  const heightBasedWidth = maxHeight * aspectRatio;

  if (widthBasedHeight <= maxHeight) {
    return {
      width: maxWidth,
      height: widthBasedHeight,
    };
  } else {
    return {
      width: heightBasedWidth * MAX_ZOOM_RATIO,
      height: maxHeight * MAX_ZOOM_RATIO,
    };
  }
}

const Canvas = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [viewport, setViewport] = useState<{ width: number; height: number } | null>(null);
  const [scale, setScale] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const updateClientLive = useCanvasEditorStore((state) => state.updateClientLive);
  
  const draftId = useCanvasEditorStore((state) => state.id);

  useEffect(() => {


    updateClientLive({ cursorPosition: { x: 0, y: 0 }, selectedItems: [] });
  }, [updateClientLive]);


  const {
    liveblocks: { enterRoom, leaveRoom },
  } = useCanvasEditorStore();



  useEffect(() => {
    enterRoom(draftId);
    return () => {
      leaveRoom();
    };
  }, [enterRoom, leaveRoom, draftId]);

  useEffect(() => {
    const updateViewport = () => {
      if (containerRef.current) {
        updateClientLive({
          stageViewBox: {
            x: containerRef.current.clientWidth,
            y: containerRef.current.clientHeight,
          },
        });
      }

    };

    updateViewport();

    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [updateClientLive]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    let newScale = direction > 0 ? oldScale * ZOOM_SCALE_FACTOR : oldScale / ZOOM_SCALE_FACTOR;

    newScale = Math.max(MIN_ZOOM_RATIO, Math.min(MAX_ZOOM_RATIO, newScale));

    stage.scale({ x: newScale, y: newScale });

    updateClientLive({
      stageScale: { x: newScale, y: newScale },
    });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    updateClientLive({
      stagePosition: { x: newPos.x, y: newPos.y },
    });
    setScale({ x: newScale, y: newScale });
  };

  const handleCenter = () => {
    const stage = stageRef.current;
    if (!stage || !containerRef.current) return;

    const container = containerRef.current;
    const fitScale = Math.min(
      container.clientWidth / CANVAS_WIDTH,
      container.clientHeight / CANVAS_HEIGHT
    );

    stage.scale({ x: fitScale, y: fitScale });
    stage.position({
      x: container.clientWidth / 2,
      y: container.clientHeight / 2,
    });

    setScale({ x: fitScale, y: fitScale });
  };

  const getInitialScale = () => {
    if (!containerRef.current) return 1;
    return Math.min(
      containerRef.current.clientWidth / CANVAS_WIDTH,
      containerRef.current.clientHeight / CANVAS_HEIGHT
    );
  };

  const renderOverlays = () => (
    <>
      {/* Top overlay */}
      <Rect
        x={-CANVAS_WIDTH * OVERLAY_MULTIPLIER}
        y={-CANVAS_HEIGHT * OVERLAY_MULTIPLIER}
        width={CANVAS_WIDTH * OVERLAY_MULTIPLIER * 2}
        height={CANVAS_HEIGHT * OVERLAY_MULTIPLIER - CANVAS_HEIGHT / 2}
        fill="rgba(196, 196, 196, 0.1)"
        listening={false}
      />
      
      {/* Bottom overlay */}
      <Rect
        x={-CANVAS_WIDTH * OVERLAY_MULTIPLIER}
        y={CANVAS_HEIGHT / 2}
        width={CANVAS_WIDTH * OVERLAY_MULTIPLIER * 2}
        height={CANVAS_HEIGHT * OVERLAY_MULTIPLIER}
        fill="rgba(196, 196, 196, 0.1)"
        listening={false}
      />
      
      {/* Left overlay */}
      <Rect
        x={-CANVAS_WIDTH * OVERLAY_MULTIPLIER}
        y={-CANVAS_HEIGHT / 2}
        width={CANVAS_WIDTH * OVERLAY_MULTIPLIER - CANVAS_WIDTH / 2}
        height={CANVAS_HEIGHT}
        fill="rgba(196, 196, 196, 0.1)"
        listening={false}
      />
      
      {/* Right overlay */}
      <Rect
        x={CANVAS_WIDTH / 2}
        y={-CANVAS_HEIGHT / 2}
        width={CANVAS_WIDTH * OVERLAY_MULTIPLIER}
        height={CANVAS_HEIGHT}
        fill="rgba(196, 196, 196, 0.1)"
        listening={false}
      />
    </>
  );

  if (!containerRef.current) {
    return (
      <div className="h-full w-full p-8 relative">
        <div className="flex items-center justify-center h-full w-full" ref={containerRef} />
      </div>
    );
  }

  return (
    <div className="h-full w-full p-8 relative">
      <div className="flex items-center justify-center h-full w-full" ref={containerRef}>
        <Stage
          ref={stageRef}
          width={containerRef.current.clientWidth}
          height={containerRef.current.clientHeight}
          draggable={true}
          x={containerRef.current.clientWidth / 2}
          y={containerRef.current.clientHeight / 2}
          scaleX={getInitialScale()}
          scaleY={getInitialScale()}
          onWheel={handleWheel}
          onMouseMove={(e) => {
            updateClientLive({
              cursorPosition: {
                x: e.evt.clientX - containerRef.current!.getBoundingClientRect().left,
                y: e.evt.clientY - containerRef.current!.getBoundingClientRect().top,
              },
            });
          }}
        >
          {/* Content layers */}
          <Layer>
            <Group>
              <Rect
                width={100}
                height={100}
                fill="red"
                stroke="black"
                draggable={true}
              />
            </Group>
          </Layer>
          

          {/* Background and overlay layer */}
          <Layer listening={false}>
            <Group listening={false}>
              {/* Main canvas background */}
              <Rect
                x={0}
                y={0}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                fill="transparent"
                offsetX={CANVAS_WIDTH / 2}
                offsetY={CANVAS_HEIGHT / 2}
              />
              
              {renderOverlays()}
            </Group>
          </Layer>
        </Stage>
      </div>
      
      {/* Center button */}
      <button
        onClick={handleCenter}
        className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200 z-10"
        title="Center Canvas"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6" />
          <path d="m21 12-6 0m-6 0-6 0" />
        </svg>
      </button>
    </div>
  );
};

export default Canvas;

