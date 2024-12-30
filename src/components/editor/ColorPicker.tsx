"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

interface ColorPickerProps {
  primaryColor: string;
  secondaryColor: string;
  onPrimaryColorSelect: (color: string) => void;
  onSecondaryColorSelect: (color: string) => void;
  customColors?: string[];
  onAddCustomColor?: (color: string) => void;
}

const presetColors = [
  "transparent",
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
];

const ColorButton = ({
  color,
  isSelected,
  onClick,
  title,
  isPrimary,
  size = "normal",
}: {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  title: string;
  isPrimary: boolean;
  size?: "small" | "normal";
}) => {
  const isTransparent = color === "transparent";

  return (
    <button
      className={cn(
        "relative rounded border-2",
        size === "small" ? "h-6 w-6" : "h-8 w-8",
        isSelected
          ? isPrimary
            ? "border-blue-500"
            : "border-green-500"
          : "border-gray-600",
        isTransparent ? "bg-checkerboard" : "",
      )}
      style={{
        backgroundColor: isTransparent ? undefined : color,
      }}
      onClick={onClick}
      title={title}
    />
  );
};

export default function ColorPicker({
  primaryColor,
  secondaryColor,
  onPrimaryColorSelect,
  onSecondaryColorSelect,
  customColors = [],
  onAddCustomColor,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);

  const isColorInPalette = (color: string) => {
    return presetColors.includes(color) || customColors.includes(color);
  };

  const handleColorSelect = (color: string, isRightClick: boolean) => {
    if (isRightClick) {
      onSecondaryColorSelect(color);
    } else {
      onPrimaryColorSelect(color);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!keepOpen) {
      setOpen(newOpen);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="absolute right-4 top-4 z-50">
          <div className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900/90 p-2 shadow-lg backdrop-blur">
            <div className="relative">
              <div
                className={cn(
                  "h-8 w-8 rounded border border-gray-600",
                  primaryColor === "transparent" ? "bg-checkerboard" : "",
                )}
                style={{
                  backgroundColor:
                    primaryColor === "transparent" ? undefined : primaryColor,
                }}
              />
              <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <div className="relative">
              <div
                className={cn(
                  "h-8 w-8 rounded border border-gray-600",
                  secondaryColor === "transparent" ? "bg-checkerboard" : "",
                )}
                style={{
                  backgroundColor:
                    secondaryColor === "transparent"
                      ? undefined
                      : secondaryColor,
                }}
              />
              <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[280px] border-gray-700 bg-gray-900/90 backdrop-blur sm:w-[320px]">
        <div className="flex flex-col gap-3">
          {/* Keep open toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">Keep Open</Label>
            <Switch
              checked={keepOpen}
              onCheckedChange={setKeepOpen}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          {/* Color inputs */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs text-gray-400">Primary</Label>
              <Input
                type="color"
                value={
                  primaryColor === "transparent" ? "#FFFFFF" : primaryColor
                }
                onChange={(e) => onPrimaryColorSelect(e.target.value)}
                className="h-8 w-full cursor-pointer rounded bg-gray-700"
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-gray-400">Secondary</Label>
              <Input
                type="color"
                value={
                  secondaryColor === "transparent" ? "#FFFFFF" : secondaryColor
                }
                onChange={(e) => onSecondaryColorSelect(e.target.value)}
                className="h-8 w-full cursor-pointer rounded bg-gray-700"
              />
            </div>
          </div>

          {/* Preset colors */}
          <div>
            <Label className="text-sm text-white">Presets</Label>
            <div className="mt-1 grid grid-cols-6 gap-1">
              {presetColors.map((color) => (
                <div
                  key={color}
                  className="relative cursor-pointer"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleColorSelect(color, true);
                  }}
                  onClick={() => handleColorSelect(color, false)}
                >
                  <ColorButton
                    color={color}
                    isSelected={
                      primaryColor === color || secondaryColor === color
                    }
                    onClick={() => handleColorSelect(color, false)}
                    title={`${color}`}
                    isPrimary={primaryColor === color}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Custom colors */}
          {customColors.length > 0 && (
            <div>
              <Label className="text-sm text-white">Custom</Label>
              <ScrollArea className="h-24">
                <div className="mt-1 grid grid-cols-6 gap-1">
                  {customColors.map((color) => (
                    <div
                      key={color}
                      className="relative cursor-pointer"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleColorSelect(color, true);
                      }}
                      onClick={() => handleColorSelect(color, false)}
                    >
                      <ColorButton
                        color={color}
                        isSelected={
                          primaryColor === color || secondaryColor === color
                        }
                        onClick={() => handleColorSelect(color, false)}
                        title={color}
                        isPrimary={primaryColor === color}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Add to palette buttons */}
          {onAddCustomColor && (
            <div className="flex gap-2">
              {!isColorInPalette(primaryColor) && (
                <Button
                  onClick={() => onAddCustomColor(primaryColor)}
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600"
                  size="sm"
                >
                  <PlusIcon className="mr-1 h-3 w-3" />
                  Add Primary
                </Button>
              )}
              {!isColorInPalette(secondaryColor) && (
                <Button
                  onClick={() => onAddCustomColor(secondaryColor)}
                  variant="default"
                  className="bg-green-500 hover:bg-green-600"
                  size="sm"
                >
                  <PlusIcon className="mr-1 h-3 w-3" />
                  Add Secondary
                </Button>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
