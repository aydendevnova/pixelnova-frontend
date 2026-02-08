import { Layer, SelectionState } from "@/types/editor";

export interface ToolState {
  lastPoint: { x: number; y: number } | null;
  startPoint: { x: number; y: number } | null;
  lastPreviewPoints: { x: number; y: number }[];
  selection: SelectionState | null;
}

export const createInitialToolState = (): ToolState => ({
  lastPoint: null,
  startPoint: null,
  lastPreviewPoints: [],
  selection: null,
});

export function getDrawingColor(
  isRightClick: boolean,
  primaryColor: string,
  secondaryColor: string,
): string {
  return isRightClick ? secondaryColor : primaryColor;
}

export function clearToolState(state: ToolState) {
  state.lastPoint = null;
  state.startPoint = null;
  state.lastPreviewPoints = [];
  state.selection = null;
}

export function updateToolState(
  state: ToolState,
  updates: Partial<ToolState>,
): ToolState {
  return { ...state, ...updates };
}

export function resetSelection(selection: SelectionState): SelectionState {
  return {
    isSelecting: false,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isMoving: false,
    moveStartX: 0,
    moveStartY: 0,
    selectedImageData: undefined,
    originalX: undefined,
    originalY: undefined,
  };
}

export function getSelectionBounds(selection: SelectionState) {
  return {
    minX: Math.min(selection.startX, selection.endX),
    maxX: Math.max(selection.startX, selection.endX),
    minY: Math.min(selection.startY, selection.endY),
    maxY: Math.max(selection.startY, selection.endY),
  };
}

export function isPointInSelection(
  x: number,
  y: number,
  selection: SelectionState,
): boolean {
  if (!selection.selectedImageData) return false;

  const bounds = {
    minX: selection.startX,
    maxX: selection.startX + selection.selectedImageData.width,
    minY: selection.startY,
    maxY: selection.startY + selection.selectedImageData.height,
  };

  return (
    x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY
  );
}
