/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas } from "fabric";
import { CanvasEventData } from "../ho-types";

export interface ContextMenuEventHandlers {
  handleContextMenuBefore: (e: any) => boolean;
}

export function createContextMenuHandlers(): ContextMenuEventHandlers {
  const handleContextMenuBefore = (e: CanvasEventData) => {
    const customEvent = new CustomEvent('X:CanvasContextMenuEvent', { 
        detail: {
          e,
          target: e.target,
          pointer: e.pointer
        }
    });

    document.dispatchEvent(customEvent);

    return false;
  };

  return {
    handleContextMenuBefore,
  };
}

export function attachContextMenuListeners(
  canvas: Canvas,
  handlers: ContextMenuEventHandlers,
): void {
  canvas.on("contextmenu:before", handlers.handleContextMenuBefore);
}
