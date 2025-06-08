/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";;
import { useEffect, useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import Konva from "konva";
import {
  useCanvasEditorStore,
  usePresenceStore,
} from "../../_utils/zustand/konva/impl";
import { LucideDownload, LucideTarget } from "lucide-react";
import { Button } from "@/components/ui/button";
import CanvasBackground from "./components/CanvasBackground";
import XSelect from "./components/XSelect";
import XSelectionRectangle from "./components/SelectionRectangle";
import XComponent from "./components/XComponent";
import { SelectionRectangle } from "../../_utils/zustand/konva/types";
import { useStageClickHandler } from "../../_hooks/useStageClickHandler";
import { useMouseDownHandler } from "../../_hooks/useMouseDownHandler";
import { useWheelHandler } from "../../_hooks/useWheelHandler";
import { useCenterHandler } from "../../_hooks/useCenterHandler";
import { useContextMenuHandler } from "../../_hooks/useContextMenuHandler";
import { useDragHandler } from "../../_hooks/useDragHandler";
import { useMouseMoveHandler } from "../../_hooks/useMouseMoveHandler";
import { useMouseUpHandler } from "../../_hooks/useMouseUpHandler";
import { useExportImageHandler } from "../../_hooks/useExportImageHandler";

// Constants for initial scale calculation
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

// TODO
// Group Items
// thumbnails
// delete selected items
// undo/redo

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

const THROTTLE_DELAY = 200; // Adjust as needed for performance

const initSelectionRectangle: SelectionRectangle = {
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

  const [selectionRectangle, setSelectionRectangle] = useState(initSelectionRectangle);
  
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

  // Use the custom hook for stage click handling
  const { handleStageClick } = useStageClickHandler({ selectionRectangle });
  
  // Use the custom hook for mouse down handling
  const { handleMouseDown } = useMouseDownHandler({ setSelectionRectangle });
  
  // Use the custom hook for wheel handling
  const { handleWheel } = useWheelHandler({ stageRef });
  
  // Use the custom hook for center handling
  const { handleCenter } = useCenterHandler({ stageRef, containerRef });
  
  // Use the custom hook for context menu handling
  const { handleContextMenu } = useContextMenuHandler({ selectionRectangle, setSelectionRectangle });
  
  // Use the custom hook for drag handling
  const { handleDrag } = useDragHandler({ stageRef, containerRef });
  
  // Use the custom hook for mouse move handling
  const { handleMouseMove } = useMouseMoveHandler({ containerRef, selectionRectangle, setSelectionRectangle });
  
  // Use the custom hook for mouse up handling
  const { handleMouseUp } = useMouseUpHandler({ stageRef, selectionRectangle, setSelectionRectangle, selectedSceneId: selectedSceneId! });

  // Use the custom hook for export image handling
  const { handleExportImage } = useExportImageHandler({ stageRef });

  useEffect(() => {
    updateSelectedIds([]);
  }, [selectedSceneId, updateSelectedIds]);

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
