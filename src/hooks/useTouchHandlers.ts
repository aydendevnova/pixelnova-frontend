import { useState, useCallback } from "react";
import { ViewportState } from "@/types/editor";
import { getTouchCoordinates } from "@/lib/utils/coordinates";

interface TouchState {
  touchStartX: number;
  touchStartY: number;
  initialPinchDistance: number | null;
  initialScale: number | null;
  lastTouchX: number | null;
  lastTouchY: number | null;
  touchStartTime: number | null;
  lastDrawTime: number | null;
}

interface UseTouchHandlersProps {
  viewport: ViewportState;
  setViewport: (viewport: ViewportState) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  displayCanvasRef: React.RefObject<HTMLCanvasElement>;
  onTouchDraw: (x: number, y: number) => void;
}

export function useTouchHandlers({
  viewport,
  setViewport,
  containerRef,
  displayCanvasRef,
  onTouchDraw,
}: UseTouchHandlersProps) {
  const [touchState, setTouchState] = useState<TouchState>({
    touchStartX: 0,
    touchStartY: 0,
    initialPinchDistance: null,
    initialScale: null,
    lastTouchX: null,
    lastTouchY: null,
    touchStartTime: null,
    lastDrawTime: null,
  });

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const displayCanvas = displayCanvasRef.current;
      if (!displayCanvas || !e.touches[0]) return;

      const touch = e.touches[0];
      const now = Date.now();

      if (e.touches.length === 2 && e.touches[1]) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );

        setTouchState({
          touchStartX: touch.clientX,
          touchStartY: touch.clientY,
          lastTouchX: touch.clientX,
          lastTouchY: touch.clientY,
          initialPinchDistance: distance,
          initialScale: viewport.scale,
          touchStartTime: now,
          lastDrawTime: null,
        });
      } else if (e.touches.length === 1) {
        const coords = getTouchCoordinates(touch, displayCanvas, viewport);
        onTouchDraw(coords.x, coords.y);

        setTouchState({
          touchStartX: touch.clientX,
          touchStartY: touch.clientY,
          lastTouchX: touch.clientX,
          lastTouchY: touch.clientY,
          initialPinchDistance: null,
          initialScale: viewport.scale,
          touchStartTime: now,
          lastDrawTime: now,
        });
      }
    },
    [viewport, displayCanvasRef, onTouchDraw],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const displayCanvas = displayCanvasRef.current;
      if (!displayCanvas || !e.touches[0]) return;

      if (e.touches.length === 2 && e.touches[1]) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY,
        );

        if (touchState.initialPinchDistance && touchState.initialScale) {
          const scale =
            (currentDistance / touchState.initialPinchDistance) *
            touchState.initialScale;
          const newScale = Math.max(1, Math.min(32, scale));

          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;

          const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
          const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

          const worldX = (centerX - viewport.x) / viewport.scale;
          const worldY = (centerY - viewport.y) / viewport.scale;

          setViewport({
            x: centerX - worldX * newScale,
            y: centerY - worldY * newScale,
            scale: newScale,
          });
        }
      } else if (e.touches.length === 1) {
        const touch = e.touches[0];
        const coords = getTouchCoordinates(touch, displayCanvas, viewport);
        onTouchDraw(coords.x, coords.y);
      }

      // Update last touch position if we have a touch
      const touch = e.touches[0];
      if (touch) {
        setTouchState((prev) => ({
          ...prev,
          lastTouchX: touch.clientX,
          lastTouchY: touch.clientY,
        }));
      }
    },
    [
      viewport,
      containerRef,
      displayCanvasRef,
      touchState,
      onTouchDraw,
      setViewport,
    ],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();

      if (e.touches.length === 1) {
        const touch = e.touches[0];
        if (touch) {
          setTouchState((prev) => ({
            ...prev,
            lastTouchX: touch.clientX,
            lastTouchY: touch.clientY,
            initialPinchDistance: null,
            initialScale: viewport.scale,
          }));
        }
      } else if (e.touches.length === 0) {
        setTouchState({
          touchStartX: 0,
          touchStartY: 0,
          initialPinchDistance: null,
          initialScale: viewport.scale,
          lastTouchX: null,
          lastTouchY: null,
          touchStartTime: null,
          lastDrawTime: null,
        });
      }
    },
    [viewport.scale],
  );

  return {
    touchState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
