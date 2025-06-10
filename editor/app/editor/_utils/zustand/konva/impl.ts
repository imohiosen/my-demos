// Re-export all stores and utilities for backward compatibility
export {
  useCanvasEditorStore,
  usePresenceStore,
  useUIConfigStore,
  client,
  generateId,
  createMetadata,
  updateMetadata,
  getComponentFromSelectedScene,
  type UIConfig,
  type ImmerState,
  type Presence,
  type UIState,
  type VideoDraftActions,
  type VideoDraftState,
  type DComponent,
  type DElementProps,
  type DGroup,
  type Point,
  type Selection,
  type SelectionRectangle
} from './index';