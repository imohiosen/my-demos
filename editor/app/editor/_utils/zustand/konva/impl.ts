import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DGroupProps, DLayerProps, Selection } from "./store";
import {
  DAudio,
  DAudioCaptionProps,
  DAvatarProps,
  DBackgroundProps,
  DComponent,
  DElementProps,
  DGroup,
  DLayer,
  DMediaProps,
  DStage,
  DTextProps,
  Point,
  Presence,
  VideoDraftActions,
  VideoDraftState,
} from "./store";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createClient } from "@liveblocks/client";
import { title } from "process";
import { canvasTitleStyle } from "../../addTextStyles";
import { text } from "stream/consumers";
import Konva from "konva";
import { Layer } from "react-konva";

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
            stages: [],
            portrait: "landscape",
          },
          history: {
            past: [],
            future: [],
            maxHistorySize: 100,
          },
          id: "test-002",
          addStage: () => {
            set((state) => {
              const newStage: DStage = {
                id: generateId(),
                name: `Stage ${state.current.stages.length + 1}`,
                layer: {
                  id: generateId(),
                  groups: [
                    {
                      id: generateId(),
                      components: [],
                      attributes: {} as DGroupProps,
                    },
                  ],
                  attributes: {} as DLayerProps,
                },
              };
              state.current.stages = [...state.current.stages, newStage];
            });
          },
          getStageById(stageId) {
            const state = get();
            const stage = state.current.stages.find((s) => s.id === stageId);
            return stage;
          },
          addText(text, style) {
            set((state) => {
              const stage = state.current.stages.find(
                (s) => s.id === usePresenceStore.getState().selectedStageId
              );
              if (!stage) return;

              const layer = stage.layer; // Assuming adding to the first layer
              if (!layer) return;

              const group = layer.groups[0]; // Assuming adding to the first group
              if (!group) return;

              const newComponent: DComponent = {
                id: generateId(),
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
              };

              group.components = [...group.components, newComponent];
            });
          },
          handleTextDragEnd: (
            selection: Selection,
            e: Konva.KonvaEventObject<DragEvent>
          ) => {
            set((state) => {
              const textComp = getComponentBySelection(selection, state);

              if (textComp.type !== "text") {
                console.error("Selected component is not a text component");
                return;
              }
              if (!textComp.text || !textComp.text.attribute) {
                console.error("Text component does not have text attribute");
                return;
              }
              console.log("Dragging text component:", textComp.id);
              console.log("Selection deltaX:", e);

              textComp.text.attribute = { ...e?.target?.attrs };
            });
          },
          mergeCircleAttrs: (
            selection: Selection,
            attrs: Partial<DElementProps>
          ) => {
            set((state) => {
              const component = getComponentBySelection(selection, state);

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
            const state = get();
            const component = getComponentBySelection(selection, state);
            if (!component) {
              console.error("Component not found for selection", selection);
              return null;
            }

            // Assuming the component has an attribute with x, y, width, height
            const {
              x = 0,
              y = 0,
              width = 100,
              height = 100,
            } = component.element?.attribute || {};

            return { x, y, width, height };
          },

          addElement: (component: DComponent, selection: Selection) => {
            set((state: State) => {
              const { layerId, stageId } = selection;
              if (!stageId)
                return console.error(
                  `Stage ID is missing in selection: ${selection}`
                );
              if (!layerId)
                return console.error(
                  `Layer ID is missing in selection: ${selection}`
                );

              const stage = state.current.stages.find((s) => s.id === stageId);
              if (!stage)
                return console.error(`Stage with id ${stageId} not found`);

              const layer = stage.layer;
              if (!layer)
                return console.error(
                  `Layer with id ${layerId} not found in stage ${stageId}`
                );

              layer.groups.push({
                id: generateId(),
                components: [component],
                attributes: {} as DGroupProps, // Initialize with empty attributes
              });
              console.log(
                `Added component to layer ${layerId} in stage ${stageId}`, component
              );
            });
          },
          removeElement: (selection: Selection) => {
            set((state: State) => {
              const { componentId, groupId, layerId, stageId } = selection;
              if (!componentId || !groupId || !layerId || !stageId)
                return console.error("Selection is incomplete:", selection);

              const stage = state.current.stages.find((s) => s.id === stageId);
              if (!stage)
                return console.error(`Stage with id ${stageId} not found`);

              const layer = stage.layer;
              if (!layer)
                return console.error(
                  `Layer with id ${layerId} not found in stage ${stageId}`
                );

              const group = layer.groups.find((g) => g.id === groupId);
              if (!group)
                return console.error(
                  `Group with id ${groupId} not found in layer ${layerId}, stage ${stageId}`
                );

              group.components = group.components.filter(
                (c) => c.id !== componentId
              );
            });
          },

          getCurrentLayerSelection: (): Selection => {
            const state = get();
            const selectedStageId = usePresenceStore.getState().selectedStageId;
            if (!selectedStageId) throw new Error(`Stage ID is not selected`);
            const stage = state.current.stages.find(
              (s: DStage) => s.id === selectedStageId
            );
            if (!stage)
              throw new Error(`Stage with id ${selectedStageId} not found`);
            const layer = stage.layer; // Assuming we want the first layer
            if (!layer)
              throw new Error(`Layer not found in stage ${selectedStageId}`);
            return {
              layerId: layer.id,
              stageId: stage.id,
              type: "layer",
            };
          },
          getCurrentLayer: (): DLayer | undefined => {
            const state = get();
            const selectedStageId = usePresenceStore.getState().selectedStageId;
            if (!selectedStageId) throw new Error(`Stage ID is not selected`);
            const stage = state.current.stages.find(
              (s: DStage) => s.id === selectedStageId
            );
            if (!stage)
              throw new Error(`Stage with id ${selectedStageId} not found`);
            return stage.layer; // Assuming we want the first layer
          },
        }),
        {
          client,
          storageMapping: {
            current: true,
          },
        }
      )
    )
  )
);

const init = (set, get) => ({
  cursorPosition: { x: 0, y: 0 },
  selectedItems: [],
  stagePosition: { x: 0, y: 0 },
  stageScale: { x: 1, y: 1 },
  stageViewBox: { x: 0, y: 0 },
  renderCount: 0,
  updateCursorPosition: (position: Point) => {
    set((state) => {
      state.cursorPosition = position;
    });
  }, // Update cursor position
  updateSelectedItems: (items: Selection[]) => {
    set((state) => {
      state.selectedItems = items;
    });
  }, // Update selected items
  updateStagePosition: (position: Point) => {
    set((state) => {
      state.stagePosition = position;
    }); // Update stage position
  },
  updateStageViewBox: (viewBox: Point) => {
    set((state) => {
      state.stageViewBox = viewBox;
    }); // Update stage view box
  },
  updateStageScale: (scale: Point) => {
    set((state) => {
      state.stageScale = scale;
    }); // Update stage scale
  },
  updateSelectedStageId: (stageId: string) => {
    set((state) => {
      state.selectedStageId = stageId;
    }); // Update selected stage ID
    // get().saveSelectionToLocalStorage(); // Save to localStorage
    // console.log("Selected stage ID updated:", stageId);
  },
  renderCanvas: () => {
    // This function can be used to trigger a re-render of the canvas
    // For example, you can call it after updating the state to ensure the canvas reflects the latest changes
    set((state) => {
      state.renderCount += 1; // Increment render count to trigger re-render
    });
  }
  // Add more actions as needed
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
    )
  )
);

function getComponent(
  componentId: string,
  groupId: string,
  layerId: string,
  stageId: string,
  state: VideoDraftState
): DComponent {
  const stage = state.current.stages.find((s) => s.id === stageId);
  if (!stage) throw new Error(`Stage with id ${stageId} not found`);

  const layer = stage.layer;
  if (!layer)
    throw new Error(`Layer with id ${layerId} not found in stage ${stageId}`);

  const group = layer.groups.find((g) => g.id === groupId);
  if (!group)
    throw new Error(
      `Group with id ${groupId} not found in layer ${layerId}, stage ${stageId}`
    );
  const c = group.components.find((c) => c.id === componentId);
  if (!c)
    throw new Error(
      `Component with id ${componentId} not found in group ${groupId}, layer ${layerId}, stage ${stageId}`
    );
  return c;
}

function getComponentBySelection(
  selection: Selection,
  state: VideoDraftState
): DComponent {
  const { componentId, groupId, layerId, stageId } = selection;
  if (!componentId || !groupId || !layerId || !stageId) {
    throw new Error("Selection is incomplete");
  }
  return getComponent(componentId, groupId, layerId, stageId, state);
}
