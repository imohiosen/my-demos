/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import {
  useCanvasEditorStore,
  usePresenceStore,
} from "../../_utils/zustand/konva/impl";
import throttle from "lodash/throttle";
import { LucideDownload, LucideTarget } from "lucide-react";
import { Button } from "@/components/ui/button";
import CanvasBackground from "./components/CanvasBackground";
import XSelect from "./components/XSelect";
import XSelectionRectangle from "./components/SelectionRectangle";
import XComponent from "./components/XComponent";
import { SelectionRectangle } from "../../_utils/zustand/konva/types";

// Constants
const MAX_ZOOM_RATIO = 10;
const MIN_ZOOM_RATIO = 0.1;
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const ZOOM_SCALE_FACTOR = 1.1;
const OVERLAY_MULTIPLIER = 5;

// TODO
// Group Items
// thumbnails
// delete selected items
// undo/redo

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

const THROTTLE_DELAY = 200; // Adjust as needed for performance

const initSelectionRectangle = {
  visible: false,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
};

const Canvas = (props: Props) => {
  usePresenceStore((s) => s.liveblocks.isStorageLoading);
  usePresenceStore((s) => s.stageScale);
  usePresenceStore((s) => s.renderCount);
  usePresenceStore((s) => s.stageViewBox);
  useCanvasEditorStore((s) => s.liveblocks.isStorageLoading);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [selectionRectangle, setSelectionRectangle] =
    useState<SelectionRectangle>(initSelectionRectangle);
  const draftId = useCanvasEditorStore((state) => state.id);

  const enterPresenceRoom = usePresenceStore((s) => s.liveblocks.enterRoom);
  const leavePresenceRoom = usePresenceStore((s) => s.liveblocks.leaveRoom);
  const updateCursorPosition = usePresenceStore((s) => s.updateCursorPosition);
  const updateStagePosition = usePresenceStore((s) => s.updateStagePosition);
  const updateStageScale = usePresenceStore((s) => s.updateStageScale);
  const updateStageViewBox = usePresenceStore((s) => s.updateStageViewBox);
  const selectedSceneId = usePresenceStore((s) => s.selectedStageId);
  const selectedIds = usePresenceStore((s) => s.selectedIds);
  const isSelecting = usePresenceStore((s) => s.isSelecting);
  const updateSelectedIds = usePresenceStore((s) => s.updateSelectedIds);
  const updateIsSelecting = usePresenceStore((s) => s.updateIsSelecting);

  const enterRoom = useCanvasEditorStore((s) => s.liveblocks.enterRoom);
  const leaveRoom = useCanvasEditorStore((s) => s.liveblocks.leaveRoom);
  const getSceneById = useCanvasEditorStore((s) => s.getSceneById);
  const selectedScene = getSceneById(selectedSceneId!);

  useEffect(() => {
    updateSelectedIds([]);
  }, [selectedSceneId, updateSelectedIds]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // If we are selecting with rect, do nothing

    if (e.evt.button === 2) {
      // Right click, do nothing
      console.log("Right click detected, ignoring stage click event");
      e.evt.preventDefault();
      e.evt.stopPropagation();
      return;
    }

    if (selectionRectangle.visible) {
      return;
    }

    if (e.target === e.target.getStage()) {
      updateSelectedIds([]);
      return;
    }

    const clickedId = e.target.id();

    // Do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectedIds.includes(clickedId);

    if (!metaPressed && !isSelected) {
      // If no key pressed and the node is not selected
      // select just one
      updateSelectedIds([clickedId]);
    } else if (metaPressed && isSelected) {
      // If we pressed keys and node was selected
      // we need to remove it from selection
      updateSelectedIds(selectedIds.filter((id) => id !== clickedId));
    } else if (metaPressed && !isSelected) {
      // Add the node into selection
      updateSelectedIds([...selectedIds, clickedId]);
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Do nothing if we mousedown on any shape
    if (e.target !== e.target.getStage()) {
      return;
    }

    // if context menu mouse down, do nothing
    if (e.evt.button === 2) {
      // Right click, do nothing
      console.log("Right click detected, ignoring mouse down event");
      e.evt.preventDefault();
      e.evt.stopPropagation();
      return;
    }

    // Start selection rectangle
    updateIsSelecting(true);
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
        updateStageViewBox({
          x: containerRef.current.clientWidth,
          y: containerRef.current.clientHeight,
        });
      }
    };

    updateViewport();

    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [updateStageViewBox]);

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
    updateStagePosition(newPos);
    updateStageScale({
      x: newScale,
      y: newScale,
    });
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

    updateStagePosition({
      x: container.clientWidth / 2,
      y: container.clientHeight / 2,
    });
    updateStageScale({
      x: fitScale,
      y: fitScale,
    });
  };

  const handleContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    e.evt.stopPropagation();

    setSelectionRectangle({
      ...selectionRectangle,
      visible: false,
    });

    const contextMenuEvent = new CustomEvent("X:CanvasContextMenuEvent", {
      detail: {
        clientX: e.evt.clientX,
        clientY: e.evt.clientY,
      },
    });
    document.dispatchEvent(contextMenuEvent);
  };

  const handleExportImage = () => {
    const stage = stageRef.current;
    if (!stage) return;

    // Get the current stage position and scale to calculate the canvas area
    const stagePosition = stage.position();
    const stageScale = stage.scaleX();

    // Calculate the actual canvas position in screen coordinates
    const canvasScreenX = stagePosition.x - (CANVAS_WIDTH / 2) * stageScale;
    const canvasScreenY = stagePosition.y - (CANVAS_HEIGHT / 2) * stageScale;

    const dataURL = stage.toDataURL({
      pixelRatio: 2, // Higher quality
      mimeType: "image/png",
      x: canvasScreenX,
      y: canvasScreenY,
      width: CANVAS_WIDTH * stageScale,
      height: CANVAS_HEIGHT * stageScale,
    });

    console.log("Exporting canvas background area with data URL:", dataURL);

    const link = document.createElement("a");
    link.download = "canvas-export.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrag = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage || !containerRef.current) return;
    const container = containerRef.current;

    const pos = stage.getPosition();
    updateStagePosition(pos);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    updateCursorPosition({
      x: e.evt.clientX - containerRef.current!.getBoundingClientRect().left,
      y: e.evt.clientY - containerRef.current!.getBoundingClientRect().top,
    });

    // Do nothing if we didn't start selection
    if (!isSelecting) {
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

    setSelectionRectangle({
      ...selectionRectangle,
      x2: pos.x,
      y2: pos.y,
    });
  };
  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Do nothing if we didn't start selection
    if (e.evt.button === 2) {
      // Right click, do nothing
      console.log("Right click detected, ignoring mouse up event");
      e.evt.preventDefault();
      e.evt.stopPropagation();
      return;
    }

    if (!isSelecting) {
      return;
    }
    updateIsSelecting(false);

    const selBox = {
      x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
      y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
      width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
      height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
    };

    const selected = selectedScene.filter((compAttrs) => {
      // Check if rectangle intersects with selection box
      const compNode = stageRef.current?.findOne(`#${compAttrs.componentId}`);
      if (!compNode) {
        console.warn(`Component with id ${compAttrs.componentId} not found`);
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

    updateSelectedIds(selected.map((comp) => comp.componentId));

    // Update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      setSelectionRectangle({
        ...selectionRectangle,
        visible: false,
      });
    }, 100);
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
          onContextMenu={handleContextMenu}
        >
          {/* Background and overlay layer */}
          <Layer listening={false}>
            <CanvasBackground />
          </Layer>
          <Layer>
            {selectedScene &&
              selectedScene.map((c) => (
                <XComponent key={c.componentId} component={c} />
              ))}
            <XSelect nodeIds={selectedIds} />
            <XSelectionRectangle {...selectionRectangle} />
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
