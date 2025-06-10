import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UIState, SelectionRectangle } from "./types";

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      selectionRectangle: {
        visible: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      },

      setSelectionRectangle: (selectionRectangle: SelectionRectangle) => {
        set({ selectionRectangle });
      },
    }),
    {
      name: "ui-store",
      version: 1,
    }
  )
);
