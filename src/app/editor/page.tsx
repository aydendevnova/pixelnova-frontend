"use client";

import { useState, useCallback, useRef } from "react";
import Canvas from "@/components/editor/Canvas";
import Toolbar from "@/components/editor/Toolbar";
import ColorPicker from "@/components/editor/ColorPicker";
import LayersPanel from "@/components/editor/LayersPanel";
import TopMenuBar from "@/components/editor/TopMenuBar";
import { ErrorBoundary } from "@/components/error-boundary";
import ErrorView from "@/components/error-view";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  imageData: ImageData | null;
}

interface CanvasRef {
  clearCanvas: () => void;
  importImage: (imageData: ImageData) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  getLayerImageData: () => ImageData | null;
  saveToHistory: (layerId: string) => void;
}

export default function Editor() {
  const canvasRef = useRef<CanvasRef>(null);
  const [selectedTool, setSelectedTool] = useState("pencil");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  const [canvasSize, setCanvasSize] = useState({ width: 32, height: 32 });
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [bucketTolerance, setBucketTolerance] = useState(1);
  const [brushSize, setBrushSize] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: "layer_0",
      name: "Layer 1",
      visible: true,
      imageData: null,
    },
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState("layer_0");

  const handleHistoryChange = useCallback(
    (canUndo: boolean, canRedo: boolean) => {
      setCanUndo(canUndo);
      setCanRedo(canRedo);
    },
    [],
  );

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
  };

  // Handle canvas clearing
  const handleClearCanvas = useCallback(() => {
    canvasRef.current?.clearCanvas();
    setCanvasSize({ width: 32, height: 32 });
  }, []);

  // Handle image import
  const handleImageImport = useCallback(
    (imageData: ImageData) => {
      setCanvasSize({ width: imageData.width, height: imageData.height });
      // Create a new layer for the imported image
      const newLayer: Layer = {
        id: `layer_${Date.now()}`,
        name: `Layer ${layers.length + 1}`,
        visible: true,
        imageData: imageData,
      };
      setLayers((prev) => [...prev, newLayer]);
      setSelectedLayerId(newLayer.id);
      // Use setTimeout to ensure the canvas has updated its size before importing
      setTimeout(() => {
        canvasRef.current?.importImage(imageData);
      }, 5);
    },
    [layers.length],
  );

  // Handle palette generation
  const handleGeneratePalette = useCallback((colors: string[]) => {
    setCustomColors(colors);
  }, []);

  const handleAddCustomColor = useCallback((color: string) => {
    setCustomColors((prev) => [...prev, color]);
  }, []);

  // Layer management functions
  const handleAddLayer = useCallback(() => {
    const newLayer: Layer = {
      id: `layer_${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      imageData: null,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    canvasRef.current?.saveToHistory(newLayer.id);
  }, [layers.length]);

  const handleDeleteLayer = useCallback(
    (layerId: string) => {
      if (layers.length <= 1) return; // Don't delete the last layer

      // Remove the layer and reassign IDs
      setLayers((prev) => {
        const filteredLayers = prev.filter((layer) => layer.id !== layerId);
        return filteredLayers.map((layer, index) => ({
          ...layer,
          id: `layer_${index}`,
          name: `Layer ${index + 1}`,
        }));
      });

      // Update selected layer ID
      setSelectedLayerId((currentId) => {
        if (currentId === layerId) {
          // If deleted layer was selected, select the first layer
          return "layer_0";
        }
        // If selected layer was after the deleted one, update its ID
        const currentIndex = layers.findIndex((l) => l.id === currentId);
        const deletedIndex = layers.findIndex((l) => l.id === layerId);
        if (currentIndex > deletedIndex) {
          return `layer_${currentIndex - 1}`;
        }
        return currentId;
      });

      canvasRef.current?.saveToHistory(selectedLayerId);
    },
    [layers],
  );

  const handleToggleLayerVisibility = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer,
      ),
    );
    canvasRef.current?.saveToHistory(selectedLayerId);
  }, []);

  const handleLayerSelect = useCallback((layerId: string) => {
    setSelectedLayerId(layerId);
  }, []);

  const handleLayerReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      setLayers((prev) => {
        const newLayers = [...prev];
        const [movedLayer] = newLayers.splice(fromIndex, 1);
        if (movedLayer) {
          newLayers.splice(toIndex, 0, movedLayer);
          // Reassign IDs and names based on new order
          return newLayers.map((layer, index) => ({
            ...layer,
            id: `layer_${index}`,
            name: `Layer ${index + 1}`,
          }));
        }
        return prev;
      });
      canvasRef.current?.saveToHistory(selectedLayerId);
    },
    [],
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <ErrorView error={error} reset={reset} />
        )}
      >
        <TopMenuBar
          onClearCanvas={handleClearCanvas}
          onImportImage={handleImageImport}
          onGeneratePalette={handleGeneratePalette}
          selectedTool={selectedTool}
          bucketTolerance={bucketTolerance}
          onBucketToleranceChange={setBucketTolerance}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          layers={layers}
        />

        <div className="flex flex-1">
          {/* Left Toolbar */}
          <div className="w-20 bg-gray-700 p-2">
            <ErrorBoundary
              fallback={({ error, reset }) => (
                <ErrorView error={error} reset={reset} />
              )}
            >
              <Toolbar
                selectedTool={selectedTool}
                onToolSelect={setSelectedTool}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />
            </ErrorBoundary>
          </div>

          {/* Main Canvas Area */}
          <div className="relative flex-1">
            <ErrorBoundary
              fallback={({ error, reset }) => (
                <ErrorView error={error} reset={reset} />
              )}
            >
              <Canvas
                // @ts-expect-error - CanvasRef is not assignable to LegacyRef
                ref={canvasRef}
                onToolSelect={setSelectedTool}
                width={canvasSize.width}
                height={canvasSize.height}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                selectedTool={selectedTool}
                onHistoryChange={handleHistoryChange}
                onColorPick={(color, isRightPressed) => {
                  if (isRightPressed) {
                    setSecondaryColor(color);
                  } else {
                    setPrimaryColor(color);
                  }
                }}
                bucketTolerance={bucketTolerance}
                brushSize={brushSize}
                showGrid={showGrid}
                layers={layers}
                selectedLayerId={selectedLayerId}
              />
            </ErrorBoundary>
          </div>

          {/* Right Panel */}
          <div className="z-10 flex w-64 flex-col gap-4 bg-gray-700 p-4">
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
                customColors={customColors}
                onAddCustomColor={handleAddCustomColor}
              />
              <LayersPanel
                layers={layers}
                selectedLayerId={selectedLayerId}
                onLayerSelect={handleLayerSelect}
                onLayerVisibilityToggle={handleToggleLayerVisibility}
                onAddLayer={handleAddLayer}
                onDeleteLayer={handleDeleteLayer}
                onLayerReorder={handleLayerReorder}
              />
            </ErrorBoundary>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
