import Konva from "konva";
import { NodeConfig } from "konva/lib/Node";
import { TextConfig } from "konva/lib/shapes/Text";
import Konva from 'konva';

export type DAvatarProps = {
  x: number; // X position of the avatar
  y: number; // Y position of the avatar
  width: number; // Width of the avatar
  height: number; // Height of the avatar
};

export type DAvatar = {
  type: "avatar"; // Type of avatar component
  attribute: DAvatarProps;
};

export type DTextProps = TextConfig &
  NodeConfig & {
    type: "title" | "title2" | "subtitle" | "text" | "caption"; // Type of text element
  };

export type DText = {
  attribute: DTextProps;
};

export type DMediaProps = {
  src: string; // cdn-URL or data-url string for the media
  x: number; // X position of the media
  y: number; // Y position of the media
  width?: number; // Optional width for rectangle and image
  height?: number; // Optional height for rectangle and image
  caption?: string; // Optional caption text for the media
  alt?: string; // Optional alt text for the media
};

export type DMedia = {
  type: 
    | "asset-image"
    | "asset-video"
    | "asset-icons"
    | "image"
    | "video"
    | "icons";
  attribute: DMediaProps;
};

export type DElementProps = {
  x?: number; // X position of the element
  y?: number; // Y position of the element
  width?: number; // Optional width for rectangle and image
  height?: number; // Optional height for rectangle and image
  radius?: number; // Optional radius for circle
  points?: number[]; // Points for line or arrow
  fill?: string; // Fill color for shapes
  stroke?: string; // Stroke color for shapes
  strokeWidth?: number; // Stroke width for shapes
  fontSize?: number; // Font size for text elements
  fontFamily?: string; // Font family for text elements
  fontStyle?: string; // Font style for text elements
  align?: string; // Text alignment for text elements
  type?: "rect" | "circle" | "line" | "arrow"; // Subtype for more specific element types
};

export type DElement = {
  attribute: DElementProps;
};

export type DAudioCaptionProps = {
  src: string; // URL or base64 string for the audio file
  x: number; // X position of the audio caption
  y: number; // Y position of the audio caption
  width?: number; // Optional width for the audio caption
  height?: number; // Optional height for the audio caption
  caption?: string; // Optional caption text for the audio
};

export type DAudioCaption = {
  sType: "default"; // Type of background component
  attribute: DAudioCaptionProps; // Attributes for the audio caption
};

export type DBackgroundProps = {
  x: number; // X position of the background
  y: number; // Y position of the background
  width: number; // Width of the background
  height: number; // Height of the background
  fill?: string; // Optional fill color for the background
  imageSrc?: string; // Optional image source for the background
  videoSrc?: string; // Optional video source for the background
};

export type DBackground = {
  sType: "default"; // Type of background component
  attribute: DBackgroundProps; // Attributes for the background component
};

export type DComponent = {
  sceneId: string; // ID of the stage where the element is used
  componentId: string; // Unique identifier for the element component
  type:
    | "element"
    | "text"
    | "avatar"
    | "media"
    | "background"
    | "audio-caption"
    | "group"; // Type of component
  text?: DText; // Text content for text components
  avatar?: DAvatar; // Updated to use DAvatar type for user-related components
  media?: DMedia; // Updated to use DMedia type for image/video/audio components
  background?: DBackground; // Updated to use DBackground type for components
  audioCaption?: DAudioCaption; // Updated to use DAudioCaption type for audio components
  element?: DElement; // Updated to use DElement type for more complex components
  group?: DGroup; // Updated to use DGroup type for grouping components

  // Common attributes for all components
  metadata?: {
    createdAt: number;
    modifiedAt: number;
  };
};

export type DGroupProps = {
  x?: number; // X position of the group
  y?: number; // Y position of the group
  width?: number; // Width of the group
  height?: number; // Height of the group
  rotation?: number; // Rotation angle of the group
  scaleX?: number; // Scale factor in X direction
  scaleY?: number; // Scale factor in Y direction
  opacity?: number; // Opacity of the group
  visible?: boolean; // Visibility of the group
};

export type DGroup = {
  id: string;
  attributes: DGroupProps; // Attributes for the group
  components: DComponent[];
  locked?: boolean;
  metadata?: {
    createdAt: number;
    modifiedAt: number;
  };
};

export type DAudio = {
  id: string;
  metadata?: {
    createdAt: number;
    modifiedAt: number;
    src: string;
    fileMetadata?: Record<string, unknown>; // Additional metadata from the audio file
  };
};

export type VideoDraft = {
  id: string;
  scenes: Record<string, DComponent[]>; // Keyed by scene ID
  portrait: Orientation;
  audio?: DAudio; // Changed to array for multiple audio tracks
  hidden?: boolean;
};

export type Selection = {
  sceneId: string; // ID of the stage where the selection is made
  componentId: string; // ID of the selected component
};

export interface CanvasDisplayParams {
  mode: Orientation;
  backgroundColor?: CSSColor;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  enablePan?: boolean;
  enableZoom?: boolean;
  showGrid?: boolean;
  gridCellSize?: number;
  snapToGrid?: boolean;
  center?: Point;
  rotation?: number;
  devicePixelRatio?: number;
  className?: string;
}

export type Orientation = "portrait" | "landscape";
export interface Point {
  x: number;
  y: number;
}
export type CSSColor = string;

export type SelectionRectangle = {
  x1: number; // X position of the selection rectangle
  x2: number; // X position of the selection rectangle
  y1: number; // Y position of the selection rectangle
  y2: number; // Y position of the selection rectangle
  visible: boolean; // Whether the selection rectangle is visible
};

// Store Types
export type VideoDraftState = {
  id: string; // Unique identifier for the draft
  current: VideoDraft;
  history: {
    past: VideoDraft[];
    future: VideoDraft[];
    maxHistorySize: number;
  };
};

export type Presence = {
  cursorPosition: Point; // Current cursor position
  selectedItems?: Selection[]; // Array of selected items
  selectedIds: string[]; // Array of selected element IDs
  isSelecting: boolean; // Flag to indicate if selection is in progress
  stagePosition?: Point; // Position of the stage
  stageViewBox?: Point; // Height of the stage
  stageScale?: Point; // Scale of the stage
  selectedStageId?: string; // ID of the selected group
  
  renderCount: number; // Count of renders for performance tracking
  renderCanvas: () => void; // Render the canvas with current state

  updateCursorPosition: (position: Point) => void; // Update cursor position
  updateSelectedItems: (items: Selection[]) => void; // Update selected items
  updateSelectedIds: (ids: string[]) => void; // Update selected element IDs
  updateIsSelecting: (isSelecting: boolean) => void; // Update selection state
  updateStagePosition: (position: Point) => void; // Update stage position
  updateStageViewBox: (viewBox: Point) => void; // Update stage view box
  updateStageScale: (scale: Point) => void; // Update stage scale
  updateSelectedStageId: (sceneId: string) => void; // Update selected group ID
};

export type UIState = {
  selectionRectangle: SelectionRectangle;
  setSelectionRectangle: (selectionRectangle: SelectionRectangle) => void; // Set the selection rectangle for multi-selection
};

// Enhanced actions with better organization
export interface VideoDraftActions {
  // Stage operations
  addScene: () => void;
  addText: (
    text: string,   
    style: Partial<DTextProps>,
  ) => void;
  addElement: (component: DComponent) => void;
  addMedia: (component: DComponent) => void;
  handleTextDragEnd: (selection: Selection, e: Konva.KonvaEventObject<DragEvent>) => void;
  mergeAttributes: (selection: Selection, attrs: Partial<DElementProps>) => void;
  mergeAttributesV2: (
    selection: Selection,
    attrs: Partial<DElementProps | DMediaProps>
  ) => void;
  getComponentBoundingRect: (selection: Selection) => { x: number; y: number; width: number; height: number; } | null;
  getSceneById: (sceneId: string) => DComponent[];
}
