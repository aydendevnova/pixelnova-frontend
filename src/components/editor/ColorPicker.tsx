"use client";

import {
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PALETTE_INFO } from "@/lib/utils/colorPalletes";
import { Pin, PinOff } from "lucide-react";
import { useUserAgent } from "@/lib/utils/user-agent";

interface ColorPickerProps {
  primaryColor: string;
  secondaryColor: string;
  onPrimaryColorSelect: (color: string) => void;
  onSecondaryColorSelect: (color: string) => void;
  importedColors?: string[];
  onAddCustomColor?: (color: string) => void;
  onPaletteChange: (palette: keyof typeof PALETTE_INFO) => void;
}

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
  importedColors = [],
  onAddCustomColor,
  onPaletteChange,
}: ColorPickerProps) {
  const { isMobile } = useUserAgent();
  const [open, setOpen] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const [selectedPalette, setSelectedPalette] =
    useState<keyof typeof PALETTE_INFO>("PRESET_PALETTE");
  const [presetsExpanded, setPresetsExpanded] = useState(true);

  const isColorInPalette = (color: string) => {
    return (
      PALETTE_INFO[selectedPalette]?.colors.includes(color) ||
      importedColors.includes(color)
    );
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

  const handlePaletteChange = (newPalette: keyof typeof PALETTE_INFO) => {
    setSelectedPalette(newPalette);
    onPaletteChange(newPalette);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="absolute -top-16 right-4 z-50">
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
            {!isMobile && (
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
            )}
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[240px] border-gray-700 bg-gray-900/90 backdrop-blur sm:w-[240px]">
        <div className="flex flex-col gap-3">
          {/* Keep open toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-white">Colors</Label>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8 p-0 text-gray-400 hover:bg-gray-800 hover:text-white"
              onClick={() => setKeepOpen(!keepOpen)}
            >
              {keepOpen ? (
                <Pin className="h-4 w-4 rotate-45 text-red-500" />
              ) : (
                <PinOff className="h-4 w-4 rotate-45" />
              )}
            </Button>
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
                className="m-0 h-8 w-full cursor-pointer rounded bg-gray-700 p-0"
              />
            </div>
            {!isMobile && (
              <div className="flex-1">
                <Label className="text-xs text-gray-400">Secondary</Label>
                <Input
                  type="color"
                  value={
                    secondaryColor === "transparent"
                      ? "#FFFFFF"
                      : secondaryColor
                  }
                  onChange={(e) => onSecondaryColorSelect(e.target.value)}
                  className="m-0 h-8 w-full cursor-pointer rounded bg-gray-700 p-0"
                />
              </div>
            )}
          </div>

          {/* Imported colors */}
          {importedColors.length > 0 && (
            <div>
              <Label className="text-sm text-white">Custom</Label>
              <div className="overflow-y-auto">
                <div className="h-full max-h-48">
                  <div className="mt-1 grid grid-cols-5 gap-1">
                    {importedColors.map((color) => (
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
                          size="normal"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
              {!isColorInPalette(secondaryColor) && !isMobile && (
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

          {/* Preset colors */}
          <div>
            <div className="my-2 flex items-center justify-between">
              <Label className="text-sm text-white">Presets</Label>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedPalette}
                  onValueChange={(value: keyof typeof PALETTE_INFO) => {
                    handlePaletteChange(value);
                  }}
                >
                  <SelectTrigger className="h-7 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PALETTE_INFO).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => setPresetsExpanded(!presetsExpanded)}
                  className="text-gray-400 hover:text-white"
                >
                  {presetsExpanded ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {presetsExpanded && (
              <div className="mt-1 grid grid-cols-5 gap-1">
                {PALETTE_INFO[selectedPalette]?.colors.map((color) => (
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
                      size="normal"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
