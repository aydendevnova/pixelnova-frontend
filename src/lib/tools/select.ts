import { Tool, ToolContext, SelectionState } from "@/types/editor";
import { TextSelect } from "lucide-react";
import { getCanvasCoordinates } from "@/lib/utils/coordinates";

// Add helper function for clamping coordinates
function clampCoordinates(x: number, y: number, width: number, height: number) {
  return {
    x: Math.max(0, Math.min(x, width)),
    y: Math.max(0, Math.min(y, height)),
  };
}

// Minimum size for a selection to be valid
const MIN_SELECTION_SIZE = 1;

export const SelectTool: Tool = {
  id: "select",
  name: "Select",
  icon: TextSelect,
  shortcut: "M",
  cursor: "crosshair",

  onMouseDown: (
    e: React.MouseEvent<HTMLCanvasElement>,
    context: ToolContext,
  ) => {
    const { canvas, viewport, selection, setSelection } = context;
    const coords = getCanvasCoordinates(e, canvas, viewport);

    // If we have an existing selection, check if we're clicking inside it
    if (selection?.selectedImageData) {
      const bounds = {
        minX: selection.startX,
        maxX: selection.startX + selection.selectedImageData.width,
        minY: selection.startY,
        maxY: selection.startY + selection.selectedImageData.height,
      };

      if (
        coords.x >= bounds.minX &&
        coords.x <= bounds.maxX &&
        coords.y >= bounds.minY &&
        coords.y <= bounds.maxY
      ) {
        setSelection({
          ...selection,
          isMoving: true,
          moveStartX: coords.x,
          moveStartY: coords.y,
          originalX: selection.startX,
          originalY: selection.startY,
        });
        return;
      }
    }

    // Clamp coordinates only for initial selection
    const clampedCoords = clampCoordinates(
      coords.x,
      coords.y,
      canvas.width,
      canvas.height,
    );

    // Start a new selection with clamped coordinates
    setSelection({
      isSelecting: true,
      startX: clampedCoords.x,
      startY: clampedCoords.y,
      endX: clampedCoords.x,
      endY: clampedCoords.y,
      isMoving: false,
      moveStartX: clampedCoords.x,
      moveStartY: clampedCoords.y,
      selectedImageData: undefined,
      originalX: undefined,
      originalY: undefined,
    });
  },

  onMouseMove: (
    e: React.MouseEvent<HTMLCanvasElement>,
    context: ToolContext,
  ) => {
    const { canvas, viewport, selection, setSelection } = context;
    if (!selection) return;

    const coords = getCanvasCoordinates(e, canvas, viewport);

    if (selection.isMoving && selection.selectedImageData) {
      const deltaX = coords.x - selection.moveStartX;
      const deltaY = coords.y - selection.moveStartY;
      const newStartX = (selection.originalX ?? 0) + deltaX;
      const newStartY = (selection.originalY ?? 0) + deltaY;

      setSelection({
        ...selection,
        startX: newStartX,
        startY: newStartY,
        endX: newStartX + selection.selectedImageData.width,
        endY: newStartY + selection.selectedImageData.height,
      });
    } else if (selection.isSelecting) {
      // Clamp only the selection end coordinates to prevent capturing outside pixels
      const clampedEnd = clampCoordinates(
        coords.x,
        coords.y,
        canvas.width,
        canvas.height,
      );

      setSelection({
        ...selection,
        endX: clampedEnd.x,
        endY: clampedEnd.y,
        isSelecting: true,
      });
    }
  },

  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>, context: ToolContext) => {
    const {
      canvas,
      viewport,
      selection,
      setSelection,
      layers,
      selectedLayerId,
      shouldClearOriginal,
    } = context;
    if (!selection) return;

    const coords = getCanvasCoordinates(e, canvas, viewport);

    // If we were moving, apply the selection to the layer and clear it
    if (selection.isMoving && selection.selectedImageData) {
      const selectedLayer = layers.find(
        (layer) => layer.id === selectedLayerId,
      );
      if (!selectedLayer?.imageData) return;

      // Create a temporary canvas to apply the moved selection
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = selectedLayer.imageData.width;
      tempCanvas.height = selectedLayer.imageData.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      // Draw the current layer
      tempCtx.putImageData(selectedLayer.imageData, 0, 0);

      // If shouldClearOriginal is true, clear the original selection area
      if (
        shouldClearOriginal &&
        selection.originalX !== undefined &&
        selection.originalY !== undefined
      ) {
        tempCtx.clearRect(
          selection.originalX,
          selection.originalY,
          selection.selectedImageData.width,
          selection.selectedImageData.height,
        );
      }

      // Create another canvas for the selection
      const selectionCanvas = document.createElement("canvas");
      selectionCanvas.width = selection.selectedImageData.width;
      selectionCanvas.height = selection.selectedImageData.height;
      const selectionCtx = selectionCanvas.getContext("2d");
      if (!selectionCtx) return;

      // Draw the selection
      selectionCtx.putImageData(selection.selectedImageData, 0, 0);

      // Simply draw at current position - canvas will handle clipping
      tempCtx.drawImage(selectionCanvas, selection.startX, selection.startY);

      // Update the layer with the new image data
      selectedLayer.imageData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
      );

      // Push to history after moving selection
      if (context.pushHistory) {
        context.pushHistory({
          type: "editor" as const,
          layers: layers.map((layer) => ({
            ...layer,
            imageData: layer.imageData
              ? new ImageData(
                  new Uint8ClampedArray(layer.imageData.data),
                  layer.imageData.width,
                  layer.imageData.height,
                )
              : null,
          })),
          selectedLayerId,
        });
      }

      // Clear the selection
      setSelection({
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
      });
      return;
    }

    // If we were selecting, finalize the selection
    if (selection.isSelecting) {
      // For the final selection, ensure we only capture pixels within the canvas
      const bounds = {
        minX: Math.max(0, Math.min(selection.startX, selection.endX)),
        maxX: Math.min(
          canvas.width,
          Math.max(selection.startX, selection.endX),
        ),
        minY: Math.max(0, Math.min(selection.startY, selection.endY)),
        maxY: Math.min(
          canvas.height,
          Math.max(selection.startY, selection.endY),
        ),
      };

      const width = bounds.maxX - bounds.minX;
      const height = bounds.maxY - bounds.minY;

      // Only create a selection if it meets minimum size requirements
      if (width >= MIN_SELECTION_SIZE && height >= MIN_SELECTION_SIZE) {
        const selectedLayer = layers.find(
          (layer) => layer.id === selectedLayerId,
        );
        if (!selectedLayer?.imageData) return;

        // Create a temporary canvas to extract the selection
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = selectedLayer.imageData.width;
        tempCanvas.height = selectedLayer.imageData.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        // Draw the full layer
        tempCtx.putImageData(selectedLayer.imageData, 0, 0);

        // Extract just the selected region
        const selectedImageData = tempCtx.getImageData(
          bounds.minX,
          bounds.minY,
          width,
          height,
        );

        // Update selection state with the extracted region
        setSelection({
          isSelecting: false,
          startX: bounds.minX,
          startY: bounds.minY,
          endX: bounds.maxX,
          endY: bounds.maxY,
          isMoving: false,
          moveStartX: coords.x,
          moveStartY: coords.y,
          selectedImageData,
          originalX: bounds.minX,
          originalY: bounds.minY,
        });
      } else {
        // Clear the selection if it's too small
        setSelection({
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
        });
      }
    }
  },
};
