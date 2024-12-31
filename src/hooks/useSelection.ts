import { useState, useCallback } from "react";
import { SelectionState, Layer } from "@/types/editor";

interface UseSelectionProps {
  width: number;
  height: number;
  layers: Layer[];
  selectedLayerId: string;
  onDeleteSelection?: () => void;
  onRender?: () => void;
}

export function useSelection({
  width,
  height,
  layers,
  selectedLayerId,
  onDeleteSelection,
  onRender,
}: UseSelectionProps) {
  const [selection, setSelection] = useState<SelectionState>({
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

  const clearSelection = useCallback(() => {
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
    onRender?.();
  }, [onRender]);

  const deleteSelection = useCallback(() => {
    setSelection((currentSelection) => {
      if (!currentSelection.selectedImageData) return currentSelection;

      const selectedLayer = layers.find(
        (layer) => layer.id === selectedLayerId,
      );
      if (!selectedLayer || !selectedLayer.visible) return currentSelection;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return currentSelection;

      if (selectedLayer.imageData) {
        tempCtx.putImageData(selectedLayer.imageData, 0, 0);

        tempCtx.clearRect(
          currentSelection.originalX ?? 0,
          currentSelection.originalY ?? 0,
          currentSelection.selectedImageData.width,
          currentSelection.selectedImageData.height,
        );

        selectedLayer.imageData = tempCtx.getImageData(0, 0, width, height);

        // Schedule the callbacks after state update
        setTimeout(() => {
          onRender?.();
          onDeleteSelection?.();
        }, 0);

        // Return the new state instead of setting it directly
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
      return currentSelection;
    });
  }, [layers, selectedLayerId, width, height, onDeleteSelection, onRender]);

  const startSelection = useCallback(
    (x: number, y: number) => {
      setSelection((prev) => ({
        ...prev,
        isSelecting: true,
        startX: x,
        startY: y,
        endX: x,
        endY: y,
      }));
      onRender?.();
    },
    [onRender],
  );

  const updateSelection = useCallback(
    (x: number, y: number) => {
      setSelection((prev) => ({
        ...prev,
        endX: x,
        endY: y,
      }));
      onRender?.();
    },
    [onRender],
  );

  const moveSelection = useCallback(
    (x: number, y: number) => {
      if (!selection.selectedImageData) return;

      setSelection((prev) => ({
        ...prev,
        isMoving: true,
        moveStartX: x,
        moveStartY: y,
      }));
      onRender?.();
    },
    [selection.selectedImageData, onRender],
  );

  const updateSelectionMove = useCallback(
    (x: number, y: number) => {
      if (!selection.isMoving) return;

      const deltaX = x - selection.moveStartX;
      const deltaY = y - selection.moveStartY;

      setSelection((prev) => ({
        ...prev,
        startX: prev.startX + deltaX,
        startY: prev.startY + deltaY,
        endX: prev.endX + deltaX,
        endY: prev.endY + deltaY,
        moveStartX: x,
        moveStartY: y,
      }));

      // Ensure render happens after state update
      requestAnimationFrame(() => {
        onRender?.();
      });
    },
    [selection.isMoving, selection.moveStartX, selection.moveStartY, onRender],
  );

  const finishSelection = useCallback(() => {
    setSelection((prev) => ({
      ...prev,
      isSelecting: false,
    }));
    onRender?.();
  }, [onRender]);

  const finishMove = useCallback(() => {
    if (!selection.isMoving) return;

    setSelection((prev) => ({
      ...prev,
      isMoving: false,
    }));

    // Force a render after dropping the selection
    requestAnimationFrame(() => {
      onRender?.();
    });
  }, [selection.isMoving, onRender]);

  return {
    selection,
    setSelection,
    clearSelection,
    deleteSelection,
    startSelection,
    updateSelection,
    moveSelection,
    updateSelectionMove,
    finishSelection,
    finishMove,
  };
}
