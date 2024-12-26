import { Tool, ToolContext, SelectionState } from "@/types/editor";
import { TextSelect } from "lucide-react";

export const SelectTool: Tool = {
  id: "select",
  name: "Select",
  icon: TextSelect,
  shortcut: "M",
  cursor: "crosshair",

  onMouseDown: (e: React.MouseEvent, context: ToolContext) => {
    console.log("🔲 SELECT onMouseDown");
    const { canvas, viewport, selection, setSelection } = context;
    const coords = getCanvasCoordinates(e, canvas, viewport);
    console.log("🔲 Mouse coords:", coords);

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
        console.log("🔲 Starting move");
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

    // Start a new selection
    console.log("🔲 Starting new selection");
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
    console.log("🔲 MOVE", {
      coords,
      isSelecting: selection.isSelecting,
      isMoving: selection.isMoving,
    });

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
      setSelection({
        ...selection,
        endX: coords.x,
        endY: coords.y,
        isSelecting: true,
      });
    }
  },

  onMouseUp: (e: React.MouseEvent, context: ToolContext) => {
    console.log("🔲 SELECT onMouseUp");
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
    console.log("🔲 UP", {
      coords,
      isSelecting: selection.isSelecting,
      isMoving: selection.isMoving,
    });

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

      // Create another canvas for the selection
      const selectionCanvas = document.createElement("canvas");
      selectionCanvas.width = selection.selectedImageData.width;
      selectionCanvas.height = selection.selectedImageData.height;
      const selectionCtx = selectionCanvas.getContext("2d");
      if (!selectionCtx) return;

      // Draw the selection
      selectionCtx.putImageData(selection.selectedImageData, 0, 0);

      // Draw the selection at its new position
      tempCtx.drawImage(selectionCanvas, selection.startX, selection.startY);

      // Update the layer with the new image data
      selectedLayer.imageData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
      );

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
      const bounds = {
        minX: Math.min(selection.startX, selection.endX),
        maxX: Math.max(selection.startX, selection.endX),
        minY: Math.min(selection.startY, selection.endY),
        maxY: Math.max(selection.startY, selection.endY),
      };

      const width = bounds.maxX - bounds.minX;
      const height = bounds.maxY - bounds.minY;

      // Only create a selection if it has a non-zero size
      if (width > 0 && height > 0) {
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
      }
    }
  },
};

function getCanvasCoordinates(
  e: React.MouseEvent,
  canvas: HTMLCanvasElement,
  viewport: { x: number; y: number; scale: number },
) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left - viewport.x) / viewport.scale);
  const y = Math.floor((e.clientY - rect.top - viewport.y) / viewport.scale);
  return { x, y };
}
