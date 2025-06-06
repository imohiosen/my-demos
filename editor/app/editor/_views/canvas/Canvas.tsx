/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useCallback, useEffect, useRef } from "react";
import { Group, Layer, Rect, Stage } from "react-konva";
import Konva from "konva";
import {
  useCanvasEditorStore,
  usePresenceStore,
} from "../../_utils/zustand/konva/impl";
import throttle from "lodash/throttle";
import { LucideDownload, LucideTarget } from "lucide-react";
import { Button } from "@/components/ui/button";
import XGroup from "./components/XGroup";
import XElement from "./components/XElement";
import CanvasBackground from "./components/CanvasBackground";
import { DGroup } from "../../_utils/zustand/konva/types";

// Constants
const MAX_ZOOM_RATIO = 10;
const MIN_ZOOM_RATIO = 0.1;
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const ZOOM_SCALE_FACTOR = 1.1;
const OVERLAY_MULTIPLIER = 5;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

const THROTTLE_DELAY = 200; // Adjust as needed for performance

const Canvas = (props: Props) => {
  usePresenceStore((state) => state.renderCount);

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

  useCanvasEditorStore((state) => state.liveblocks.isStorageLoading);
  usePresenceStore((state) => state.liveblocks.isStorageLoading);
  usePresenceStore((state) => state.stageScale);
  usePresenceStore((state) => state.stageViewBox);

  const updateStageScale = usePresenceStore((state) => state.updateStageScale);
  const updateStageViewBox = usePresenceStore(
    (state) => state.updateStageViewBox
  );
  const selectedSceneId = usePresenceStore((state) => state.selectedStageId);

  const enterRoom = useCanvasEditorStore((state) => state.liveblocks.enterRoom);
  const leaveRoom = useCanvasEditorStore((state) => state.liveblocks.leaveRoom);
  const getSceneById = useCanvasEditorStore((state) => state.getSceneById);
  const selectedScene = getSceneById(selectedSceneId!);

  console.log("Current stage:", selectedScene);

  // Create throttled functions once, not on every call
  const throttledUpdateCursorPosition = useCallback(
    throttle(
      (x: number, y: number) => updateCursorPosition({ x, y }),
      THROTTLE_DELAY
    ),
    [updateCursorPosition]
  );

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
  if (!selectedScene) {
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
          {/* Background and overlay layer */}
          <Layer listening={false}>
            <CanvasBackground />
          </Layer>
          <Layer>
            {selectedScene &&
              selectedScene.map((component) => {
                if (component.type === "group") {
                  console.log("Group not implemented:");
                  return (
                    null
                  );
                } else if (component.type === "element") {
                  return (
                    component.element && (
                      <XElement
                        key={component.id}
                        {...component.element.attribute}
                        componentId={component.id}
                        sceneId={selectedSceneId}
                      />
                    )
                  );
                } else if (component.type === "text") {
                  console.error(
                    "Text components are not yet implemented in Canvas")
                  return null;
                }
                return null;
              })}
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
