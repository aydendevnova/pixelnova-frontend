"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ImageIcon, Info, Upload } from "lucide-react";
import { extractColors } from "@/lib/utils/color";
import { convertToBasicColors } from "@/lib/utils/drawing";
import { useToast } from "../ui/use-toast";

interface UploadImageModalProps {
  open: boolean;
  onClose: () => void;
  onImportImage: (imageData: ImageData) => void;
  onGeneratePalette: (colors: string[]) => void;
}

export default function UploadImageModal({
  open,
  onClose,
  onImportImage,
  onGeneratePalette,
}: UploadImageModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create a canvas to get the image data
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const initialColors = extractColors(imageData);

          // Check if the image has too many colors (indicating it might not be pixel art)
          if (initialColors.length > 256) {
            // Convert to basic colors
            const convertedImageData = convertToBasicColors(imageData);

            // Show warning toast
            toast({
              title: "Too many colors",
              description:
                "Image converted to basic colors for better performance.",
              duration: 5000,
            });

            // Import the converted image
            onImportImage(convertedImageData);

            // Extract colors from the converted image and generate palette
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = convertedImageData.width;
            tempCanvas.height = convertedImageData.height;
            const tempCtx = tempCanvas.getContext("2d");
            if (tempCtx) {
              tempCtx.putImageData(convertedImageData, 0, 0);
              const convertedColors = extractColors(convertedImageData);
              onGeneratePalette(convertedColors);
            }
          } else {
            onImportImage(imageData);
            onGeneratePalette(initialColors);
          }

          onClose();
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [onImportImage, onGeneratePalette, onClose, toast],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload an image to start editing
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="mr-2 h-4 w-4" />
          <AlertDescription>
            If <b>you are not uploading pixel art</b> or you are{" "}
            <b>uploading a large image</b>, use the "Generate Pixel Art" button
            to convert it automatically.
          </AlertDescription>
        </Alert>

        <div
          className={cn(
            "mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 px-6 py-10 dark:border-gray-800",
            isDragging && "border-primary bg-accent/50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center text-center">
            <ImageIcon className="h-10 w-10 text-gray-400" />
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag and drop your image here, or
              </p>
            </div>
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="upload-file-input"
                onChange={handleFileInput}
              />
              <label htmlFor="upload-file-input">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <div>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </div>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
