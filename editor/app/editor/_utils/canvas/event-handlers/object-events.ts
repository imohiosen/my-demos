/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas } from "fabric";

export interface ObjectEventHandlers {
  handleObjectAdded: () => void;
  handleObjectRemoved: () => void;
  handleObjectModified: () => void;
  handlePathCreated: () => void;
}

export function createObjectHandlers(
  autosaveEnabled: boolean,
  saveState: () => void,
): ObjectEventHandlers {
  const handleCanvasChange = () => {
    if (autosaveEnabled) {
      saveState();
    }
  };

  return {
    handleObjectAdded: handleCanvasChange,
    handleObjectRemoved: handleCanvasChange,
    handleObjectModified: handleCanvasChange,
    handlePathCreated: handleCanvasChange,
  };
}

export function attachObjectListeners(
  canvas: Canvas,
  handlers: ObjectEventHandlers,
): void {
  canvas.on("object:added", handlers.handleObjectAdded);
  canvas.on("object:removed", handlers.handleObjectRemoved);
  canvas.on("object:modified", handlers.handleObjectModified);
  canvas.on("path:created", handlers.handlePathCreated);
}
