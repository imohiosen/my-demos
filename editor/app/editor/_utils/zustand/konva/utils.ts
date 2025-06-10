import { WritableDraft } from "immer";
import { WithLiveblocks } from "@liveblocks/zustand";
import { VideoDraftState, VideoDraftActions } from "./store";
import { Selection, DComponent } from "./types";

// Helper function to generate unique IDs
export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper function to create metadata
export const createMetadata = () => ({
  createdAt: Date.now(),
  modifiedAt: Date.now(),
});

// Helper function to update metadata
export const updateMetadata = (metadata?: {
  createdAt: number;
  modifiedAt: number;
}) => ({
  ...metadata,
  modifiedAt: Date.now(),
});

export type ImmerState = WritableDraft<WithLiveblocks<VideoDraftState & VideoDraftActions>>;

export function getComponentFromSelectedScene(
  selection: Selection,
  state: ImmerState,
  selectedSceneId: string
) {
  if (!selectedSceneId) throw new Error(`No scene selected`);
  const comp = state.current.scenes[selectedSceneId].find(
    (c) => c.componentId === selection.componentId
  ) as DComponent;
  if (!comp) {
    throw new Error(
      `Component with id ${selection.componentId} not found in scene ${selectedSceneId}`
    );
  }
  return { comp, selectedScene: selectedSceneId };
}
