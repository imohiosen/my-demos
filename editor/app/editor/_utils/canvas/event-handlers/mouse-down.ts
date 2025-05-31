/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas } from "fabric";

export interface MouseEventHandlers {
  handleMouseDown: (opt: any) => void;
}

interface MouseDownEventData {
  clientX: number;
  clientY: number;
  pointer: { x: number; y: number };
  target: any;
}

export function createMouseHandlers(): MouseEventHandlers {
  const isRightClick = (evt: MouseEvent | TouchEvent): boolean => {
    return ("button" in evt && evt.button === 2) ||
           ("touches" in evt && evt.touches.length === 2);
  };

  const getMenuCoordinates = (evt: MouseEvent | TouchEvent): { x: number; y: number } => {
    if ("touches" in evt && evt.touches.length >= 1) {
      return {
        x: evt.touches[0].clientX,
        y: evt.touches[0].clientY,
      };
    } else if ("clientX" in evt) {
      return {
        x: evt.clientX,
        y: evt.clientY,
      };
    }
    return { x: 0, y: 0 };
  };

  const handleMouseDown = (opt: any) => {
    const evt = opt.e as MouseEvent | TouchEvent;
    console.log("Mouse down event:", evt);

    if (isRightClick(evt)) {
      const pointerOnCanvas = opt.pointer; // Use the pointer from the event option
      const target = opt.target; // Use the target from the event option
      const menuCoords = getMenuCoordinates(evt);

      const eventData: MouseDownEventData = {
        clientX: menuCoords.x,
        clientY: menuCoords.y,
        pointer: pointerOnCanvas,
        target,
      };

      console.log("Right click at", eventData);
      // TODO: Implement context menu display logic
    } else {
      console.log("Hide context menu");
      // TODO: Implement context menu hide logic
    }
  };

  return {
    handleMouseDown,
  };
}

export function attachMouseListeners(
  canvas: Canvas,
  handlers: MouseEventHandlers,
): void {
  canvas.on("mouse:down", handlers.handleMouseDown);
}