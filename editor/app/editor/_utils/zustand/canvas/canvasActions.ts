import { Canvas as FCanvas } from "fabric";
import { Audio, CanvasHistory, Scene } from "./canvasState";

export interface CanvasActions {
  initEditor: (canvas: FCanvas) => void;
  initializeCanvas: (el: HTMLCanvasElement) => FCanvas;
  getSceneAudio: (sceneId: string) => Audio | null;
  setCanvas: (canvas: FCanvas) => void;
  addText: (text: string, style: unknown) => void;
  undo: () => void;
  redo: () => void;
  saveState: () => void;
  clearCanvas: () => void;
  setAutosave: (enabled: boolean) => void;
  setupCanvasListeners: () => void;
  setSelectedObjects: (objects: unknown[]) => void;
  // Scene actions
  selectScene: (sceneId: string) => void;
  addScene: () => void;
  removeScene: (sceneId: string) => void;
  clearSelection: () => void;
  // Scene canvas management
  loadSceneCanvas: (sceneId: string) => void;
  saveCurrentSceneCanvas: () => void;
  duplicateScene: (sceneId: string) => void;
  groupObjects: () => void;
  ungroupObjects: () => void;
}
