import { create } from "zustand";

export type UIConfig = {
  ADD_CANVAS_COMPONENT_BUTTON_SIZE: number;
  ADD_CANVAS_ICON_ICON_SIZE: number;
  ADD_CANVAS_ICON_STROKE_WIDTH: number;
  ADD_CANVAS_ICON_DEFAULT_COLOR_HEX: string;
};

export const useUIConfigStore = create<UIConfig>()(
  (set, get) => ({
    ADD_CANVAS_COMPONENT_BUTTON_SIZE: 50, // Default size for the button
    ADD_CANVAS_ICON_ICON_SIZE: 100,
    ADD_CANVAS_ICON_STROKE_WIDTH: 4,
    ADD_CANVAS_ICON_DEFAULT_COLOR_HEX: '#000000',
  })
);
