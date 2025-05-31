/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas } from "fabric";
import { CanvasState } from "../../zustand/canvas/canvasState";
import { EventHandlerConfig } from "../types";
import { createObjectHandlers, attachObjectListeners } from "./object-events";
import { createSelectionHandlers, attachSelectionListeners } from "./selection";
import { createContextMenuHandlers, attachContextMenuListeners } from "./context-menu";
import { createMouseHandlers, attachMouseListeners } from "./mouse-down";

export class CanvasEventManager {
  private canvas: Canvas;
  private config: EventHandlerConfig;

  constructor(
    canvas: Canvas,
    autosaveEnabled: boolean,
    saveState: () => void,
    set: (partial: Partial<CanvasState>) => void,
  ) {
    this.canvas = canvas;
    this.config = {
      autosaveEnabled,
      saveState,
      set,
    };
  }

  /**
   * Initialize all canvas event listeners
   */
  public initializeAllListeners(): void {
    this.initializeObjectListeners();
    this.initializeSelectionListeners();
    this.initializeContextMenuListeners();
    this.initializeMouseListeners();
  }

  /**
   * Initialize object-related event listeners (add, remove, modify, path creation)
   */
  private initializeObjectListeners(): void {
    const handlers = createObjectHandlers(
      this.config.autosaveEnabled,
      this.config.saveState,
    );
    attachObjectListeners(this.canvas, handlers);
  }

  /**
   * Initialize selection-related event listeners
   */
  private initializeSelectionListeners(): void {
    const handlers = createSelectionHandlers(this.config.set);
    attachSelectionListeners(this.canvas, handlers);
  }

  /**
   * Initialize context menu event listeners
   */
  private initializeContextMenuListeners(): void {
    const handlers = createContextMenuHandlers();
    attachContextMenuListeners(this.canvas, handlers);
  }

  /**
   * Initialize mouse event listeners
   */
  private initializeMouseListeners(): void {
    const handlers = createMouseHandlers();
    attachMouseListeners(this.canvas, handlers);
  }

  /**
   * Remove all event listeners (useful for cleanup)
   */
  public removeAllListeners(): void {
    this.canvas.off();
  }

  /**
   * Update configuration (e.g., toggle autosave)
   */
  public updateConfig(newConfig: Partial<EventHandlerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Re-initialize object listeners if autosave setting changed
    if (newConfig.autosaveEnabled !== undefined) {
        // TODO: fix this
      this.canvas.off("object:added");
      this.canvas.off("object:removed");
      this.canvas.off("object:modified");
      this.canvas.off("path:created");
      this.initializeObjectListeners();
    }
  }
}
