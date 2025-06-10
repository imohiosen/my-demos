import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import Konva from "konva";
import { VideoDraftActions, VideoDraftState } from "./store";
import { DComponent, DElementProps, DMediaProps, Selection } from "./types";
import { client } from "./client";
import { generateId, createMetadata } from "./utils";

type State = VideoDraftState;
type Actions = VideoDraftActions;

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
          id: "test-009",
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
          addText(text, _style) {
            set((state) => {
              // Note: This function needs selectedStageId to be passed or obtained from context
              // For now, we'll use a placeholder implementation
              const sceneIds = Object.keys(state.current.scenes);
              const sceneId = sceneIds[0]; // Use first available scene as fallback

              if (!sceneId) {
                throw new Error(`Error: No scenes available`);
              }

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
              // Note: This function needs selectedStageId to be passed or obtained from context
              const sceneIds = Object.keys(state.current.scenes);
              const selectedSceneId = sceneIds[0]; // Use first available scene as fallback

              if (!selectedSceneId) throw new Error(`No scene selected`);
              const textComp = state.current.scenes[selectedSceneId].find(
                (c) => c.componentId === selection.componentId
              ) as DComponent;

              if (!textComp) {
                throw new Error(
                  `Component with id ${selection.componentId} not found in scene ${selectedSceneId}`
                );
              }

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
            throw new Error(
              `mergeAttributes is deprecated, use mergeAttributesV2 instead`
            );
          },
          mergeAttributesV2: (
            selection: Selection,
            attrs: Partial<DElementProps | DMediaProps>
          ) => {
            set((state) => {
              const selectedSceneId = selection.sceneId;

              if (!selectedSceneId) throw new Error(`No scene selected`);
              const component = state.current.scenes[selectedSceneId].find(
                (c) => c.componentId === selection.componentId
              ) as DComponent;

              if (!component) {
                throw new Error(
                  `Component with id ${selection.componentId} not found in scene ${selectedSceneId}`
                );
              }

              switch (component.type) {
                case "element":
                  if (!component.element || !component.element.attribute) {
                    throw new Error(
                      `Element component does not have element attribute`
                    );
                  }
                  component.element.attribute = {
                    ...component.element.attribute,
                    ...attrs,
                  };
                  break;
                case "media":
                  if (!component.media || !component.media.attribute) {
                    throw new Error(
                      `Media component does not have media attribute`
                    );
                  }
                  
                  component.media.attribute = {
                    ...component.media.attribute,
                    ...attrs,
                  };
                  break;
                default:
                  throw new Error(
                    `Unsupported component type for mergeAttributesV2: ${component.type}`
                  );
              }
            });
          },
          getComponentBoundingRect: (_selection: Selection) => {
            // Assuming the component has an attribute with x, y, width, height
            const { x = 0, y = 0, width = 100, height = 100 } = {};

            return { x, y, width, height };
          },

          addElement: (component: DComponent) => {
            set((state) => {
              const sceneId = component.sceneId;
              const scene = state.current.scenes[sceneId];
              if (!scene) {
                throw new Error(`Scene with id ${sceneId} not found`);
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

          addMedia: (component: DComponent) => {
            set((state) => {
              const sceneId = component.sceneId;
              const scene = state.current.scenes[sceneId];
              if (!scene) {
                throw new Error(`Scene with id ${sceneId} not found`);
              }
              if (!component.media || !component.media.attribute) {
                throw new Error(`Component does not have media attribute`);
              }
              state.current.scenes[sceneId].push({
                componentId: component.componentId,
                sceneId: sceneId,
                type: component.type,
                media: {
                  type: component.media.type,
                  attribute: {
                    ...component.media?.attribute,
                  },
                },
                metadata: createMetadata(),
              });
            });
          },

          getSceneById: (id: string): DComponent[] => {
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
