import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";
import { createJSONStorage } from "zustand/middleware";
import { createClient } from "@liveblocks/client";
import throttle from 'lodash/throttle';
import { Presence } from "./types";
import { Point, Selection } from "./types";

const THROTTLE_DELAY = 200;

const client = createClient({
  authEndpoint: async (roomId?) => {
    const response = await fetch("/api/liveblocks", {
      method: "POST",
      headers: {
        Authentication: "token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: "ab-01", roomId }),
    });

    return await response.json();
  },
});

const createPresenceActions = (set: any, get: any) => ({
  cursorPosition: { x: 0, y: 0 },
  selectedItems: [],
  selectedIds: [],
  isSelecting: false,
  stagePosition: { x: 0, y: 0 },
  stageScale: { x: 1, y: 1 },
  stageViewBox: { x: 0, y: 0 },
  renderCount: 0,
  selectedStageId: undefined,

  // Actions
  updateCursorPosition: throttle((position: Point) => {
    set((state: Presence) => {
      state.cursorPosition = position;
    });
  }, THROTTLE_DELAY),

  updateSelectedItems: (items: Selection[]) => {
    set((state: Presence) => {
      state.selectedItems = items;
    });
  },

  updateSelectedIds: (ids: string[]) => {
    set((state: Presence) => {
      state.selectedIds = ids;
    });
  },

  updateIsSelecting: (isSelecting: boolean) => {
    set((state: Presence) => {
      state.isSelecting = isSelecting;
    });
  },

  updateStagePosition: throttle((position: Point) => {
    set((state: Presence) => {
      state.stagePosition = position;
    });
  }, THROTTLE_DELAY),

  updateStageViewBox: throttle((viewBox: Point) => {
    set((state: Presence) => {
      state.stageViewBox = viewBox;
    });
  }, THROTTLE_DELAY),

  updateStageScale: throttle((scale: Point) => {
    set((state: Presence) => {
      state.stageScale = scale;
    });
  }, THROTTLE_DELAY),

  updateSelectedStageId: (sceneId: string) => {
    set((state: Presence) => {
      state.selectedStageId = sceneId;
    });
  },

  renderCanvas: () => {
    set((state: Presence) => {
      state.renderCount += 1;
    });
  },
});

export const usePresenceStore = create<WithLiveblocks<Presence>>()(
  devtools(
    persist(
      immer(
        liveblocks(createPresenceActions, {
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
        name: "presence-storage",
        storage: createJSONStorage(() => ({
          getItem: (key: string) => localStorage.getItem(key),
          setItem: (key: string, value: string) =>
            localStorage.setItem(key, value),
          removeItem: (key: string) => localStorage.removeItem(key),
        })),
        version: 1,
        partialize: (state) => ({
          selectedStageId: state.selectedStageId,
        }),
      }
    ),
    {
      name: "presence-store",
      version: 1,
    }
  )
);
