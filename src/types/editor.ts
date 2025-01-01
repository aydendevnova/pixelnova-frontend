export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  imageData: ImageData | null;
}

export type ToolType =
  | "pencil"
  | "eraser"
  | "bucket"
  | "select"
  | "eyedropper"
  | "pan"
  | "line"
  | "square"
  | "circle";

export interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

export interface SelectionState {
  isSelecting: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isMoving: boolean;
  moveStartX: number;
  moveStartY: number;
  selectedImageData?: ImageData;
  originalX?: number;
  originalY?: number;
  shouldClearOriginal?: boolean;
  isPastedContent?: boolean;
}

export interface Command {
  execute: () => void;
  undo: () => void;
}

export interface Tool {
  id: ToolType;
  name: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  shortcut: string;
  cursor?: string;
  onMouseDown?: (
    e: React.MouseEvent<HTMLCanvasElement>,
    context: ToolContext,
  ) => void;
  onMouseMove?: (
    e: React.MouseEvent<HTMLCanvasElement>,
    context: ToolContext,
  ) => void;
  onMouseUp?: (
    e: React.MouseEvent<HTMLCanvasElement>,
    context: ToolContext,
  ) => void;
  onConfirmPaste?: (
    context: Pick<
      ToolContext,
      "canvas" | "layers" | "selectedLayerId" | "selection"
    >,
  ) => void;
}

export interface ToolContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  viewport: ViewportState;
  primaryColor: string;
  secondaryColor: string;
  brushSize: number;
  bucketTolerance: number;
  layers: Layer[];
  selectedLayerId: string;
  onColorPick?: (color: string, isRightClick: boolean) => void;
  selection?: SelectionState;
  setSelection: (selection: SelectionState) => void;
  shouldClearOriginal: boolean;
  pushHistory?: (state: {
    type: "editor";
    layers: Layer[];
    selectedLayerId: string;
  }) => void;
}

export interface PreviewableTool extends Tool {
  lastPreviewPoints: { x: number; y: number }[];
}
