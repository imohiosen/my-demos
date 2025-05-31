/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas } from "fabric";
import { CanvasState } from "../../zustand/canvas/canvasState";
import { use } from "react";
import { useCanvasContextMenu } from "@/app/editor/_components/context-menus/CanvasContextMenuProvider";
import { useCanvasStore } from "../../zustand/canvas/canvasStore";

export interface SelectionEventHandlers {
  handleSelectionCreated: (e: any) => void;
  handleSelectionUpdated: (e: any) => void;
  handleSelectionCleared: () => void;
}

export function createSelectionHandlers(
  set: (partial: Partial<CanvasState>) => void,
): SelectionEventHandlers {
  const handleSelectionCreated = (e: any) => {
    console.log("Selection created:", e.selected);
    useCanvasStore .getState().setSelectedObjects(e.selected || []);
    // dispatch a custom event for selection creation
    const customEvent = new CustomEvent('X:CanvasSelectionEvent', {
      detail: {
        type: 'selectionCreated',
        selected: e.selected || [],
        e,
      },
    });
    document.dispatchEvent(customEvent);
  };

  const handleSelectionUpdated = (e: any) => {
    console.log("Selection updated:", e.selected);
    useCanvasStore.getState().setSelectedObjects(e.selected || []);
    // dispatch a custom event for selection update
    const customEvent = new CustomEvent('X:CanvasSelectionEvent', {
      detail: {
        type: 'selectionUpdated',
        selected: e.selected || [],
        e,
      },
    });
    document.dispatchEvent(customEvent);
  };

  const handleSelectionCleared = () => {
    console.log("Selection cleared");
    useCanvasStore.getState().setSelectedObjects([]);
    // dispatch a custom event for selection cleared
    const customEvent = new CustomEvent('X:CanvasSelectionEvent', {
      detail: {
        type: 'selectionCleared',
        selected: [],
      },
    });
    
    document.dispatchEvent(customEvent);    
  };

  return {
    handleSelectionCreated,
    handleSelectionUpdated,
    handleSelectionCleared,
  };
}

export function attachSelectionListeners(
  canvas: Canvas,
  handlers: SelectionEventHandlers,
): void {
  canvas.on("selection:created", handlers.handleSelectionCreated);
  canvas.on("selection:updated", handlers.handleSelectionUpdated);
  canvas.on("selection:cleared", handlers.handleSelectionCleared);
}
