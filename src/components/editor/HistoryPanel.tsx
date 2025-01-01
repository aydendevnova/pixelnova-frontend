"use client";

import { useEffect, useRef, useState } from "react";
import { useHistoryStore } from "@/store/historyStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Undo2, Redo2, Clock, XIcon, HistoryIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HistoryPanelProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClose: () => void;
}

type ThumbnailCache = Record<number, string>;

export default function HistoryPanel({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClose,
}: HistoryPanelProps) {
  const { undoStack, redoStack } = useHistoryStore();
  const thumbnailSize = 64;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumbnailCache, setThumbnailCache] = useState<ThumbnailCache>({});

  const generateThumbnail = (state: (typeof undoStack)[0]) => {
    // Check cache first
    if (thumbnailCache[state.timestamp]) {
      return thumbnailCache[state.timestamp];
    }

    if (!canvasRef.current) return "";
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return "";

    // Clear canvas
    ctx.clearRect(0, 0, thumbnailSize, thumbnailSize);

    // Draw checkerboard pattern for transparency
    ctx.fillStyle = "#E5E7EB";
    for (let x = 0; x < thumbnailSize; x += 8) {
      for (let y = 0; y < thumbnailSize; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillRect(x, y, 8, 8);
        }
      }
    }
    ctx.fillStyle = "#D1D5DB";
    for (let x = 0; x < thumbnailSize; x += 8) {
      for (let y = 0; y < thumbnailSize; y += 8) {
        if ((x + y) % 16 !== 0) {
          ctx.fillRect(x, y, 8, 8);
        }
      }
    }

    // Calculate scale to fit thumbnail
    const scale = Math.min(
      thumbnailSize / state.canvasSize.width,
      thumbnailSize / state.canvasSize.height,
    );

    // Center the image
    const x = (thumbnailSize - state.canvasSize.width * scale) / 2;
    const y = (thumbnailSize - state.canvasSize.height * scale) / 2;

    // Create temporary canvas for the layer
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = state.canvasSize.width;
    tempCanvas.height = state.canvasSize.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return "";

    // Draw all visible layers
    state.layers.forEach((layer) => {
      if (layer.visible && layer.imageData) {
        tempCtx.putImageData(layer.imageData, 0, 0);
      }
    });

    // Draw scaled image
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      tempCanvas,
      x,
      y,
      state.canvasSize.width * scale,
      state.canvasSize.height * scale,
    );

    const thumbnail = canvasRef.current.toDataURL();

    // Cache the thumbnail
    setThumbnailCache((prev) => ({
      ...prev,
      [state.timestamp]: thumbnail,
    }));

    return thumbnail;
  };

  // Generate thumbnails on mount and when history changes
  useEffect(() => {
    const allStates = [...undoStack, ...redoStack];
    allStates.forEach((state) => {
      if (!thumbnailCache[state.timestamp]) {
        generateThumbnail(state);
      }
    });
  }, [undoStack, redoStack]);

  // Current state helper
  const currentState = undoStack[undoStack.length - 1];

  return (
    <div className="flex h-full w-full flex-col bg-gray-900 p-2 md:w-64">
      <div className="mb-2 flex items-center justify-between px-2">
        <h3 className="text-sm font-semibold text-white">
          <span className="">History</span>
        </h3>
        <div className="flex items-center gap-1">
          <div className="hidden gap-1 md:flex">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg text-white",
                !canUndo && "opacity-50",
                canUndo && "hover:bg-gray-700/50 hover:text-gray-200",
              )}
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg text-white",
                !canRedo && "opacity-50",
                canRedo && "hover:bg-gray-700/50 hover:text-gray-200",
              )}
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-800"
          >
            <XIcon className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto">
        <div className="h-[calc(100vh-200px)] flex-1">
          <div className="space-y-2 px-2">
            {/* Hidden canvas for generating thumbnails */}
            <canvas
              ref={canvasRef}
              width={thumbnailSize}
              height={thumbnailSize}
              className="hidden"
            />

            {/* Redo stack (future states) */}
            {redoStack.map((state, index) => (
              <div
                key={state.timestamp}
                className="flex items-center gap-2 rounded-lg bg-gray-800/50 p-2 opacity-50"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded border border-gray-700 sm:h-16 sm:w-16">
                  <img
                    src={
                      thumbnailCache[state.timestamp] ??
                      generateThumbnail(state)
                    }
                    alt={`History state ${index}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Future state</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(state.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}

            {/* Current state */}
            {currentState && (
              <div className="flex items-center gap-2 rounded-lg bg-gray-800 p-2">
                <div className="relative h-12 w-12 overflow-hidden rounded border border-blue-500 sm:h-16 sm:w-16">
                  <img
                    src={
                      thumbnailCache[currentState.timestamp] ??
                      generateThumbnail(currentState)
                    }
                    alt="Current state"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white">
                    Current <span className="hidden md:inline">state</span>
                  </span>
                  <div className="hidden items-center gap-1 text-xs text-gray-400 md:flex">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(currentState.timestamp, {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Undo stack (past states) */}
            {undoStack
              .slice(0, -1)
              .reverse()
              .map((state, index) => (
                <div
                  key={state.timestamp}
                  className="flex items-center gap-2 rounded-lg bg-gray-800/50 p-2"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded border border-gray-700 sm:h-16 sm:w-16">
                    <img
                      src={
                        thumbnailCache[state.timestamp] ??
                        generateThumbnail(state)
                      }
                      alt={`History state ${index}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">
                      Previous <span className="hidden md:inline">state</span>
                    </span>
                    <div className="hidden items-center gap-1 text-xs text-gray-500 md:flex">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(state.timestamp, {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
