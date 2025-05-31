import { Canvas as FCanvas, Textbox, Group } from "fabric";
import { initializeCanvasListeners } from '../../canvas';
import { CanvasState, Scene } from "./canvasState";

export const createCanvasActions = (
  set: (partial: Partial<CanvasState>) => void,
  get: () => CanvasState
) => {

  const loadSceneCanvas = async (sceneId: string) => {
    console.log("Loading scene canvas for sceneId:", sceneId);
    const state = get();
    const scene = state.present.scenes[sceneId];
    
    if (!scene || !state.canvas) return;
    
    // Clear current canvas
    state.canvas.clear();
    
    // Load scene canvas data if available
    if (scene.canvasData) {
      console.log("Loading canvas data: ", scene.canvasData);
      try {
        const canvas = await state.canvas.loadFromJSON(scene.canvasData);
        canvas.renderAll();
        set({ canvas });
      } catch (error) {
        console.error('Failed to load scene canvas:', error);
      }
    }
  };
    
  const saveState = () => {
    const state = get();
    if (!state.canvas) return;
    
    const newSnapshot = {
      ...state.present,
      scenes: { ...state.present.scenes }
    };
    
    // Save current scene canvas data if a scene is selected
    if (state.present.selectedSceneId) {
      const canvasData = JSON.stringify(state.canvas.toJSON());
      newSnapshot.scenes[state.present.selectedSceneId] = {
        ...newSnapshot.scenes[state.present.selectedSceneId],
        canvasData
      };
    }
    
    set({
      past: [...state.past, state.present],
      present: newSnapshot,
      future: []
    });
  };

  const setupCanvasListeners = () => {
    const state = get();
    if (!state.canvas) {
      alert("Could not initialize!.");
      return;
    }
    
    initializeCanvasListeners(
      state.present.autosaveEnabled,
      saveState,
      set,
      state.canvas
    );
  };

  return {
    setupCanvasListeners,
    saveState,
    loadSceneCanvas,
    setCanvas: (canvas: FCanvas) => {
      set({ canvas });
      setupCanvasListeners();
    },

    setAutosave: (enabled: boolean) => {
      set({
        present: {
          ...get().present,
          autosaveEnabled: enabled
        }
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addText: (text: string, style: any) => {
      const state = get();
      if (!state.canvas) return;
      
      const textbox = new Textbox(text, {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 20,
        fill: '#000000',
        ...style
      });
      
      state.canvas.add(textbox);
      state.canvas.setActiveObject(textbox);
      state.canvas.renderAll();
      
      if (state.present.autosaveEnabled) {
        saveState();
      }
    },

    undo: async () => {
      const state = get();
      if (state.past.length === 0) return;
      
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      
      set({
        past: newPast,
        present: previous,
        future: [state.present, ...state.future]
      });
      
      // Reload canvas if scene changed
      if (previous.selectedSceneId) {
        await loadSceneCanvas(previous.selectedSceneId);
      }
    },

    redo: async () => {
      const state = get();
      if (state.future.length === 0) return;
      
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      set({
        past: [...state.past, state.present],
        present: next,
        future: newFuture
      });
      
      // Reload canvas if scene changed
      if (next.selectedSceneId) {
        await loadSceneCanvas(next.selectedSceneId);
      }
    },

    clearCanvas: () => {
      const state = get();
      if (!state.canvas) return;
      
      state.canvas.clear();
      state.canvas.renderAll();
      
      if (state.present.autosaveEnabled) {
        saveState();
      }
    },

    setSelectedObjects: (objects: unknown[]) => {
      set({
        present: {
          ...get().present,
          selectedObjects: objects
        }
      });
    },

    // Playback actions
    selectScene: (sceneId: string) => {
      const state = get();
      
      // Save current scene canvas before switching
      if (state.present.selectedSceneId && state.canvas) {
        const canvasData = JSON.stringify(state.canvas.toJSON());
        const updatedScenes = {
          ...state.present.scenes,
          [state.present.selectedSceneId]: {
            ...state.present.scenes[state.present.selectedSceneId],
            canvasData
          }
        };
        
        set({
          present: {
            ...state.present,
            scenes: updatedScenes,
            selectedSceneId: sceneId
          }
        });
      } else {
        set({
          present: {
            ...state.present,
            selectedSceneId: sceneId
          }
        });
      }
      
      // Load the selected scene
      loadSceneCanvas(sceneId);
    },

    saveCurrentSceneCanvas: () => {
      const state = get();
      if (!state.canvas || !state.present.selectedSceneId) return;
      
      const canvasData = JSON.stringify(state.canvas.toJSON());
      const updatedScenes = {
        ...state.present.scenes,
        [state.present.selectedSceneId]: {
          ...state.present.scenes[state.present.selectedSceneId],
          canvasData
        }
      };
      
      set({
        present: {
          ...state.present,
          scenes: updatedScenes
        }
      });
    },

    addScene: () => {
      const state = get();
      const newSceneId = `scene_${Date.now()}`;
      const canvas = new FCanvas(`canvas_${newSceneId}`, {
        width: 1920,
        height: 1080,
        backgroundColor: "green"
      });
      canvas.add(new Textbox(`Scene ${Object.keys(state.present.scenes).length + 1}`, {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 24,
        fill: '#ffffff'
      }));
      canvas.renderAll();
      const newScene: Scene = {
        id: newSceneId,
        name: `Scene ${Object.keys(state.present.scenes).length + 1}`,
        canvasData: canvas.toJSON(),
        audio: null, // No audio by default
        thumbnailB64: '' // Placeholder for thumbnail
      }
      
      const updatedScenes = {
      ...state.present.scenes,
      [newSceneId]: newScene
      };
      
      set({
      present: {
        ...state.present,
        scenes: updatedScenes
      }
      });
      
      saveState();
    },

    duplicateScene: (sceneId: string) => {
      const state = get();
      const originalScene = state.present.scenes[sceneId];
      
      if (!originalScene) return;
      
      const newSceneId = `${sceneId}_copy_${Date.now()}`;
      const duplicatedScene: Scene = {
        ...originalScene,
        id: newSceneId,
        name: `${originalScene.name || 'Scene'} Copy`
      };
      
      const updatedScenes = {
        ...state.present.scenes,
        [newSceneId]: duplicatedScene
      };
      
      set({
        present: {
          ...state.present,
          scenes: updatedScenes
        }
      });
      
      saveState();
    },

    groupObjects: () => {
      const state = get();
      if (!state.canvas) return;
      
      const activeObjects = state.canvas.getActiveObjects();
      if (activeObjects.length < 2) return;
      
      const group = new Group(activeObjects, {
        canvas: state.canvas
      });
      
      activeObjects.forEach(obj => state.canvas?.remove(obj));
      state.canvas.add(group);
      state.canvas.setActiveObject(group);
      state.canvas.renderAll();
      
      if (state.present.autosaveEnabled) {
        saveState();
      }
    },

    ungroupObjects: () => {
      const state = get();
      if (!state.canvas) return;
      
      const activeObject = state.canvas.getActiveObject();
      if (!activeObject || activeObject.type !== 'group') return;
      
      const group = activeObject as Group;
      const objects = group.getObjects();
      
      group.remove();
      state.canvas.remove(group);
      
      objects.forEach(obj => {
        state.canvas?.add(obj);
      });
      
      state.canvas.renderAll();
      
      if (state.present.autosaveEnabled) {
        saveState();
      }
    },

    initEditor: (canvas: FCanvas) => {
      set({ canvas });
      setupCanvasListeners();
      
      // Initialize canvas with default settings
      canvas.selection = true;
      canvas.preserveObjectStacking = true;
      canvas.renderOnAddRemove = true;
      
      // Set up initial canvas state
      set({
        present: {
          ...get().present,
          selectedObjects: []
        }
      });
    },

    getSceneAudio: (sceneId: string) => {
      const state = get();
      const scene = state.present.scenes[sceneId];
      return scene?.audio || null;
    },

    removeScene: (sceneId: string) => {
      const state = get();
      const updatedScenes = { ...state.present.scenes };
      delete updatedScenes[sceneId];
      
      // If removing the currently selected scene, clear selection
      const selectedSceneId = state.present.selectedSceneId === sceneId 
        ? null 
        : state.present.selectedSceneId;
      
      set({
        present: {
          ...state.present,
          scenes: updatedScenes,
          selectedSceneId
        }
      });
      
      // Clear canvas if the removed scene was selected
      if (state.present.selectedSceneId === sceneId && state.canvas) {
        state.canvas.clear();
        state.canvas.renderAll();
      }
      
      saveState();
    },

    clearSelection: () => {
      const state = get();
      if (!state.canvas) return;
      
      state.canvas.discardActiveObject();
      state.canvas.renderAll();
      
      set({
        present: {
          ...state.present,
          selectedObjects: []
        }
      });
    },
    initializeCanvas: (el: HTMLCanvasElement) => {
      const canvas = new FCanvas(el, {
        width: 1600,
        height: 900,
      });



      set({ canvas });
      // set canvs to canvasdata
      const initialScene = get().present.scenes[get().present.selectedSceneId];
      if (!initialScene.canvasData) {
        initialScene.canvasData = JSON.stringify(canvas.toJSON());
        set({
          present: {
            ...get().present,
            scenes: {
              ...get().present.scenes,
              [initialScene.id]: {
                ...initialScene,
                canvasData: initialScene.canvasData
              }
              
            }
          }
        });
      }
      console.log("Initializing canvas with scene:", initialScene);
      // Initialize canvas listeners
      setupCanvasListeners();


      


      return canvas;
    }
  };

};


