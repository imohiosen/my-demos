/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";;
import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import Konva from "konva";
import {
  useCanvasEditorStore,
  usePresenceStore,
} from "../../_utils/zustand/konva/impl";
import throttle from "lodash/throttle";
import { LucideDownload, LucideTarget } from "lucide-react";
import { Button } from "@/components/ui/button";
import XElement from "./components/XElement";
import CanvasBackground from "./components/CanvasBackground";
import XSelect from "./components/XSelect";

// Constants
const MAX_ZOOM_RATIO = 10;
const MIN_ZOOM_RATIO = 0.1;
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const ZOOM_SCALE_FACTOR = 1.1;
const OVERLAY_MULTIPLIER = 5;

// TODO
// Select single and multiple by click
// Deselect when clicking outside
// reset transform

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

const THROTTLE_DELAY = 200; // Adjust as needed for performance

const Canvas = (props: Props) => {
  const [selectionRectangle, setSelectionRectangle] = useState({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

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
  usePresenceStore((state) => state.renderCount);

  const updateStageScale = usePresenceStore((state) => state.updateStageScale);
  const updateStageViewBox = usePresenceStore(
    (state) => state.updateStageViewBox
  );
  const selectedSceneId = usePresenceStore((state) => state.selectedStageId);

  const enterRoom = useCanvasEditorStore((state) => state.liveblocks.enterRoom);
  const leaveRoom = useCanvasEditorStore((state) => state.liveblocks.leaveRoom);
  const getSceneById = useCanvasEditorStore((state) => state.getSceneById);
  const selectedScene = getSceneById(selectedSceneId!);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isSelecting = useRef(false);

  useEffect(() => {
    setSelectedIds([]);
  }
  , [selectedSceneId]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // If we are selecting with rect, do nothing
    
    if (selectionRectangle.visible) {
      return;
    }

    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
      return;
    }

    const clickedId = e.target.id();

    // Do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectedIds.includes(clickedId);

    if (!metaPressed && !isSelected) {
      // If no key pressed and the node is not selected
      // select just one
      setSelectedIds([clickedId]);
    } else if (metaPressed && isSelected) {
      // If we pressed keys and node was selected
      // we need to remove it from selection
      setSelectedIds(selectedIds.filter((id) => id !== clickedId));
    } else if (metaPressed && !isSelected) {
      // Add the node into selection
      setSelectedIds([...selectedIds, clickedId]);
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Do nothing if we mousedown on any shape
    if (e.target !== e.target.getStage()) {
      return;
    }

    // Start selection rectangle
    isSelecting.current = true;
    const stage = e.target.getStage();
    if (!stage) {
      console.error("Stage is not defined in handleMouseDown");
      return;
    }

    // Get relative position to stage (accounting for zoom and pan)
    const pos = stage.getRelativePointerPosition();
    if (!pos) {
      console.error("Pointer position is null");
      return;
    }

    setSelectionRectangle({
      visible: true,
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y,
    });
  };

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

    // Do nothing if we didn't start selection
    if (!isSelecting.current) {
      return;
    }
    const stage = e.target.getStage();
    if (!stage) {
      console.error("Stage is not defined in handleMouseMove");
      return;
    }

    // Get relative position to stage (accounting for zoom and pan)
    const pos = stage.getRelativePointerPosition();
    if (!pos) {
      console.error("Pointer position is null in handleMouseMove");
      return;
    }

    setSelectionRectangle((prev) => ({
      ...prev,
      x2: pos.x,
      y2: pos.y,
    }));
  };
  const handleMouseUp = () => {
    // Do nothing if we didn't start selection
    if (!isSelecting.current) {
      return;
    }
    isSelecting.current = false;

    const selBox = {
      x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
      y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
      width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
      height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
    };

    const selected = selectedScene.filter((compAttrs) => {
      // Check if rectangle intersects with selection box
      const compNode = stageRef.current?.findOne(`#${compAttrs.id}`);
      if (!compNode) {
        console.warn(`Component with id ${compAttrs.id} not found`);
        return false;
      }

      if (stageRef.current) {
        const compBox = compNode.getClientRect({
          relativeTo: stageRef.current,
        });
        return Konva.Util.haveIntersection(selBox, compBox);
      } else {
        console.error("Stage reference is not defined in handleMouseUp");
        return false;
      }
    });

    setSelectedIds(selected.map((rect) => rect.id));


    // Update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      setSelectionRectangle((prev) => ({
        ...prev,
        visible: false,
      }));
    }, 0);
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
          x={containerRef.current.clientWidth / 2}
          y={containerRef.current.clientHeight / 2}
          scaleX={getInitialScale()}
          scaleY={getInitialScale()}
          onWheel={handleWheel}
          onDragMove={handleDrag}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseup={handleMouseUp}
          onClick={handleStageClick}
        >
          {/* Background and overlay layer */}
          <Layer listening={false}>
            <CanvasBackground />
          </Layer>
          <Layer>
            {selectedScene &&
              selectedScene.map((component) => {
                if (component.type === "group") {
                  console.error("Group not implemented:");
                  return null;
                } else if (component.type === "element") {
                  return (
                    component.element && (
                      <XElement
                        key={component.id}
                        id={component.id}
                        {...component.element.attribute}
                        componentId={component.id}
                        sceneId={selectedSceneId}
                      />
                    )
                  );
                } else if (component.type === "text") {
                  console.error(
                    "Text components are not yet implemented in Canvas"
                  );
                  return null;
                }
                return null;
              })}
            <XSelect nodeIds={selectedIds} />
            {selectionRectangle.visible && (
              <Rect
                x={Math.min(selectionRectangle.x1, selectionRectangle.x2)}
                y={Math.min(selectionRectangle.y1, selectionRectangle.y2)}
                width={Math.abs(selectionRectangle.x2 - selectionRectangle.x1)}
                height={Math.abs(selectionRectangle.y2 - selectionRectangle.y1)}
                stroke="rgba(0, 0, 255, 0.5)"
                strokeWidth={2}
                fill="rgba(0,0,255,0.2)"
              />
            )}
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
