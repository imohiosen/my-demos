/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import Konva from "konva";
import {
  useCanvasEditorStore,
  usePresenceStore,
} from "../../_utils/zustand/konva/impl";
import { VideoDraftState } from "../../_utils/zustand/konva/store";
import throttle from "lodash/throttle";
import { LucideDownload, LucideTarget, UndoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import XGroup from "./components/XGroup";
import XText from "./components/XText";
import { stages } from "konva/lib/Stage";

// Constants
const MAX_ZOOM_RATIO = 10;
const MIN_ZOOM_RATIO = 0.1;
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const ZOOM_SCALE_FACTOR = 1.1;
const OVERLAY_MULTIPLIER = 5;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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

const THROTTLE_DELAY = 200; // Adjust as needed for performance

const Canvas = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const enterPresenceRoom = usePresenceStore(
    (state) => state.liveblocks.enterRoom
  );
  const leavePresenceRoom = usePresenceStore(
    (state) => state.liveblocks.leaveRoom
  );
  const updateCursorPosition = usePresenceStore(
    (state) => state.updateCursorPosition
  );
  const updateStagePosition = usePresenceStore(
    (state) => state.updateStagePosition
  );

  const isCanvasOnline = useCanvasEditorStore((state) => state.liveblocks.isStorageLoading);
  const isPresenceOnline = usePresenceStore((state) => state.liveblocks.isStorageLoading);
  const getSelectionFromLocalStorage = usePresenceStore((state) => state.getSelectionFromLocalStorage);
  const updateStageScale = usePresenceStore((state) => state.updateStageScale);
  const stageScale = usePresenceStore((state) => state.stageScale);
  const updateStageViewBox = usePresenceStore(
    (state) => state.updateStageViewBox
  );
  const selectedStageId = usePresenceStore((state) => state.selectedStageId);
  const stageViewBox = usePresenceStore((state) => state.stageViewBox);

  const enterRoom = useCanvasEditorStore((state) => state.liveblocks.enterRoom);
  const leaveRoom = useCanvasEditorStore((state) => state.liveblocks.leaveRoom);
  const getStageById = useCanvasEditorStore((state) => state.getStageById);
  const currentStage = getStageById(selectedStageId!);

  const handleTextDragEnd = useCanvasEditorStore((state) => state.handleTextDragEnd);

  // Create throttled functions once, not on every call
  const throttledUpdateCursorPosition = useCallback(
    throttle(
      (x: number, y: number) => updateCursorPosition({ x, y }),
      THROTTLE_DELAY
    ),
    [updateCursorPosition]
  );

  useEffect(() => {
    getSelectionFromLocalStorage();
  }
  , [getSelectionFromLocalStorage, currentStage, isCanvasOnline, isPresenceOnline]);

  const throttledUpdateStagePosition = useCallback(
    throttle(
      (x: number, y: number) => updateStagePosition({ x, y }),
      THROTTLE_DELAY
    ),
    [updateStagePosition]
  );

  const throttledUpdateStageScale = useCallback(
    throttle(
      (x: number, y: number) => updateStageScale({ x, y }),
      THROTTLE_DELAY
    ),
    [updateStageScale]
  );

  const throttledUpdateStageViewBox = useCallback(
    throttle(
      (x: number, y: number) => updateStageViewBox({ x, y }),
      THROTTLE_DELAY
    ),
    [updateStageViewBox]
  );
  const draftId = useCanvasEditorStore((state) => state.id);

  useEffect(() => {
    enterPresenceRoom("presence/" + draftId);
    enterRoom("storage/" + draftId);
    return () => {
      leaveRoom();
      leavePresenceRoom();
    };
  }, [enterRoom, leaveRoom, enterPresenceRoom, leavePresenceRoom, draftId]);

  useEffect(() => {
    const updateViewport = () => {
      if (containerRef.current) {
        throttledUpdateStageViewBox(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      }
    };

    updateViewport();

    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [throttledUpdateStageViewBox]);

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
    let newScale =
      direction > 0
        ? oldScale * ZOOM_SCALE_FACTOR
        : oldScale / ZOOM_SCALE_FACTOR;

    newScale = Math.max(MIN_ZOOM_RATIO, Math.min(MAX_ZOOM_RATIO, newScale));

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    throttledUpdateStagePosition(newPos.x, newPos.y);
    throttledUpdateStageScale(newScale, newScale);
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

    throttledUpdateStagePosition(
      container.clientWidth / 2,
      container.clientHeight / 2
    );
    throttledUpdateStageScale(fitScale, fitScale);
  };

  const handleExportImage = () => {
    const stage = stageRef.current;
    if (!stage) return;

    // Create a temporary in-memory canvas with just the size of our actual canvas

    // Clone the main layer for export
    // Position all elements relative to canvas bounds
    // Generate data URL
    const dataURL = stage.toDataURL({
      pixelRatio: 2, // Higher quality
      mimeType: "image/png",
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
    });

    console.log("Exporting image with data URL:", dataURL);

    const link = document.createElement("a");
    link.download = "canvas-export.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    // tempStage.destroy();
  };

  const handleDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage || !containerRef.current) return;
    const container = containerRef.current;

    const pos = stage.getPosition();
    throttledUpdateStagePosition(pos.x, pos.y);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    throttledUpdateCursorPosition(
      e.evt.clientX - containerRef.current!.getBoundingClientRect().left,
      e.evt.clientY - containerRef.current!.getBoundingClientRect().top
    );
  };

  const getInitialScale = () => {
    if (!containerRef.current) return 1;
    return Math.min(
      containerRef.current.clientWidth / CANVAS_WIDTH,
      containerRef.current.clientHeight / CANVAS_HEIGHT
    );
  };

  const BgOverlay = () => (
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
        <div
          className="flex items-center justify-center h-full w-full"
          ref={containerRef}
        />
      </div>
    );
  }
  if (!currentStage) {
    return (
      <div className="h-full w-full p-8 relative">
        <div
          className="flex items-center justify-center h-full w-full"
          ref={containerRef}
        >
          <p className="text-gray-500">No scene selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-8 relative">
      <div
        className="flex items-center justify-center h-full w-full"
        ref={containerRef}
      >
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
          onDragMove={handleDrag}
          onMouseMove={handleMouseMove}
        >
          {/* Content layers */}
          {currentStage &&
            [currentStage.layer].map((layer) => (
              <Layer key={layer.id} {...layer.attributes}>
                {layer.groups.map((group) => {
                  return (
                    <XGroup key={group.id} {...group.attributes}>
                      {group.components.map((component) => {
                        if (component.type === "text") {
                          return (
                              <XText
                                key={component.id}
                                {...component?.text?.attribute} 
                                draggable={true}
                                onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => handleTextDragEnd({
                                  componentId: component.id,
                                  groupId: group.id,
                                  layerId: layer.id,
                                  stageId: currentStage.id,
                                  type: "component",
                                }, e)}
                              />
                          );
                        }
                      })}
                    </XGroup>
                  );
                })}
              </Layer>
            ))}

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
                stroke="transparent"
                offsetX={CANVAS_WIDTH / 2}
                offsetY={CANVAS_HEIGHT / 2}
              />

              <BgOverlay />
            </Group>
          </Layer>
        </Stage>
      </div>

      {/* Button container */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        {/* Export button */}
        <Button
          onClick={handleExportImage}
          variant={"default"}
          className="shadow-lg rounded-full"
          size={"icon"}
        >
          <LucideDownload size={20} />
        </Button>

        {/* Center button */}
        <Button
          onClick={handleCenter}
          variant={"default"}
          className=" shadow-lg rounded-full"
          size={"icon"}
        >
          <LucideTarget size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Canvas;
