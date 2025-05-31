import { create } from "zustand";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  VideoDraftActions,
  VideoDraftState,
} from "./store";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

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

export const useCanvasEditorStore = create<State & Actions>()(
  devtools(
    immer((set, get) => ({
      present: {
        id: generateId(),
        version: "1.0.0",
        width: 1920,
        height: 1080,
        stages: [
          {
            id: "stage-1",
            name: "Stage 1",
            layers: [
              {
                id: generateId(),
                attributes: {
                  opacity: 1,
                  visible: true,
                },
                groups: [
                  {
                    id: generateId(),
                    attributes: {
                      x: 0,
                      y: 0,
                      width: 1920,
                      height: 1080,
                      rotation: 0,
                      scaleX: 1,
                      scaleY: 1,
                      opacity: 1,
                      visible: true,
                    },
                    components: [
                      {
                        id: generateId(),
                        type: "element",
                        element: {
                          attribute: {
                            type: "rectangle",
                            x: 100,
                            y: 100,
                            width: 200,
                            height: 200,
                            fill: "red",
                            stroke: "black",
                            strokeWidth: 2,
                            rotation: 0,
                            scaleX: 1,
                            scaleY: 1,
                            opacity: 1,
                            visible: true,
                          },
                        },
                      },
                      {
                        id: generateId(),
                        type: "element",
                        element: {
                          attribute: {
                            type: "rectangle",
                            x: 100,
                            y: 100,
                            width: 200,
                            height: 200,
                            fill: "green",
                            stroke: "black",
                            strokeWidth: 2,
                            rotation: 0,
                            scaleX: 1,
                            scaleY: 1,
                            opacity: 1,
                            visible: true,
                          },
                        },
                      },
                    ],
                    locked: false,
                    blendMode: "normal",
                    metadata: createMetadata(),
                  },
                ],
                locked: false,
                blendMode: "normal",
                metadata: createMetadata(),
              },
            ],
            hidden: false,
            thumbnail: "",
          },
        ],
      },
      selectedItems: {
        stageId: "stage-1",
      },
      history: {
        past: [],
        future: [],
        maxHistorySize: 100,
      },
      // Stage operations

      addStage: (stage: Omit<DStage, "id" | "metadata">) => {
        console.log("[addStage]");
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
      addLayer: (layer: Omit<DLayer, "id" | "metadata">, stageId: string) => {
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
      reorderLayers: (stageId: string, fromIndex: number, toIndex: number) => {
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
        return JSON.stringify(get().present);
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
      selectedStage: () => {
        const state = get();
        return state.present.stages.find(
          (stage) => stage.id === state.selectedItems.stageId
        )!;
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
    }))
  )
);

function getComponent(
  componentId: string,
  groupId: string,
  layerId: string,
  stageId: string,
  state: VideoDraftState
): DComponent {
  const stage = state.present.stages.find((s) => s.id === stageId);
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
