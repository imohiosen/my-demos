// Re-export types from individual stores for backward compatibility
export type {
    VideoDraftState,
    VideoDraftActions,
    Presence,
    UIState,
    DComponent,
    DElementProps,
    DTextProps,
    Point,
    VideoDraft,
    Selection,
    SelectionRectangle,
} from './types';

// Re-export stores
export { usePresenceStore } from './presenceStore';
export { useUIStore } from './uiStore';
export { useUIConfigStore, type UIConfig } from './uiConfigStore';

