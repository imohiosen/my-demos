import Konva from 'konva';

import { DComponent, DElementProps, DGroup, DTextProps, Point, VideoDraft, Selection} from './types';
/* eslint-disable @typescript-eslint/no-explicit-any */

// Remove conflicting imports and fix type naming

// Improved state with better history management
export type VideoDraftState = {
    id: string; // Unique identifier for the draft
    current: VideoDraft;
    history: {
        past: VideoDraft[];
        future: VideoDraft[];
        maxHistorySize: number;
    };
}

export type Presence = {
    cursorPosition: Point; // Current cursor position
    selectedItems?: Selection[]; // Array of selected items
    stagePosition?: Point; // Position of the stage
    stageViewBox?: Point; // Height of the stage
    stageScale?: Point; // Scale of the stage
    selectedStageId?: string; // ID of the selected group
    
    renderCount: number; // Count of renders for performance tracking
    renderCanvas: () => void; // Render the canvas with current state

    updateCursorPosition: (position: Point) => void; // Update cursor position
    updateSelectedItems: (items: Selection[]) => void; // Update selected items
    updateStagePosition: (position: Point) => void; // Update stage position
    updateStageViewBox: (viewBox: Point) => void; // Update stage view box
    updateStageScale: (scale: Point) => void; // Update stage scale
    updateSelectedStageId: (stageId: string) => void; // Update selected group ID

    saveSelectionToLocalStorage: () => void;
    getSelectionFromLocalStorage: () => string | null;


}




// Enhanced actions with better organization
export interface VideoDraftActions {
    // Stage operations#
    addScene: () => void;
    addText: (
        text: string,   
        style: Partial<DTextProps>,
    ) => void;
    addElement: (component: DComponent) => void;

    handleTextDragEnd: (selection: Selection, e: Konva.KonvaEventObject<DragEvent>) => void;
    mergeCircleAttrs: (selection: Selection, attrs: Partial<DElementProps>) => void;
    getComponentBoundingRect: (selection: Selection) => { x: number; y: number; width: number; height: number; } | null;
    getSceneById: (sceneId: string) => (DComponent)[];
}

// Helper function to generate unique IDs

