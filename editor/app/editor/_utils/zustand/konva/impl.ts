import { vi } from 'vitest';
import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Presence,
  UIState,
  VideoDraftActions,
  VideoDraftState,
} from "./store";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createClient } from "@liveblocks/client";
import Konva from "konva";
import { WritableDraft } from "immer";
import { DComponent, DElementProps, DGroup, Point, Selection, SelectionRectangle } from "./types";

type State = VideoDraftState;
type Actions = VideoDraftActions;

// Helper function to generate unique IDs
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper function to create metadata
const createMetadata = () => ({
  createdAt: Date.now(),
  modifiedAt: Date.now(),
});

// Helper function to update metadata
const updateMetadata = (metadata?: {
  createdAt: number;
  modifiedAt: number;
}) => ({
  ...metadata,
  modifiedAt: Date.now(),
});

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

    return await response.json(); // should be: { token: "..." }
  },
});

export const useCanvasEditorStore = create<WithLiveblocks<State & Actions>>()(
  devtools(
    immer(
      liveblocks(
        (set, get) => ({
          // Initial state
          current: {
            id: get()?.id || "",
            scenes: {},
            portrait: "landscape",
          },
          history: {
            past: [],
            future: [],
            maxHistorySize: 100,
          },
          id: "test-005",
          addScene: () => {
            set((state) => {
              state.current.scenes[generateId()] = [];
            });
          },
          getScene(id: string) {
            const state = get();
            if (!state.current.scenes[id]) {
              console.error(`Scene with id ${id} not found`);
              // clear zustand local persist
              return [];

            }
          },
          addText(text, style) {
            set((state) => {
              const sceneId = usePresenceStore.getState().selectedStageId; // Ensure the selected stage ID is set
              if (!sceneId) {
                throw new Error(`Error: No stage selected`);
              }
              const stage = state.current.scenes[sceneId];

              const scene = state.current.scenes[sceneId];

              if (!scene) {
                console.error(`Scene with id ${sceneId} not found`);
                return;
              }

              // Create the component directly in the immer draft state
              state.current.scenes[sceneId].push({
                componentId: generateId(),
                sceneId: sceneId,
                type: "text",
                text: {
                  attribute: {
                    x: 0,
                    y: 0,
                    fontSize: 96,
                    fontWeight: 700,
                    fontFamily: "Arial",
                    type: "title",
                    text: text,
                  },
                },
                metadata: createMetadata(),
              });
            });
          },
          handleTextDragEnd: (
            selection: Selection,
            e: Konva.KonvaEventObject<DragEvent>
          ) => {
            set((state) => {
              const { comp: textComp, selectedScene } =
                getComponentFromSelectedScene(selection, state);

              if (textComp.type !== "text") {
                throw new Error(
                  `Selected component is not a text component: ${textComp.type}`
                );
              }
              if (!textComp.text || !textComp.text.attribute) {
                throw new Error(`Text component does not have text attribute`);
              }
              textComp.text.attribute = { ...e?.target?.attrs };
            });
          },
          mergeAttributes: (
            selection: Selection,
            attrs: Partial<DElementProps>
          ) => {
            set((state) => {
              const { comp: component, selectedScene } =
                getComponentFromSelectedScene(selection, state);

              if (component.type !== "element") {
                console.error(
                  "Selected component is not an element component:",
                  component.type
                );
                return;
              }

              if (!component.element || !component.element.attribute) {
                console.error(
                  "Element component does not have element attribute"
                );
                return;
              }
              if (!component)
                console.log("Component not found for selection", selection);

              component.element.attribute = {
                ...component.element.attribute,
                ...attrs,
              };
              
            });
          },
          getComponentBoundingRect: (selection: Selection) => {
            
            // Assuming the component has an attribute with x, y, width, height
            const {
              x = 0,
              y = 0,
              width = 100,
              height = 100,
            } = {};

            return { x, y, width, height };
          },

          addElement: (component: DComponent) => {
            set((state) => {
              const sceneId = component.sceneId;
              const scene = state.current.scenes[sceneId];
              if (!scene) {
                throw new Error(
                  `Scene with id ${sceneId} not found`
                );
              }

              // Create the component directly in the immer draft state
              state.current.scenes[sceneId].push({
                componentId: component.componentId,
                sceneId: sceneId,
                type: "element",
                element: {
                  attribute: {
                    ...component.element?.attribute,
                  },
                },
                metadata: createMetadata(),
              });
            });
          },


          getSceneById: (id: string): (DComponent)[]  => {
            const state = get();
            if (!state.current.scenes[id]) {
              return [];
            }
            return state.current.scenes[id];
          },
        }),
        {
          client,
          storageMapping: {
            current: true,
          },
        }
      )
    ),
    {
      name: "video-draft-store", // Name of the store for debugging
      version: 1, // Version of the store
    }
  )
);

const init = (set, get) => ({
  cursorPosition: { x: 0, y: 0 },
  selectedItems: [],
  stagePosition: { x: 0, y: 0 },
  stageScale: { x: 1, y: 1 },
  stageViewBox: { x: 0, y: 0 },
  renderCount: 0,
  selectedStageId: null, // Initially no stage is selected
  updateCursorPosition: (position: Point) => {
    set((state: Presence) => {
      state.cursorPosition = position;
    });
  }, // Update cursor position
  updateSelectedItems: (items: Selection[]) => {
    set((state: Presence) => {
      state.selectedItems = items;
    });
  }, // Update selected items
  updateStagePosition: (position: Point) => {
    set((state: Presence) => {
      state.stagePosition = position;
    }); // Update stage position
  },
  updateStageViewBox: (viewBox: Point) => {
    set((state: Presence) => {
      state.stageViewBox = viewBox;
    }); // Update stage view box
  },
  updateStageScale: (scale: Point) => {
    set((state: Presence) => {
      state.stageScale = scale;
    }); // Update stage scale
  },
  updateSelectedStageId: (sceneId: string) => {
    set((state: Presence) => {
      state.selectedStageId = sceneId;
    }); // Update selected stage ID
    // get().saveSelectionToLocalStorage(); // Save to localStorage
    // console.log("Selected stage ID updated:", sceneId);
  },
  renderCanvas: () => {
    // This function can be used to trigger a re-render of the canvas
    // For example, you can call it after updating the state to ensure the canvas reflects the latest changes
    set((state) => {
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
type ImmerState = WritableDraft<WithLiveblocks<VideoDraftState & VideoDraftActions>>;
function getComponentFromSelectedScene(
  selection: Selection,
  state: ImmerState
) {
  const selectedScene = usePresenceStore.getState().selectedStageId;
  if (!selectedScene) throw new Error(`No scene selected`);
  const comp = state.current.scenes[selectedScene].find(
    (c) => c.componentId === selection.componentId
  ) as DComponent;
  if (!comp) {
    throw new Error(
      `Component with id ${selection.componentId} not found in scene ${selectedScene}`
    );
  }
  return { comp, selectedScene };
}

