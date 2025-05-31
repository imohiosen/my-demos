import { Canvas } from "fabric";
import { CanvasState } from "../zustand/canvas/canvasState";
import { CanvasEventManager } from "./event-handlers/event-manager";

/**
 * Initialize canvas event listeners using the modular approach
 */
export function initializeCanvasListeners(
  autosaveEnabled: boolean,
  saveState: () => void,
  set: (partial: Partial<CanvasState>) => void,
  canvas: Canvas,
): CanvasEventManager {
  const eventManager = new CanvasEventManager(
    canvas,
    autosaveEnabled,
    saveState,
    set,
  );

  eventManager.initializeAllListeners();
  return eventManager;
}

// Re-export everything for easy access
export * from "./types";
export * from "./event-handlers/event-manager";
export * from "./event-handlers/object-events";
export * from "./event-handlers/selection";
export * from "./event-handlers/context-menu";
export * from "./event-handlers/mouse-down";


