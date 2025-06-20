import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PixelArtPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  gridSize: number;
}

export function PixelArtPreviewModal({
  isOpen,
  onClose,
  imageUrl,
  gridSize,
}: PixelArtPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className=" max-w-[90vw] border-slate-700/50 bg-slate-800/90 p-0 backdrop-blur">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            className="absolute right-2 top-2 z-50 h-8 w-8 rounded-full bg-slate-800/50 p-0 text-slate-400 hover:bg-slate-700/50 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Image container */}
          <div className="flex items-center justify-center p-4">
            <div className="relative h-[80vh] overflow-hidden rounded-lg border border-slate-600/50">
              <img
                src={imageUrl}
                alt={`Pixel Art ${gridSize}x${gridSize}`}
                className="h-full w-full object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>

          {/* Info footer */}
          <div className="border-t border-slate-700/50 bg-slate-800/50 p-4">
            <p className="text-center text-sm text-slate-300">
              Grid Size: {gridSize}x{gridSize}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
