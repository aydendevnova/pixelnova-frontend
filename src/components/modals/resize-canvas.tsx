import { useState } from "react";
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
import { CanvasRef } from "../editor/Canvas";

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
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);
  const [padDirection, setPadDirection] = useState<
    "center" | "up" | "down" | "left" | "right"
  >("center");

  const handleResize = () => {
    if (!canvasRef.current) return;

    // Ensure dimensions are at least 1x1
    const newWidth = Math.max(1, width);
    const newHeight = Math.max(1, height);

    canvasRef.current.resizeCanvas(newWidth, newHeight, padDirection);
    onResize(newWidth, newHeight);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resize Canvas</DialogTitle>
          <DialogDescription>
            Enter new dimensions and choose padding direction.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                min="1"
                value={width}
                onChange={(e) =>
                  setWidth(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                min="1"
                value={height}
                onChange={(e) =>
                  setHeight(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="padDirection">Padding Direction</Label>
            <Select
              value={padDirection}
              onValueChange={(
                value: "center" | "up" | "down" | "left" | "right",
              ) => setPadDirection(value)}
            >
              <SelectTrigger id="padDirection">
                <SelectValue placeholder="Select padding direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="up">Content Down</SelectItem>
                <SelectItem value="down">Content Up</SelectItem>
                <SelectItem value="left">Content Right</SelectItem>
                <SelectItem value="right">Content Left</SelectItem>
              </SelectContent>
            </Select>
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
