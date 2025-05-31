import { Canvas as FCanvas } from "fabric";

export type Audio = {
  buffer: AudioBuffer | null; // Audio buffer for playback
  title: string;
  duration: number; // Duration in seconds
  downloadUrl: string; // URL to download the audio file
  transcriptTimestamps: { // Timestamps for transcript segments
    start: number; // Start time in seconds
    end: number; // End time in seconds
  }[];
  transcript: string; // Transcript of the audio
};

export type Scene = {
  id: string; // Unique identifier for the scene
  name?: string; // Optional scene name
  audio: Audio | null; // Audio associated with the scene
  canvasData: string | null; // JSON string of canvas state
  thumbnailB64: string; // Base64 encoded thumbnail image
}

export interface Snapshot {
  // Scenes with their complete data including canvas state
  scenes: Record<string, Scene>; // sceneId -> Scene object
  autosaveEnabled: boolean;
  clipboard: unknown | null;
  selectedObjects: unknown[] | null;
  // Currently selected scene
  selectedSceneId: string;
  snapshotId?: string; // Optional snapshot ID for the current state
  snapshotCreatedBy?: string; // Optional user ID who created the snapshot
  snapshotCreatedAt?: string; // Optional timestamp when the snapshot was created
}

export type CanvasState = {
  past: Snapshot[]; // Array of JSON strings representing past states
  present: Snapshot; // Current state as a JSON string
  canvas: FCanvas | null; // Current canvas instance
  future: Snapshot[]; // Array of JSON strings representing future states
};




export const initialCanvasState: CanvasState = {
  past: [],
  present: {
    scenes: {
      "default_scene": {
        id: "default_scene",
        name: "Default Scene",
        audio: null,
        canvasData: null, // Initial canvas state is null
        thumbnailB64: "",
      },
    },
    autosaveEnabled: true,
    clipboard: null,
    selectedObjects: null,
    selectedSceneId: "default_scene",
  },
  canvas: null,
  future: [],
};

