import { create } from "zustand";
import { Layer, Tool, ViewportState } from "@/types/editor";
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
  shouldClearOriginal: boolean;
  bucketTolerance: number;
  customColors: string[];

  // Layers State
  layers: Layer[];
  selectedLayerId: string;

  // Actions
  setCanvasSize: (size: { width: number; height: number }) => void;
  setViewport: (viewport: ViewportState) => void;
  setShowGrid: (show: boolean) => void;
  setSelectedTool: (tool: Tool) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setShouldClearOriginal: (shouldClearOriginal: boolean) => void;
  setBucketTolerance: (tolerance: number) => void;
  addCustomColor: (color: string) => void;
  setLayers: (layers: Layer[] | ((prev: Layer[]) => Layer[])) => void;
  setSelectedLayerId: (id: string) => void;
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
  shouldClearOriginal: true,
  bucketTolerance: 1,
  customColors: [],

  // Initial Layers State
  layers: [],
  selectedLayerId: "",

  // Actions
  setCanvasSize: (size) => set({ canvasSize: size }),
  setViewport: (viewport) => set({ viewport }),
  setShowGrid: (show) => set({ showGrid: show }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSecondaryColor: (color) => set({ secondaryColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  setShouldClearOriginal: (shouldClearOriginal) => set({ shouldClearOriginal }),
  setBucketTolerance: (tolerance) => set({ bucketTolerance: tolerance }),
  addCustomColor: (color) =>
    set((state) => ({
      customColors: [...state.customColors, color],
    })),
  setLayers: (layersOrUpdater) =>
    set((state) => ({
      layers:
        typeof layersOrUpdater === "function"
          ? layersOrUpdater(state.layers)
          : layersOrUpdater,
    })),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
}));
