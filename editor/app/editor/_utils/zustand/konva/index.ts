// Main exports for the Konva store modules
export { useCanvasEditorStore } from './canvasEditorImpl';
export { usePresenceStore } from './presenceImpl';
export { useUIConfigStore, type UIConfig } from './uiConfigImpl';
export { client } from './client';
export {
  generateId,
  createMetadata,
  updateMetadata,
  getComponentFromSelectedScene,
  type ImmerState
} from './utils';

// Re-export types from store and types modules
export type {
  Presence,
  UIState,
  VideoDraftActions,
  VideoDraftState,
} from "./store";

export type {
  DComponent,
  DElementProps,
  DGroup,
  Point,
  Selection,
  SelectionRectangle
} from "./types";
