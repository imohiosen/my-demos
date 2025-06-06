import { Group } from "fabric";
import { NodeConfig } from "konva/lib/Node";
import { TextConfig } from "konva/lib/shapes/Text";

export type DAvatarProps = {
  x: number; // X position of the avatar
  y: number; // Y position of the avatar
  width: number; // Width of the avatar
  height: number; // Height of the avatar
}

export type DAvatar = {
    type: "avatar"; // Type of avatar component
    attribute: DAvatarProps
}

// export type DTextProps = {
//     x: number; // X position of the text
//     y: number; // Y position of the text
//     text: string; // The text content
//     type: "title" | "title2" | "subtitle" | "text" | "caption"; // Type of text element
//     fill?: string; // Optional fill color for the text
//     fontSize?: number; // Optional font size
//     fontFamily?: string; // Optional font family
//     fontStyle?: string; // Optional font style (e.g., 'bold', 'italic')
//     align?: string; // Optional text alignment (e.g., 'left', 'center', 'right')

//     stageId?: string; // Optional stage ID for context
//     layerId?: string; // Optional layer ID for context
//     groupId?: string; // Optional group ID for context
//     componentId?: string; // Optional component ID for context
// }

export type DTextProps = TextConfig & NodeConfig & {


    type: "title" | "title2" | "subtitle" | "text" | "caption"; // Type of text element

    stageId?: string; // Optional stage ID for context
    layerId?: string; // Optional layer ID for context
    groupId?: string; // Optional group ID for context
    componentId?: string; // Optional component ID for context

}

export type DText = {
    attribute: DTextProps;
}

export type DMediaProps = {
  src: string; // URL or base64 string for the media
  x: number; // X position of the media           
  y: number;
  width?: number;
  height?: number;
}

export type DMedia = {
    type: 'image' | 'video'; // Type of media
    attribute: DMediaProps;
}

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
  type?: "rectangle" | "circle" | "line" | "arrow"; // Subtype for more specific element types    

  stageId?: string; // Optional stage ID for context
  layerId?: string; // Optional layer ID for context
  groupId?: string; // Optional group ID for context
  componentId?: string; // Optional component ID for context
}

export type DElement = {
    attribute: DElementProps;
}

export type DAudioCaptionProps = {
    src: string; // URL or base64 string for the audio file
    x: number; // X position of the audio caption
    y: number; // Y position of the audio caption
    width?: number; // Optional width for the audio caption
    height?: number; // Optional height for the audio caption
    caption?: string; // Optional caption text for the audio
}

export type DAudioCaption = {
    sType: 'default'; // Type of background component
    attribute: DAudioCaptionProps; // Attributes for the audio caption
}

export type DBackgroundProps = {
    x: number; // X position of the background
    y: number; // Y position of the background
    width: number; // Width of the background
    height: number; // Height of the background
    fill?: string; // Optional fill color for the background
    imageSrc?: string; // Optional image source for the background
    videoSrc?: string; // Optional video source for the background
}

export type DBackground = {
    sType: 'default'; // Type of background component
    attribute: DBackgroundProps; // Attributes for the background component
}

export type DComponent = {
    id: string; // Changed from 'key' to 'id' for clarity
    type: "element" | "text" | "avatar" | "media" | "background" | "audio-caption" | "group"; // Type of component
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
}

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
}

export type DGroup = {
    id: string;
    attributes: DGroupProps; // Attributes for the group
    components: DComponent[];
    locked?: boolean;
    metadata?: {
        createdAt: number;
        modifiedAt: number;
    };

    stageId?: string; // Optional stage ID for context
    layerId?: string; // Optional layer ID for context
    groupId?: string; // Optional group ID for context
}

export type DLayerProps = {
    x?: number; // X position of the layer
    y?: number; // Y position of the layer
    width?: number; // Width of the layer
    height?: number; // Height of the layer
    rotation?: number; // Rotation angle of the layer
    scaleX?: number; // Scale factor in X direction
    scaleY?: number; // Scale factor in Y direction
    opacity?: number; // Opacity of the layer
    visible?: boolean; // Visibility of the layer


  stageId?: string; // Optional stage ID for context
  layerId?: string; // Optional layer ID for context
}

export type DLayer = { // Renamed from Layer to avoid conflict
    id: string;
    attributes: DLayerProps; // Attributes for the layer
    groups: DGroup[];
    locked?: boolean;
    blendMode?: string;
    metadata?: {
        createdAt: number;
        modifiedAt: number;
    };
}

export type DAudio = {
    id: string;
    metadata?: {
        createdAt: number;
        modifiedAt: number;
        src: string;
        fileMetadata?: { [key: string]: any }; // Additional metadata from the audio file
    };
}

export type DStageProps = {
    width: number;
    height: number;
    backgroundColor?: string;


  stageId?: string; // Optional stage ID for context
};

export type DStage = { // Renamed from Stage to avoid conflict
    id: string;
    layer: DLayer; // change to single layer for simplicity
    audio?: DAudio; // Changed to array for multiple audio tracks
    hidden?: boolean;
    thumbnail?: string; // Base64 or URL
}

export type VideoDraft = {
    id: string;
    scenes: Record<string, (DComponent)[]>; // Keyed by scene ID
    portrait: Orientation;
    audio?: DAudio; // Changed to array for multiple audio tracks
    hidden?: boolean;
}

export type Selection = {
    stageId: string; // ID of the stage where the selection is made
    groupId?: string; // ID of the selected group
    componentId?: string; // ID of the selected component
}

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
  
  export type Orientation = 'portrait' | 'landscape';
  export interface Point { x: number; y: number; }
  export type CSSColor = string;