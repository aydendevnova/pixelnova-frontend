import { create } from "zustand";
import { Layer, Tool, ViewportState, HistoryState } from "@/types/editor";
import { PencilTool } from "@/lib/tools/pencil";

interface EditorState {
  // Canvas State
  canvasSize: { width: number; height: number };
  viewport: ViewportState;
  showGrid: boolean;

  // Tools State
  selectedTool: Tool;
  primaryColor: string;
  secondaryColor: string;
  brushSize: number;
  bucketTolerance: number;
  customColors: string[];

  // Layers State
  layers: Layer[];
  selectedLayerId: string;

  // History State
  history: HistoryState[];
  historyIndex: number;

  // Actions
  setCanvasSize: (size: { width: number; height: number }) => void;
  setViewport: (viewport: ViewportState) => void;
  setShowGrid: (show: boolean) => void;
  setSelectedTool: (tool: Tool) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBucketTolerance: (tolerance: number) => void;
  addCustomColor: (color: string) => void;
  setLayers: (layers: Layer[]) => void;
  setSelectedLayerId: (id: string) => void;
  pushHistory: (state: HistoryState) => void;
  undo: () => void;
  redo: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial Canvas State
  canvasSize: { width: 32, height: 32 },
  viewport: { x: 0, y: 0, scale: 4 },
  showGrid: true,

  // Initial Tools State
  selectedTool: PencilTool,
  primaryColor: "#000000",
  secondaryColor: "#FFFFFF",
  brushSize: 1,
  bucketTolerance: 1,
  customColors: [],

  // Initial Layers State
  layers: [
    {
      id: "layer_0",
      name: "Layer 1",
      visible: true,
      imageData: null,
    },
  ],
  selectedLayerId: "layer_0",

  // Initial History State
  history: [],
  historyIndex: -1,

  // Actions
  setCanvasSize: (size) => set({ canvasSize: size }),
  setViewport: (viewport) => set({ viewport }),
  setShowGrid: (show) => set({ showGrid: show }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSecondaryColor: (color) => set({ secondaryColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  setBucketTolerance: (tolerance) => set({ bucketTolerance: tolerance }),
  addCustomColor: (color) =>
    set((state) => ({
      customColors: [...state.customColors, color],
    })),
  setLayers: (layers) => set({ layers }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),

  pushHistory: (state) =>
    set((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      return {
        history: [...newHistory, state],
        historyIndex: prev.historyIndex + 1,
      };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      const prevState = state.history[newIndex];
      return {
        ...prevState,
        historyIndex: newIndex,
        history: state.history,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      const nextState = state.history[newIndex];
      return {
        ...nextState,
        historyIndex: newIndex,
        history: state.history,
      };
    }),
}));
