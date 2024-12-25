import { Tool, ToolContext, SelectionState } from "@/types/editor";
import { TextSelect } from "lucide-react";
import { getCanvasCoordinates } from "@/lib/utils/coordinates";

export const SelectTool: Tool = {
  id: "select",
  name: "Select",
  icon: TextSelect,
  shortcut: "M",
  cursor: "crosshair",

  onMouseDown: (e: React.MouseEvent, context: ToolContext) => {
    const { canvas, viewport, selection, setSelection } = context;
    const coords = getCanvasCoordinates(e, canvas, viewport);

    // Check if clicking inside existing selection
    if (selection?.selectedImageData) {
      const bounds = getSelectionBounds(selection);
      if (
        coords.x >= bounds.minX &&
        coords.x <= bounds.maxX &&
        coords.y >= bounds.minY &&
        coords.y <= bounds.maxY
      ) {
        // Start moving existing selection
        setSelection({
          ...selection,
          isMoving: true,
          moveStartX: coords.x,
          moveStartY: coords.y,
        });
        return;
      }
    }

    // Start new selection
    setSelection({
      isSelecting: true,
      startX: coords.x,
      startY: coords.y,
      endX: coords.x,
      endY: coords.y,
      isMoving: false,
      moveStartX: coords.x,
      moveStartY: coords.y,
      selectedImageData: undefined,
      originalX: undefined,
      originalY: undefined,
    });
  },

  onMouseMove: (e: React.MouseEvent, context: ToolContext) => {
    const { canvas, viewport, selection, setSelection } = context;
    if (!selection) return;

    const coords = getCanvasCoordinates(e, canvas, viewport);

    if (selection.isMoving && selection.selectedImageData) {
      // Move existing selection
      const deltaX = coords.x - selection.moveStartX;
      const deltaY = coords.y - selection.moveStartY;

      setSelection({
        ...selection,
        startX: (selection.originalX ?? selection.startX) + deltaX,
        startY: (selection.originalY ?? selection.startY) + deltaY,
        endX: selection.startX + selection.selectedImageData.width,
        endY: selection.startY + selection.selectedImageData.height,
      });
    } else if (selection.isSelecting) {
      // Update selection rectangle
      setSelection({
        ...selection,
        endX: coords.x,
        endY: coords.y,
      });
    }
  },

  onMouseUp: (e: React.MouseEvent, context: ToolContext) => {
    const {
      canvas,
      viewport,
      selection,
      setSelection,
      layers,
      selectedLayerId,
    } = context;
    if (!selection) return;

    const coords = getCanvasCoordinates(e, canvas, viewport);

    if (selection.isMoving) {
      // Finish moving selection
      setSelection({
        ...selection,
        isMoving: false,
        originalX: selection.startX,
        originalY: selection.startY,
      });
    } else if (selection.isSelecting) {
      // Finish new selection
      const bounds = getSelectionBounds(selection);
      const selectedLayer = layers.find(
        (layer) => layer.id === selectedLayerId,
      );
      if (!selectedLayer?.imageData) return;

      // Create a temporary canvas to hold the selection
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = bounds.width;
      tempCanvas.height = bounds.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      // Copy the selected area
      tempCtx.putImageData(
        selectedLayer.imageData,
        0,
        0,
        bounds.minX,
        bounds.minY,
        bounds.width,
        bounds.height,
      );

      setSelection({
        ...selection,
        isSelecting: false,
        selectedImageData: tempCtx.getImageData(
          0,
          0,
          bounds.width,
          bounds.height,
        ),
        originalX: bounds.minX,
        originalY: bounds.minY,
      });
    }
  },
};

function getSelectionBounds(selection: SelectionState) {
  const minX = Math.min(selection.startX, selection.endX);
  const maxX = Math.max(selection.startX, selection.endX);
  const minY = Math.min(selection.startY, selection.endY);
  const maxY = Math.max(selection.startY, selection.endY);

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
