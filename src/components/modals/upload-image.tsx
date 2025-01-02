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
import JSZip from "jszip";

interface UploadImageModalProps {
  open: boolean;
  onClose: () => void;
  onImportImage: (imageData: ImageData) => void;
  onImportLayers: (layers: { name: string; imageData: ImageData }[]) => void;
  onGeneratePalette: (colors: string[]) => void;
}

export default function UploadImageModal({
  open,
  onClose,
  onImportImage,
  onImportLayers,
  onGeneratePalette,
}: UploadImageModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const processImageFile = useCallback(
    async (file: File) => {
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

  const processZipFile = useCallback(
    async (file: File) => {
      try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        const imageFiles: { name: string; data: Blob }[] = [];

        // Extract all image files from the zip
        for (const [filename, file] of Object.entries(contents.files)) {
          if (filename.startsWith("layer_") && !file.dir) {
            const blob = await file.async("blob");
            if (
              blob.type.startsWith("image/") ||
              filename.match(/\.(png|jpe?g|gif|webp)$/i)
            ) {
              imageFiles.push({ name: filename, data: blob });
            }
          }
        }

        if (imageFiles.length === 0) {
          toast({
            title: "No valid layers found",
            description:
              "The zip file must contain images named layer_1, layer_2, etc.",
            variant: "destructive",
          });
          return;
        }

        // Sort files by layer number
        imageFiles.sort((a, b) => {
          // \d+ matches one or more digits in the filename
          // match() returns array of matches, ?.[0] safely gets first match
          // || "0" provides default if no match found
          const aNum = parseInt(a.name.match(/\d+/)?.[0] ?? "0");
          const bNum = parseInt(b.name.match(/\d+/)?.[0] ?? "0");
          return aNum - bNum;
        });

        // Process each image file
        const layers = await Promise.all(
          imageFiles.map(async ({ name, data }) => {
            return new Promise<{ name: string; imageData: ImageData }>(
              (resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) {
                      reject(new Error("Could not get canvas context"));
                      return;
                    }

                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(
                      0,
                      0,
                      img.width,
                      img.height,
                    );
                    resolve({ name, imageData });
                  };
                  img.onerror = () =>
                    reject(new Error(`Failed to load image: ${name}`));
                  img.src = event.target?.result as string;
                };
                reader.onerror = () =>
                  reject(new Error(`Failed to read file: ${name}`));
                reader.readAsDataURL(data);
              },
            );
          }),
        );

        // Extract colors from all layers for the palette
        const allColors = new Set<string>();
        layers.forEach(({ imageData }) => {
          const colors = extractColors(imageData);
          colors.forEach((color) => allColors.add(color));
        });

        onImportLayers(layers);
        onGeneratePalette(Array.from(allColors));
        onClose();
      } catch (error) {
        console.error("Error processing zip file:", error);
        toast({
          title: "Error processing zip file",
          description: "Failed to process the zip file. Please try again.",
          variant: "destructive",
        });
      }
    },
    [onImportLayers, onGeneratePalette, onClose, toast],
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type === "application/zip" || file.name.endsWith(".zip")) {
        await processZipFile(file);
      } else if (file.type.startsWith("image/")) {
        await processImageFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description:
            "Please upload an image file or a zip file containing layers.",
          variant: "destructive",
        });
      }
    },
    [processImageFile, processZipFile, toast],
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
        handleFile(file)
          .then(() => {
            console.log("File processed successfully");
          })
          .catch((error) => {
            toast({
              title: "Error",
              description: "Failed to process the file. Please try again.",
              variant: "destructive",
            });
            console.error("Error processing file:", error);
          });
      }
    },
    [handleFile, onClose],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file)
          .then(() => {
            console.log("File processed successfully");
          })
          .catch((error) => {
            toast({
              title: "Error",
              description: "Failed to process the file. Please try again.",
              variant: "destructive",
            });
            console.error("Error processing file:", error);
          });
      }
    },
    [handleFile],
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Image or Layers</DialogTitle>
          <DialogDescription>
            Upload a single image or a zip file containing layers (named
            layer_1, layer_2, etc.)
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="mr-2 h-4 w-4" />
          <AlertDescription>
            For <b>single images</b>: If you are not uploading pixel art or
            uploading a large image, use the "Generate Pixel Art" button to
            convert it automatically.
            <br />
            For <b>multiple layers</b>: Import a zip file with images named
            layer_1.png, layer_2.png, etc.
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
                Drag and drop your image or zip file here, or
              </p>
            </div>
            <div className="mt-4">
              <input
                type="file"
                accept="image/*,.zip"
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
