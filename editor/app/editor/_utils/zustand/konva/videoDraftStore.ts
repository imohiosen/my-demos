import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { liveblocks, WithLiveblocks } from "@liveblocks/zustand";
import { createClient } from "@liveblocks/client";
import Konva from "konva";
import { VideoDraftState, VideoDraftActions } from "./types";
import { DComponent, DElementProps, Selection } from "./types";

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

    return await response.json();
  },
});

// Forward declaration - will be imported after store creation
let getPresenceStoreState: () => { selectedStageId?: string };

function getComponentFromSelectedScene(
  selection: Selection,
  state: any
): { comp: DComponent; selectedScene: string } {
  const selectedScene = getPresenceStoreState?.()?.selectedStageId;
  if (!selectedScene) throw new Error(`No scene selected`);
  const comp = state.current.scenes[selectedScene].find(
    (c: DComponent) => c.componentId === selection.componentId
  ) as DComponent;
  if (!comp) {
    throw new Error(
      `Component with id ${selection.componentId} not found in scene ${selectedScene}`
    );
  }
  return { comp, selectedScene };
}

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
          id: "test-006",

          // Actions
          addScene: () => {
            set((state) => {
              state.current.scenes[generateId()] = [];
            });
          },

          getScene(id: string) {
            const state = get();
            if (!state.current.scenes[id]) {
              console.error(`Scene with id ${id} not found`);
              return [];
            }
            return state.current.scenes[id];
          },

          addText(text, style) {
            set((state) => {
              const sceneId = usePresenceStore.getState().selectedStageId;
              if (!sceneId) {
                throw new Error(`Error: No stage selected`);
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

              textComp.text.attribute.x = e.target.x();
              textComp.text.attribute.y = e.target.y();
              textComp.metadata = updateMetadata(textComp.metadata);
            });
          },

          mergeAttributes: (selection: Selection, attrs: Partial<DElementProps>) => {
            set((state) => {
              const { comp, selectedScene } = getComponentFromSelectedScene(
                selection,
                state
              );

              if (comp.type === "text" && comp.text?.attribute) {
                Object.assign(comp.text.attribute, attrs);
                comp.metadata = updateMetadata(comp.metadata);
              } else if (comp.type === "element" && comp.element?.attribute) {
                Object.assign(comp.element.attribute, attrs);
                comp.metadata = updateMetadata(comp.metadata);
              }
            });
          },

          getComponentBoundingRect: (selection: Selection) => {
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
                throw new Error(`Scene with id ${sceneId} not found`);
              }

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
      name: "video-draft-store",
      version: 1,
    }
  )
);

// Import this at the top after the store is defined
import { usePresenceStore } from "./presenceStore";
