/* eslint-disable @typescript-eslint/no-explicit-any */

export interface EventHandlerConfig {
  autosaveEnabled: boolean;
  saveState: () => void;
  set: (partial: any) => void;
}

export interface CanvasEventData {
  clientX: number;
  clientY: number;
  pointer: { x: number; y: number };
  target: any;
}

export interface SelectionEventData {
  selected: any[];
}

// Event handler function types
export type ObjectEventHandler = () => void;
export type SelectionEventHandler = (e: any) => void;
export type ContextMenuEventHandler = () => boolean;
export type MouseEventHandler = (opt: any) => void;

// Event types enum for better type safety
export enum CanvasEventType {
  OBJECT_ADDED = "object:added",
  OBJECT_REMOVED = "object:removed", 
  OBJECT_MODIFIED = "object:modified",
  PATH_CREATED = "path:created",
  SELECTION_CREATED = "selection:created",
  SELECTION_UPDATED = "selection:updated",
  SELECTION_CLEARED = "selection:cleared",
  CONTEXT_MENU_BEFORE = "contextmenu:before",
  MOUSE_DOWN = "mouse:down",
}
