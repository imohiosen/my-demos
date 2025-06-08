/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRef, useState } from "react";
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
import { useInitialScale } from "../../_hooks/useInitialScale";
import { useViewportUpdater } from "../../_hooks/useViewportUpdater";
import { useRoomConnection } from "../../_hooks/useRoomConnection";
import { useSceneSelectionManager } from "../../_hooks/useSceneSelectionManager";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

const selRect: SelectionRectangle = {
  visible: false,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
};

const CanvasContentView = (props: Props) => {
  usePresenceStore((s) => s.liveblocks.isStorageLoading);
  usePresenceStore((s) => s.stageScale);
  usePresenceStore((s) => s.renderCount);
  usePresenceStore((s) => s.stageViewBox);
  useCanvasEditorStore((s) => s.liveblocks.isStorageLoading);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [selectionRectangle, setSelectionRectangle] = useState(selRect);

  const draftId = useCanvasEditorStore((state) => state.id);
  const updateStageViewBox = usePresenceStore((s) => s.updateStageViewBox);
  const selectedSceneId = usePresenceStore((s) => s.selectedStageId);
  const selectedIds = usePresenceStore((s) => s.selectedIds);
  const updateSelectedIds = usePresenceStore((s) => s.updateSelectedIds);

  const enterPresenceRoom = usePresenceStore((s) => s.liveblocks.enterRoom);
  const leavePresenceRoom = usePresenceStore((s) => s.liveblocks.leaveRoom);
  const enterRoom = useCanvasEditorStore((s) => s.liveblocks.enterRoom);
  const leaveRoom = useCanvasEditorStore((s) => s.liveblocks.leaveRoom);
  const getSceneById = useCanvasEditorStore((s) => s.getSceneById);
  const selectedScene = getSceneById(selectedSceneId!);
  const { handleStageClick } = useStageClickHandler({ selectionRectangle });
  const { handleMouseDown } = useMouseDownHandler({ setSelectionRectangle });
  const { handleWheel } = useWheelHandler({ stageRef });
  const { handleCenter } = useCenterHandler({ stageRef, containerRef });
  const { handleContextMenu } = useContextMenuHandler({
    selectionRectangle,
    setSelectionRectangle,
  });
  const { handleDrag } = useDragHandler({ stageRef, containerRef });
  const { handleMouseMove } = useMouseMoveHandler({
    containerRef,
    selectionRectangle,
    setSelectionRectangle,
  });
  const { handleMouseUp } = useMouseUpHandler({
    stageRef,
    selectionRectangle,
    setSelectionRectangle,
    selectedSceneId: selectedSceneId!,
  });
  const { handleExportImage } = useExportImageHandler({ stageRef });
  const { getInitialScale } = useInitialScale({ containerRef });

  useViewportUpdater({ containerRef, updateStageViewBox });
  useRoomConnection({
    draftId,
    enterPresenceRoom,
    leavePresenceRoom,
    enterRoom,
    leaveRoom,
  });
  useSceneSelectionManager({ selectedSceneId, updateSelectedIds });

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

export default CanvasContentView;
