"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Canvas, { CanvasRef } from "@/components/editor/Canvas";
import Toolbar from "@/components/editor/Toolbar";
import ColorPicker from "@/components/editor/ColorPicker";
import LayersPanel from "@/components/editor/LayersPanel";
import TopMenuBar from "@/components/editor/TopMenuBar";
import { ErrorBoundary } from "@/components/error-boundary";
import ErrorView from "@/components/error-view";
import { useEditorStore } from "@/store/editorStore";
import { useHistoryStore } from "@/store/historyStore";
import { getAllTools } from "@/lib/tools";
import { createImageData } from "@/lib/utils/canvas";
import { Layer, ToolType } from "@/types/editor";
import { PALETTE_INFO } from "@/lib/utils/colorPalletes";
import { extractColors } from "@/lib/utils/image";
import HistoryPanel from "@/components/editor/HistoryPanel";
import { useToast } from "@/hooks/use-toast";
import { useModal } from "@/hooks/use-modal";

export default function Editor() {
  const {
    canvasSize,
    setCanvasSize,
    selectedTool,
    setSelectedTool,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    brushSize,
    setBrushSize,
    bucketTolerance,
    setBucketTolerance,
    showGrid,
    setShowGrid,
    showHistory,
    setShowHistory,
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    importedColors,
    addCustomColor,
    removeCustomColor,
  } = useEditorStore();

  const { pushHistory, undo, redo, canUndo, canRedo } = useHistoryStore();

  const {
    isImageConversionOpen,
    isImportImageOpen,
    isClearCanvasWarningOpen,
    isResizeCanvasOpen,
    isAIPixelArtOpen,
    isAIColorizerOpen,
  } = useModal();

  const canHandleKeyboardShortcuts =
    !isImageConversionOpen &&
    !isImportImageOpen &&
    !isClearCanvasWarningOpen &&
    !isResizeCanvasOpen &&
    !isAIPixelArtOpen &&
    !isAIColorizerOpen;

  // Add handlers for undo/redo
  const handleUndo = () => {
    const prevState = undo();
    if (prevState) {
      setLayers(prevState.layers);
      setSelectedLayerId(prevState.selectedLayerId);
      setCanvasSize(prevState.canvasSize);
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setLayers(nextState.layers);
      setSelectedLayerId(nextState.selectedLayerId);
      setCanvasSize(nextState.canvasSize);
    }
  };

  // Store history state when layers change
  useEffect(() => {
    if (layers.length > 0) {
      pushHistory({
        type: "editor",
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
        canvasSize,
      });
    }
  }, [layers, selectedLayerId, canvasSize]);

  // Add keyboard shortcuts for undo/redo
  useEffect(() => {
    if (!canHandleKeyboardShortcuts) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  const [isValidSelection, setIsValidSelection] = useState(false);
  const canvasRef = useRef<CanvasRef>(null);

  // Initialize canvas with a blank layer
  useEffect(() => {
    if (layers.length === 0) {
      const blankLayer: Layer = {
        id: "layer_1",
        name: "Layer 1",
        visible: true,
        imageData: createImageData(canvasSize.width, canvasSize.height),
      };
      setLayers([blankLayer]);
      setSelectedLayerId(blankLayer.id);
    }
  }, []);

  const { toast } = useToast();

  const handleClearCanvas = () => {
    const blankLayer: Layer = {
      id: "layer_1",
      name: "Layer 1",
      visible: true,
      imageData: createImageData(canvasSize.width, canvasSize.height),
    };
    setLayers([blankLayer]);
    setSelectedLayerId(blankLayer.id);
  };

  const handleImageImport = (imageData: ImageData) => {
    let finalImageData = imageData;
    const MAX_DIMENSION = 256;

    // Check if image needs resizing
    if (imageData.width > MAX_DIMENSION || imageData.height > MAX_DIMENSION) {
      // Calculate new dimensions maintaining aspect ratio
      const aspectRatio = imageData.width / imageData.height;
      let newWidth = imageData.width;
      let newHeight = imageData.height;

      if (imageData.width > imageData.height) {
        newWidth = MAX_DIMENSION;
        newHeight = Math.round(MAX_DIMENSION / aspectRatio);
      } else {
        newHeight = MAX_DIMENSION;
        newWidth = Math.round(MAX_DIMENSION * aspectRatio);
      }

      // Create temporary canvases for resizing
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = newWidth;
      tempCanvas.height = newHeight;
      const tempCtx = tempCanvas.getContext("2d");

      const sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = imageData.width;
      sourceCanvas.height = imageData.height;
      const sourceCtx = sourceCanvas.getContext("2d");

      if (tempCtx && sourceCtx) {
        // Draw original image and resize
        sourceCtx.putImageData(imageData, 0, 0);
        tempCtx.drawImage(sourceCanvas, 0, 0, newWidth, newHeight);
        finalImageData = tempCtx.getImageData(0, 0, newWidth, newHeight);

        toast({
          title: "Image Too Large - Resized",
          variant: "destructive",
          description: `Click "Generate Pixel Art" and upload this image there to convert it into better pixel art.`,
          duration: 5000,
        });
      }
    }

    // First determine the target canvas size
    const targetWidth = Math.max(canvasSize.width, finalImageData.width);
    const targetHeight = Math.max(canvasSize.height, finalImageData.height);

    // If we need to resize the canvas
    if (
      targetWidth !== canvasSize.width ||
      targetHeight !== canvasSize.height
    ) {
      // Resize all existing layers to match new dimensions
      const resizedLayers = layers.map((layer) => {
        if (!layer.imageData) {
          return {
            ...layer,
            imageData: new ImageData(targetWidth, targetHeight),
          };
        }

        // Create a temporary canvas for resizing
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = targetWidth;
        tempCanvas.height = targetHeight;
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return layer;

        // Create a source canvas with current layer data
        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = layer.imageData.width;
        sourceCanvas.height = layer.imageData.height;
        const sourceCtx = sourceCanvas.getContext("2d");
        if (!sourceCtx) return layer;

        // Draw current layer data
        sourceCtx.putImageData(layer.imageData, 0, 0);

        // Center the existing content in the new canvas
        const x = Math.floor((targetWidth - layer.imageData.width) / 2);
        const y = Math.floor((targetHeight - layer.imageData.height) / 2);
        tempCtx.drawImage(sourceCanvas, x, y);

        return {
          ...layer,
          imageData: tempCtx.getImageData(0, 0, targetWidth, targetHeight),
        };
      });

      setLayers(resizedLayers);
      setCanvasSize({ width: targetWidth, height: targetHeight });
    }

    // Create a temporary canvas for the new layer
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // Create a source canvas for the imported image
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = finalImageData.width;
    sourceCanvas.height = finalImageData.height;
    const sourceCtx = sourceCanvas.getContext("2d");
    if (!sourceCtx) return;

    // Draw the imported image
    sourceCtx.putImageData(finalImageData, 0, 0);

    // Center the imported image in the new layer
    const x = Math.floor((targetWidth - finalImageData.width) / 2);
    const y = Math.floor((targetHeight - finalImageData.height) / 2);
    tempCtx.drawImage(sourceCanvas, x, y);

    const newLayer: Layer = {
      id: `layer_${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      imageData: tempCtx.getImageData(0, 0, targetWidth, targetHeight),
    };

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleImportLayers = (
    importedLayers: { name: string; imageData: ImageData }[],
  ) => {
    if (importedLayers.length === 0) {
      toast({
        title: "Error",
        description: "No layers found to import",
        variant: "destructive",
      });
      return;
    }

    // Find the maximum dimensions among all imported layers
    const maxWidth = Math.max(
      ...importedLayers.map((layer) => layer.imageData.width),
    );
    const maxHeight = Math.max(
      ...importedLayers.map((layer) => layer.imageData.height),
    );

    // Determine target canvas size (max of current and imported dimensions)
    const targetWidth = Math.max(canvasSize.width, maxWidth);
    const targetHeight = Math.max(canvasSize.height, maxHeight);

    try {
      // If we need to resize the canvas
      if (
        targetWidth !== canvasSize.width ||
        targetHeight !== canvasSize.height
      ) {
        // Resize all existing layers to match new dimensions
        const resizedLayers = layers.map((layer) => {
          if (!layer.imageData) {
            return {
              ...layer,
              imageData: new ImageData(targetWidth, targetHeight),
            };
          }

          // Create a temporary canvas for resizing
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = targetWidth;
          tempCanvas.height = targetHeight;
          const tempCtx = tempCanvas.getContext("2d");
          if (!tempCtx) return layer;

          // Create a source canvas with current layer data
          const sourceCanvas = document.createElement("canvas");
          sourceCanvas.width = layer.imageData.width;
          sourceCanvas.height = layer.imageData.height;
          const sourceCtx = sourceCanvas.getContext("2d");
          if (!sourceCtx) return layer;

          // Draw current layer data
          sourceCtx.putImageData(layer.imageData, 0, 0);

          // Center the existing content in the new canvas
          const x = Math.floor((targetWidth - layer.imageData.width) / 2);
          const y = Math.floor((targetHeight - layer.imageData.height) / 2);
          tempCtx.drawImage(sourceCanvas, x, y);

          return {
            ...layer,
            imageData: tempCtx.getImageData(0, 0, targetWidth, targetHeight),
          };
        });

        setLayers(resizedLayers);
        setCanvasSize({ width: targetWidth, height: targetHeight });
      }

      // Process each imported layer
      const newLayers = importedLayers
        .map(({ name, imageData }) => {
          // Create a temporary canvas for the new layer
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = targetWidth;
          tempCanvas.height = targetHeight;
          const tempCtx = tempCanvas.getContext("2d");
          if (!tempCtx) return null;

          // Create a source canvas for the imported image
          const sourceCanvas = document.createElement("canvas");
          sourceCanvas.width = imageData.width;
          sourceCanvas.height = imageData.height;
          const sourceCtx = sourceCanvas.getContext("2d");
          if (!sourceCtx) return null;

          // Draw the imported image
          sourceCtx.putImageData(imageData, 0, 0);

          // Center the imported image in the new layer
          const x = Math.floor((targetWidth - imageData.width) / 2);
          const y = Math.floor((targetHeight - imageData.height) / 2);
          tempCtx.drawImage(sourceCanvas, x, y);

          // Extract layer number from name, handling both formats (Layer 2 or layer_2)
          const cleanedName = name.toLowerCase().replace(/[_\s]/g, "");
          const matches = cleanedName.match(/layer(\d+)/);
          const layerNumber = matches
            ? parseInt(matches[1] ?? "0")
            : layers.length + 1;

          const newLayer: Layer = {
            id: `layer${Date.now()}${layerNumber}`,
            name: `Layer ${layerNumber}`,
            visible: true,
            imageData: tempCtx.getImageData(0, 0, targetWidth, targetHeight),
          };
          return newLayer;
        })
        .filter((layer): layer is Layer => layer !== null);

      // Replace all existing layers with the imported ones
      if (newLayers.length > 0 && newLayers[0]) {
        setLayers(newLayers);
        setSelectedLayerId(newLayers[0].id);
        toast({
          title: "Success",
          description: "Layers imported successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "No valid layers found to import",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import layers",
        variant: "destructive",
      });
      console.error("Error importing layers:", error);
    }
  };

  const handlePaletteChange = (newPalette: keyof typeof PALETTE_INFO) => {
    const newPaletteColors = PALETTE_INFO[newPalette]?.colors ?? [];
    const extractedColors = layers.flatMap((layer) =>
      layer.imageData ? extractColors(layer.imageData) : [],
    );

    // Limit the number of imported colors
    const maxImportedColors = 100 - newPaletteColors.length;
    const uniqueExtractedColors = [...new Set(extractedColors)];

    if (uniqueExtractedColors.length > maxImportedColors) {
      toast({
        title: "Too many unique colors",
        description: `Image converted into black and white.`,
        duration: 5000,
      });
    }

    // Only process up to the maximum allowed colors
    uniqueExtractedColors.slice(0, maxImportedColors).forEach((color) => {
      if (
        !newPaletteColors.includes(color) &&
        !importedColors.includes(color)
      ) {
        addCustomColor(color);
      }
    });

    // Remove imported colors that are now part of the new palette
    importedColors.forEach((importedColor) => {
      if (newPaletteColors.includes(importedColor)) {
        removeCustomColor(importedColor);
      }
    });
  };

  const onDeleteSelection = () => {
    if (canvasRef.current?.deleteSelection) {
      canvasRef.current.deleteSelection();
    }
  };

  const handleCanvasResize = (newWidth: number, newHeight: number) => {
    // Resize all layers to match new dimensions
    const resizedLayers = layers.map((layer) => {
      if (!layer.imageData) {
        return {
          ...layer,
          imageData: new ImageData(newWidth, newHeight),
        };
      }

      // Create a temporary canvas for resizing
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = newWidth;
      tempCanvas.height = newHeight;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return layer;

      // Create a source canvas with current layer data
      const sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = layer.imageData.width;
      sourceCanvas.height = layer.imageData.height;
      const sourceCtx = sourceCanvas.getContext("2d");
      if (!sourceCtx) return layer;

      // Draw current layer data
      sourceCtx.putImageData(layer.imageData, 0, 0);

      // Draw onto new size canvas (preserving content)
      tempCtx.drawImage(sourceCanvas, 0, 0);

      return {
        ...layer,
        imageData: tempCtx.getImageData(0, 0, newWidth, newHeight),
      };
    });

    setLayers(resizedLayers);
    setCanvasSize({ width: newWidth, height: newHeight });
  };

  // Inside the Editor component
  const [hasClipboardData, setHasClipboardData] = useState(false);

  // Update the copy handler to set clipboard state
  const handleCopy = useCallback(() => {
    if (!canHandleKeyboardShortcuts) return;
    const copyEvent = new KeyboardEvent("keydown", {
      key: "c",
      ctrlKey: true,
      metaKey: true,
    });
    window.dispatchEvent(copyEvent);
    setHasClipboardData(true);
  }, []);

  // Update the paste handler
  const handlePaste = useCallback(() => {
    if (!hasClipboardData) return;
    if (!canHandleKeyboardShortcuts) return;
    const pasteEvent = new KeyboardEvent("keydown", {
      key: "v",
      ctrlKey: true,
      metaKey: true,
    });
    window.dispatchEvent(pasteEvent);
  }, [hasClipboardData]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 duration-700 animate-in fade-in">
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <ErrorView error={error} reset={reset} />
        )}
      >
        <TopMenuBar
          onClearCanvas={handleClearCanvas}
          onImportImage={handleImageImport}
          onImportLayers={handleImportLayers}
          onGeneratePalette={(colors) => {
            colors.forEach(addCustomColor);
          }}
          selectedTool={selectedTool.id}
          SelectedToolIcon={selectedTool.icon}
          bucketTolerance={bucketTolerance}
          onBucketToleranceChange={setBucketTolerance}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          layers={layers}
          isValidSelection={isValidSelection}
          onDeleteSelection={onDeleteSelection}
          canvasRef={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onCanvasResize={handleCanvasResize}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory(!showHistory)}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onCopy={handleCopy}
          onPaste={hasClipboardData ? handlePaste : undefined}
          onToolSelect={(toolType: ToolType) => {
            const tool = getAllTools().find((t) => t.id === toolType);
            if (tool) setSelectedTool(tool);
          }}
        />
      </ErrorBoundary>
      <div className="relative flex flex-1">
        <div className="absolute left-0 top-0 z-20">
          <ErrorBoundary
            fallback={({ error, reset }) => (
              <ErrorView error={error} reset={reset} />
            )}
          >
            <Toolbar
              selectedTool={selectedTool.id}
              onToolSelect={(toolId: ToolType) => {
                const tool = getAllTools().find((t) => t.id === toolId);
                if (tool) setSelectedTool(tool);
              }}
            />
          </ErrorBoundary>
        </div>

        <div className="flex h-[calc(100vh-4rem)] flex-1">
          <ErrorBoundary
            fallback={({ error, reset }) => (
              <ErrorView error={error} reset={reset} />
            )}
          >
            <Canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              selectedTool={selectedTool.id}
              bucketTolerance={bucketTolerance}
              brushSize={brushSize}
              showGrid={showGrid}
              onColorPick={(color, isRightClick) => {
                if (isRightClick) {
                  setSecondaryColor(color);
                } else {
                  setPrimaryColor(color);
                }
              }}
              onToolSelect={(toolId: ToolType) => {
                const tool = getAllTools().find((t) => t.id === toolId);
                if (tool) setSelectedTool(tool);
              }}
              layers={layers}
              selectedLayerId={selectedLayerId}
              setValidSelection={setIsValidSelection}
              onDeleteSelection={onDeleteSelection}
            />
          </ErrorBoundary>

          <div className="flex flex-col">
            <ErrorBoundary
              fallback={({ error, reset }) => (
                <ErrorView error={error} reset={reset} />
              )}
            >
              <LayersPanel
                isHistoryOpen={showHistory}
                layers={layers}
                selectedLayerId={selectedLayerId}
                onLayerSelect={setSelectedLayerId}
                onLayerVisibilityToggle={(layerId: string) => {
                  setLayers((prev) =>
                    prev.map((layer) =>
                      layer.id === layerId
                        ? { ...layer, visible: !layer.visible }
                        : layer,
                    ),
                  );
                }}
                onAddLayer={() => {
                  const newLayer: Layer = {
                    id: `layer_${Date.now()}`,
                    name: `Layer ${layers.length + 1}`,
                    visible: true,
                    imageData: createImageData(
                      canvasSize.width,
                      canvasSize.height,
                    ),
                  };
                  setLayers((prev) => [...prev, newLayer]);
                  setSelectedLayerId(newLayer.id);
                }}
                onDeleteLayer={(layerId: string) => {
                  setLayers((prev) =>
                    prev.filter((layer) => layer.id !== layerId),
                  );
                  if (selectedLayerId === layerId && layers.length > 1) {
                    const index = layers.findIndex((l) => l.id === layerId);
                    if (index !== -1) {
                      const newIndex = Math.max(0, index - 1);
                      const layer = layers[newIndex];
                      if (layer) {
                        setSelectedLayerId(layer.id);
                      }
                    }
                  }
                }}
                onLayerReorder={(fromIndex: number, toIndex: number) => {
                  setLayers((prev: Layer[]) => {
                    const newLayers = [...prev];
                    const [movedLayer] = newLayers.splice(fromIndex, 1);
                    if (movedLayer) {
                      newLayers.splice(toIndex, 0, movedLayer);
                      return newLayers.map((layer, index) => ({
                        ...layer,
                        id: `layer_${index}`,
                        name: `Layer ${index + 1}`,
                      }));
                    }
                    return prev;
                  });
                }}
              />
            </ErrorBoundary>

            {showHistory && (
              <ErrorBoundary
                fallback={({ error, reset }) => (
                  <ErrorView error={error} reset={reset} />
                )}
              >
                <div className="absolute right-0 top-0 md:w-64">
                  <HistoryPanel
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onClose={() => setShowHistory(false)}
                  />
                </div>
              </ErrorBoundary>
            )}
          </div>
        </div>
      </div>
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <ErrorView error={error} reset={reset} />
        )}
      >
        <ColorPicker
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          onPrimaryColorSelect={setPrimaryColor}
          onSecondaryColorSelect={setSecondaryColor}
          importedColors={importedColors}
          onAddCustomColor={addCustomColor}
          onPaletteChange={handlePaletteChange}
        />
      </ErrorBoundary>
    </div>
  );
}
