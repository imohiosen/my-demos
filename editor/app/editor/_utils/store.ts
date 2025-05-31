import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { EditorState, EditorSelection } from './zustand/state';
import { EditorStore } from './zustand/editorStore';

const initialState: EditorState = {
  content: '',
  selection: { start: 0, end: 0 },
  history: {
    past: [],
    present: '',
    future: []
  },
  ui: {
    isLoading: false,
    isDirty: false,
    fontSize: 14,
    theme: 'light',
    showLineNumbers: true
  }
};

export const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setContent: (content: string) => {
          set((state) => ({
            content,
            history: {
              past: [...state.history.past, state.history.present],
              present: content,
              future: []
            },
            ui: { ...state.ui, isDirty: true }
          }));
        },

        updateContent: (content: string) => {
          set({ content, ui: { ...get().ui, isDirty: true } });
        },

        setSelection: (selection: EditorSelection) => {
          set({ selection });
        },

        undo: () => {
          const state = get();
          if (state.history.past.length > 0) {
            const previous = state.history.past[state.history.past.length - 1];
            const newPast = state.history.past.slice(0, -1);
            set({
              content: previous,
              history: {
                past: newPast,
                present: previous,
                future: [state.history.present, ...state.history.future]
              },
              ui: { ...state.ui, isDirty: true }
            });
          }
        },

        redo: () => {
          const state = get();
          if (state.history.future.length > 0) {
            const next = state.history.future[0];
            const newFuture = state.history.future.slice(1);
            set({
              content: next,
              history: {
                past: [...state.history.past, state.history.present],
                present: next,
                future: newFuture
              },
              ui: { ...state.ui, isDirty: true }
            });
          }
        },

        setFontSize: (fontSize: number) => {
          set((state) => ({
            ui: { ...state.ui, fontSize }
          }));
        },

        setTheme: (theme: 'light' | 'dark') => {
          set((state) => ({
            ui: { ...state.ui, theme }
          }));
        },

        toggleLineNumbers: () => {
          set((state) => ({
            ui: { ...state.ui, showLineNumbers: !state.ui.showLineNumbers }
          }));
        },

        setLoading: (isLoading: boolean) => {
          set((state) => ({
            ui: { ...state.ui, isLoading }
          }));
        },

        markDirty: (isDirty: boolean) => {
          set((state) => ({
            ui: { ...state.ui, isDirty }
          }));
        },

        reset: () => {
          set(initialState);
        }
      }),
      {
        name: 'editor-store',
        partialize: (state) => ({
          ui: {
            fontSize: state.ui.fontSize,
            theme: state.ui.theme,
            showLineNumbers: state.ui.showLineNumbers
          }
        })
      }
    ),
    { name: 'EditorStore' }
  )
);
