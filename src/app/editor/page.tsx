"use client";

import { useEffect } from "react";
import Canvas from "@/components/editor/Canvas";
import Toolbar from "@/components/editor/Toolbar";
import ColorPicker from "@/components/editor/ColorPicker";
import LayersPanel from "@/components/editor/LayersPanel";
import TopMenuBar from "@/components/editor/TopMenuBar";
import { ErrorBoundary } from "@/components/error-boundary";
import ErrorView from "@/components/error-view";
import { useEditorStore } from "@/store/editorStore";
import { commandManager } from "@/lib/commands";
import { getAllTools } from "@/lib/tools";
import { createImageData } from "@/lib/utils/canvas";
import { Layer, Tool, ToolType } from "@/types/editor";

export default function Editor() {
  const {
    canvasSize,
    selectedTool,
    primaryColor,
    secondaryColor,
    brushSize,
    bucketTolerance,
    showGrid,
    layers,
    selectedLayerId,
    customColors,
    setCanvasSize,
    setSelectedTool,
    setPrimaryColor,
    setSecondaryColor,
    setBrushSize,
    setBucketTolerance,
    setShowGrid,
    setLayers,
    setSelectedLayerId,
    addCustomColor,
  } = useEditorStore();

  // Initialize canvas with a blank layer
  useEffect(() => {
    if (layers.length === 0) {
      const blankLayer: Layer = {
        id: "layer_0",
        name: "Layer 1",
        visible: true,
        imageData: createImageData(canvasSize.width, canvasSize.height),
      };
      setLayers([blankLayer]);
      setSelectedLayerId(blankLayer.id);
    }
  }, [
    canvasSize.width,
    canvasSize.height,
    layers.length,
    setLayers,
    setSelectedLayerId,
  ]);

  const handleClearCanvas = () => {
    const blankLayer: Layer = {
      id: "layer_0",
      name: "Layer 1",
      visible: true,
      imageData: createImageData(canvasSize.width, canvasSize.height),
    };
    setLayers([blankLayer]);
    setSelectedLayerId(blankLayer.id);
    commandManager.clear();
  };

  const handleImageImport = (imageData: ImageData) => {
    setCanvasSize({ width: imageData.width, height: imageData.height });
    const newLayer: Layer = {
      id: `layer_${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      imageData,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleGeneratePalette = (colors: string[]) => {
    colors.forEach(addCustomColor);
  };

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
          onGeneratePalette={(colors) => {
            colors.forEach(addCustomColor);
          }}
          selectedTool={selectedTool.id}
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
                selectedTool={selectedTool.id}
                onToolSelect={(toolId: ToolType) => {
                  const tool = getAllTools().find((t) => t.id === toolId);
                  if (tool) setSelectedTool(tool);
                }}
                canUndo={commandManager.canUndo()}
                canRedo={commandManager.canRedo()}
                onUndo={() => commandManager.undo()}
                onRedo={() => commandManager.redo()}
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
                width={canvasSize.width}
                height={canvasSize.height}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                selectedTool={selectedTool.id}
                bucketTolerance={bucketTolerance}
                brushSize={brushSize}
                showGrid={showGrid}
                onToolSelect={(toolId: ToolType) => {
                  const tool = getAllTools().find((t) => t.id === toolId);
                  if (tool) setSelectedTool(tool);
                }}
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
                onAddCustomColor={addCustomColor}
              />
              <LayersPanel
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
                  if (layers.length <= 1) return;
                  setLayers((prev) => {
                    const filtered = prev.filter(
                      (layer) => layer.id !== layerId,
                    );
                    if (filtered.length === 0) return prev;
                    return filtered.map((layer, index) => ({
                      ...layer,
                      id: `layer_${index}`,
                      name: `Layer ${index + 1}`,
                    }));
                  });
                  if (selectedLayerId === layerId) {
                    setSelectedLayerId("layer_0");
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
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
