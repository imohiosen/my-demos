
/* eslint-disable @typescript-eslint/no-explicit-any */
import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import throttle from 'lodash/throttle';
import { Presence } from "./store";
import { Point, Selection } from "./types";
import { client } from "./client";

const THROTTLE_DELAY = 200; // Adjust as needed for performance

const init = (set: any, _get: any) => ({
  cursorPosition: { x: 0, y: 0 },
  selectedItems: [],
  selectedIds: [], // Initialize empty array for selected IDs
  isSelecting: false, // Initialize selection state as false
  stagePosition: { x: 0, y: 0 },
  stageScale: { x: 1, y: 1 },
  stageViewBox: { x: 0, y: 0 },
  renderCount: 0,
  selectedStageId: undefined, // Initially no stage is selected
  updateCursorPosition: throttle((position: Point) => {
    set((state: any) => {
      state.cursorPosition = position;
    });
  }, THROTTLE_DELAY), // Update cursor position with throttling (60fps)
  updateSelectedItems: (items: Selection[]) => {
    set((state: any) => {
      state.selectedItems = items;
    });
  },
  updateSelectedIds: (ids: string[]) => {
    set((state: any) => {
      state.selectedIds = ids;
    });
  },
  updateIsSelecting: (isSelecting: boolean) => {
    set((state: any) => {
      state.isSelecting = isSelecting;
    });
  },
  updateStagePosition: throttle((position: Point) => {
    set((state: any) => {
      state.stagePosition = position;
    });
  }, THROTTLE_DELAY), // Update stage position with throttling
  updateStageViewBox: throttle((viewBox: Point) => {
    set((state: any) => {
      state.stageViewBox = viewBox;
    });
  }, THROTTLE_DELAY), // Update stage view box with throttling
  updateStageScale: throttle((scale: Point) => {
    set((state: any) => {
      state.stageScale = scale;
    });
  }, THROTTLE_DELAY), // Update stage scale with throttling
  updateSelectedStageId: (sceneId: string) => {
    set((state: any) => {
      state.selectedStageId = sceneId;
    }); // Update selected stage ID
    // get().saveSelectionToLocalStorage(); // Save to localStorage
    // console.log("Selected stage ID updated:", sceneId);
  },
  renderCanvas: () => {
    // This function can be used to trigger a re-render of the canvas
    // For example, you can call it after updating the state to ensure the canvas reflects the latest changes
    set((state: any) => {
      state.renderCount += 1; // Increment render count to trigger re-render
    });
  },
});

export const usePresenceStore = create<WithLiveblocks<Presence>>()(
  devtools(
    persist(
      immer(
        liveblocks(init, {
          client,
          presenceMapping: {
            cursorPosition: true,
            selectedItems: true,
            selectedIds: true,
            isSelecting: true,
            stagePosition: true,
            stageScale: true,
            stageViewBox: true,
            selectedStageId: true,
          },
        })
      ),
      {
        name: "local-storage",
        storage: createJSONStorage(() => ({
          getItem: (key: string) => localStorage.getItem(key),
          setItem: (key: string, value: string) =>
            localStorage.setItem(key, value),
          removeItem: (key: string) => localStorage.removeItem(key),
        })),
        version: 1,
        partialize: (state) => ({
          // Only persist the `count` field
          selectedStageId: state.selectedStageId,
        }),
      }
    ),
    {
      name: "presence-store", // Name of the store for debugging
      version: 1, // Version of the store
    }
  )
);
