import { create } from "zustand";
import { Layer } from "@/types/editor";

interface HistoryState {
  type: "editor";
  layers: Layer[];
  selectedLayerId: string;
  timestamp: number;
}

interface HistoryStore {
  undoStack: HistoryState[];
  redoStack: HistoryState[];
  canUndo: boolean;
  canRedo: boolean;
  pushHistory: (state: Omit<HistoryState, "timestamp">) => void;
  undo: () => HistoryState | null;
  redo: () => HistoryState | null;
  clear: () => void;
}

const MAX_HISTORY_SIZE = 50; // Limit the size of history to prevent memory issues

const cloneState = (state: HistoryState): HistoryState => ({
  ...state,
  layers: state.layers.map((layer) => ({
    ...layer,
    imageData: layer.imageData
      ? new ImageData(
          new Uint8ClampedArray(layer.imageData.data),
          layer.imageData.width,
          layer.imageData.height,
        )
      : null,
  })),
});

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  undoStack: [],
  redoStack: [],
  canUndo: false,
  canRedo: false,

  pushHistory: (state) => {
    const newState = { ...state, timestamp: Date.now() };

    set((prev) => {
      // Don't push if the state is identical to the last state
      const lastState = prev.undoStack[prev.undoStack.length - 1];
      if (
        lastState &&
        JSON.stringify(lastState.layers) === JSON.stringify(newState.layers) &&
        lastState.selectedLayerId === newState.selectedLayerId
      ) {
        return prev;
      }

      // Create new undo stack with size limit
      const newUndoStack = [...prev.undoStack, newState].slice(
        -MAX_HISTORY_SIZE,
      );

      return {
        undoStack: newUndoStack,
        redoStack: [], // Clear redo stack on new action
        canUndo: newUndoStack.length > 1,
        canRedo: false,
      };
    });
  },

  undo: () => {
    const { undoStack, redoStack } = get();

    // Need at least 2 states to undo (initial state + current state)
    if (undoStack.length <= 1) {
      return null;
    }

    const currentState = undoStack[undoStack.length - 1];
    const stateToRestore = undoStack[undoStack.length - 2];

    if (!currentState || !stateToRestore) {
      return null;
    }

    // Create new stacks with deep cloned states
    const newUndoStack = undoStack.slice(0, -1);
    const newRedoStack = [cloneState(currentState), ...redoStack].slice(
      -MAX_HISTORY_SIZE,
    );

    set({
      undoStack: newUndoStack,
      redoStack: newRedoStack,
      canUndo: newUndoStack.length > 1,
      canRedo: true,
    });

    return cloneState(stateToRestore);
  },

  redo: () => {
    const { undoStack, redoStack } = get();

    if (redoStack.length === 0) {
      return null;
    }

    const stateToRestore = redoStack[0];
    if (!stateToRestore) {
      return null;
    }

    // Create new stacks with deep cloned states
    const newRedoStack = redoStack.slice(1);
    const newUndoStack = [...undoStack, cloneState(stateToRestore)].slice(
      -MAX_HISTORY_SIZE,
    );

    set({
      undoStack: newUndoStack,
      redoStack: newRedoStack,
      canUndo: true,
      canRedo: newRedoStack.length > 0,
    });

    return cloneState(stateToRestore);
  },

  clear: () => {
    set({
      undoStack: [],
      redoStack: [],
      canUndo: false,
      canRedo: false,
    });
  },
}));
