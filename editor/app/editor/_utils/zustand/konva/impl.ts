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
          id: "test-001",
          addStage: () => {
            set((state) => {
              const newStage: DStage = {
                id: generateId(),
                name: `Stage ${state.current.stages.length + 1}`,
                layers: [
                  {
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
                ],
              };
              state.current.stages = [
                ...state.current.stages,
                newStage
              ];
            }
            );
          },
          duplicateStage: (stageId: string) => {
            console.log("[duplicateStage]");
          },
          updateStage: (stageId: string, updates: Partial<DStage>) => {
            console.log("[updateStage]");
          },
          removeStage: (stageId: string) => {
            console.log("[removeStage]");
          },
          reorderStages: (fromIndex: number, toIndex: number) => {
            console.log("[reorderStages]");
          },

          // Layer operations
          addLayer: (
            layer: Omit<DLayer, "id" | "metadata">,
            stageId: string
          ) => {
            console.log("[addLayer]");
          },
          updateLayer: (
            layerId: string,
            stageId: string,
            updates: Partial<DLayer>
          ) => {
            console.log("[updateLayer]");
          },
          removeLayer: (layerId: string, stageId: string) => {
            console.log("[removeLayer]");
          },
          reorderLayers: (
            stageId: string,
            fromIndex: number,
            toIndex: number
          ) => {
            console.log("[reorderLayers]");
          },

          // Group operations
          addGroup: (
            group: Omit<DGroup, "id" | "metadata">,
            layerId: string,
            stageId: string
          ) => {
            console.log("[addGroup]");
          },
          updateGroup: (
            groupId: string,
            layerId: string,
            stageId: string,
            updates: Partial<DGroup>
          ) => {
            console.log("[updateGroup]");
          },
          removeGroup: (groupId: string, layerId: string, stageId: string) => {
            console.log("[removeGroup]");
          },
          reorderGroups: (
            layerId: string,
            stageId: string,
            fromIndex: number,
            toIndex: number
          ) => {
            console.log("[reorderGroups]");
          },

          // Component operations
          addComponent: (
            component: Omit<DComponent, "id" | "metadata">,
            groupId: string,
            layerId: string,
            stageId: string
          ) => {
            console.log("[addComponent]");
          },
          updateComponent: (
            componentId: string,
            groupId: string,
            layerId: string,
            stageId: string,
            updates: Partial<DComponent>
          ) => {
            console.log("[updateComponent]");
          },
          removeComponent: (
            componentId: string,
            groupId: string,
            layerId: string,
            stageId: string
          ) => {
            console.log("[removeComponent]");
          },
          reorderComponents: (
            groupId: string,
            layerId: string,
            stageId: string,
            fromIndex: number,
            toIndex: number
          ) => {
            console.log("[reorderComponents]");
          },

          // Bulk operations
          duplicateComponent: (
            componentId: string,
            groupId: string,
            layerId: string,
            stageId: string
          ) => {
            console.log("[duplicateComponent]");
          },
          groupComponents: (
            componentIds: string[],
            groupId: string,
            layerId: string,
            stageId: string
          ) => {
            console.log("[groupComponents]");
          },
          ungroupComponents: (
            groupId: string,
            layerId: string,
            stageId: string
          ) => {
            console.log("[ungroupComponents]");
          },

          // Audio operations
          addAudio: (audio: DAudio, stageId: string) => {
            console.log("[addAudio]");
          },
          updateAudio: (
            audioId: string,
            stageId: string,
            updates: Partial<DAudio>
          ) => {
            console.log("[updateAudio]");
          },
          removeAudio: (audioId: string, stageId: string) => {
            console.log("[removeAudio]");
          },

          // Selection operations
          selectItem: (
            type: "stage" | "layer" | "group" | "component",
            id: string
          ) => {
            console.log("[selectItem]");
          },
          clearSelection: () => {
            console.log("[clearSelection]");
          },
          selectMultiple: (items: Array<{ type: string; id: string }>) => {
            console.log("[selectMultiple]");
          },

          // History operations
          undo: () => {
            console.log("[undo]");
          },
          redo: () => {
            console.log("[redo]");
          },
          clearHistory: () => {
            console.log("[clearHistory]");
          },
          createCheckpoint: (name?: string) => {
            console.log("[createCheckpoint]");
          },
          saveToHistory: () => {
            console.log("[saveToHistory]");
          },

          // Utility operations
          exportDraft: () => {
            console.log("[exportDraft]");
            return JSON.stringify(get().current);
          },
          importDraft: (data: string) => {
            console.log("[importDraft]");
          },
          validateDraft: () => {
            return { isValid: false, errors: [] };
          },
          optimizeDraft: () => {
            console.log("[optimizeDraft]");
          },

          saveAsTemplate: (name: string) => {
            console.log("[saveAsTemplate]");
          },
          loadTemplate: (templateId: string) => {
            console.log("[loadTemplate]");
          },
          selectedStage: () => {},
          getStageById(stageId) {
            const state = get();
            const stage = state.current.stages.find((s) => s.id === stageId);
            return stage;
          },
          updateComponentAttributes: (
            componentId: string,
            groupId: string,
            layerId: string,
            stageId: string,
            type: string,
            attributes: Partial<
              | DElementProps
              | DTextProps
              | DAvatarProps
              | DMediaProps
              | DBackgroundProps
              | DAudioCaptionProps
            >
          ) => {
            set((state) => {
              const component = getComponent(
                componentId,
                groupId,
                layerId,
                stageId,
                state
              );
              if (
                type === "element" &&
                component.element &&
                component.element.attribute
              )
                component.element.attribute = {
                  ...component.element.attribute,
                  ...attributes,
                } as DElementProps;
              else
                console.warn(
                  `Component ${componentId} does not have an element attribute to update.`
                );
            });
          },
          addText(text, style) {
            set((state) => {
              const stage = state.current.stages.find(
                (s) => s.id === usePresenceStore.getState().selectedStageId
              );
              if (!stage) return;

              const layer = stage.layers[0]; // Assuming adding to the first layer
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
                    type: 'title',
                    text: text,
                  }
                },
                metadata: createMetadata(),
              };

              group.components = [
                ...group.components,
                newComponent,
              ];
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
    immer(liveblocks(
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
    ))
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

  const layer = stage.layers.find((l) => l.id === layerId);
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
