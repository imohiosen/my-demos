import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { CanvasState, initialCanvasState } from "./canvasState";
import { CanvasActions } from "./canvasActions";
import { createCanvasActions } from "./canvasActionImplementations";

type CanvasStore = CanvasState & CanvasActions;

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialCanvasState,
      ...createCanvasActions(set, get),
    })),
    { name: "CanvasStore" }
  )
);
