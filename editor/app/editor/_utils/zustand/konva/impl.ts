import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";
import { create } from "zustand";
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
  publicApiKey:
    "pk_dev_7NjVi0ycMqKpfqN6eyhfpDVAt7m8uktB2Q8n2tc8uOe7R0HX_2OBqOeK8BzgGvUr",
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
          handleTextDragEnd: (selection: Selection, e: Konva.KonvaEventObject<DragEvent>) => {
            set((state) => {
              const textComp = getComponentBySelection(selection, state);

              if (textComp.type !== "text") {
                console.error("Selected component is not a text component");
                return
              }
              if (!textComp.text || !textComp.text.attribute) {
                console.error("Text component does not have text attribute");
                return;
              } 
              console.log("Dragging text component:", textComp.id);
              console.log("Selection deltaX:", e);
              
              textComp.text.attribute = {...e?.target?.attrs};

              

            });
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

export const usePresenceStore = create<WithLiveblocks<Presence>>()(
  devtools(
    immer(
      liveblocks(
        (set) => ({
          cursorPosition: { x: 0, y: 0 },
          selectedItems: [],
          stagePosition: { x: 0, y: 0 },
          stageScale: { x: 1, y: 1 },
          stageViewBox: { x: 0, y: 0 },
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
          },
        }),
        {
          client,
          presenceMapping: {
            cursorPosition: true,
            selectedItems: true,
            stagePosition: true,
            stageScale: true,
            stageViewBox: true,
            selectedStageId: true,
          },
        }
      )
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
