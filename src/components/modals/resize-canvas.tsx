import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Plus, Minus, ArrowRight } from "lucide-react";
import { CanvasRef } from "../editor/Canvas";
import { useHistoryStore } from "@/store/historyStore";
import {
  generateResizePreview,
  PadDirection,
  WidthPadDirection,
  HeightPadDirection,
} from "@/lib/utils/resizeCanvas";

interface ResizeCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<CanvasRef>;
  currentWidth: number;
  currentHeight: number;
  onResize: (newWidth: number, newHeight: number) => void;
}

export function ResizeCanvasModal({
  isOpen,
  onClose,
  canvasRef,
  currentWidth,
  currentHeight,
  onResize,
}: ResizeCanvasModalProps) {
  const { undoStack } = useHistoryStore();
  const [widthInput, setWidthInput] = useState(currentWidth.toString());
  const [heightInput, setHeightInput] = useState(currentHeight.toString());
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);
  const [padDirection, setPadDirection] = useState<PadDirection>({
    width: "center",
    height: "center",
  });
  const [thumbnailCache, setThumbnailCache] = useState<string>("");

  const generatePreview = useCallback(() => {
    // Get current state from history
    const currentState = undoStack[undoStack.length - 1];
    if (!currentState) return;

    const thumbnail = generateResizePreview(
      currentState.layers,
      currentWidth,
      currentHeight,
      width,
      height,
      padDirection,
    );

    setThumbnailCache(thumbnail);
  }, [width, height, padDirection, currentWidth, currentHeight, undoStack]);

  // Validation function
  const validateNumber = (value: string): number | null => {
    const numberRegex = /^\d+$/;
    if (!numberRegex.test(value)) return null;
    const num = parseInt(value);
    if (num <= 0) return null;
    return Math.min(num, 512); // Limit to max 512
  };

  // Update input handlers
  useEffect(() => {
    if (isOpen) {
      setWidthInput(Math.min(currentWidth, 512).toString());
      setHeightInput(Math.min(currentHeight, 512).toString());
      setWidth(Math.min(currentWidth, 512));
      setHeight(Math.min(currentHeight, 512));
      setPadDirection({ width: "center", height: "center" });
      setTimeout(generatePreview, 0);
    }
  }, [isOpen]);

  // Update preview when values change
  useEffect(() => {
    generatePreview();
  }, [width, height, padDirection]);

  const willLosePixels = width < currentWidth || height < currentHeight;

  const handleResize = () => {
    if (!canvasRef.current) return;

    // Ensure dimensions are between 1 and 512
    const newWidth = Math.max(1, Math.min(512, width));
    const newHeight = Math.max(1, Math.min(512, height));

    canvasRef.current.resizeCanvas(newWidth, newHeight, padDirection);
    onResize(newWidth, newHeight);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Resize Canvas</DialogTitle>
          <DialogDescription>
            Enter new dimensions (max 512x512) and choose padding direction.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="grid gap-4 py-4">
                <div className="h-[120px]">
                  {willLosePixels ? (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Warning: Reducing canvas size will crop pixels outside
                        the new dimensions.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="default">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Choose the padding direction to decide where your
                        content will go. Maximum size is 512 x 512.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="width">Width</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newValue = Math.max(
                            1,
                            parseInt(widthInput) - 1,
                          );
                          setWidthInput(newValue.toString());
                          setWidth(newValue);
                        }}
                        className="h-10 w-14"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="width"
                        value={widthInput}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setWidthInput(newValue);
                          const validNumber = validateNumber(newValue);
                          if (validNumber !== null) {
                            setWidth(validNumber);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newValue = Math.min(
                            256,
                            parseInt(widthInput) + 1,
                          );
                          setWidthInput(newValue.toString());
                          setWidth(newValue);
                        }}
                        className="h-10 w-14"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="height">Height</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newValue = Math.max(
                            1,
                            parseInt(heightInput) - 1,
                          );
                          setHeightInput(newValue.toString());
                          setHeight(newValue);
                        }}
                        className="h-10 w-14"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="height"
                        value={heightInput}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setHeightInput(newValue);
                          const validNumber = validateNumber(newValue);
                          if (validNumber !== null) {
                            setHeight(validNumber);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newValue = Math.min(
                            256,
                            parseInt(heightInput) + 1,
                          );
                          setHeightInput(newValue.toString());
                          setHeight(newValue);
                        }}
                        className="h-10 w-14"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="widthPadDirection">Width Padding</Label>
                    <Select
                      value={padDirection.width}
                      onValueChange={(value: WidthPadDirection) =>
                        setPadDirection((prev) => ({ ...prev, width: value }))
                      }
                    >
                      <SelectTrigger id="widthPadDirection">
                        <SelectValue placeholder="Select width padding" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="heightPadDirection">Height Padding</Label>
                    <Select
                      value={padDirection.height}
                      onValueChange={(value: HeightPadDirection) =>
                        setPadDirection((prev) => ({ ...prev, height: value }))
                      }
                    >
                      <SelectTrigger id="heightPadDirection">
                        <SelectValue placeholder="Select height padding" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Preview</Label>
              <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-lg border border-border bg-background p-4">
                {/* Display preview image */}
                <div className="relative h-[300px] w-[300px] overflow-hidden rounded border border-gray-700">
                  {thumbnailCache && (
                    <img
                      src={thumbnailCache}
                      alt="Preview"
                      className="h-full w-full object-contain"
                      style={{
                        imageRendering: "pixelated",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleResize}>Resize</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
