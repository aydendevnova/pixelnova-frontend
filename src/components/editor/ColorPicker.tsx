"use client";

import { PlusIcon } from "@heroicons/react/24/outline";

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

// Helper component for color button with transparency support
const ColorButton = ({
  color,
  isSelected,
  onClick,
  title,
  isPrimary,
}: {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  title: string;
  isPrimary: boolean;
}) => {
  const isTransparent = color === "transparent";

  return (
    <button
      className={`relative h-8 w-8 rounded border-2 ${
        isSelected
          ? isPrimary
            ? "border-blue-500"
            : "border-green-500"
          : "border-gray-600"
      } ${isTransparent ? "bg-checkerboard" : ""}`}
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white">Current Colors</label>
        <div className="flex items-center gap-4">
          {/* Primary Color */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Primary (Left Click)</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div
                  className={`h-8 w-8 rounded border border-gray-600 ${
                    primaryColor === "transparent" ? "bg-checkerboard" : ""
                  }`}
                  style={{
                    backgroundColor:
                      primaryColor === "transparent" ? undefined : primaryColor,
                  }}
                />
                {!isColorInPalette(primaryColor) && onAddCustomColor && (
                  <button
                    onClick={() => onAddCustomColor(primaryColor)}
                    className="absolute -right-2 -top-2 rounded-full bg-blue-500 p-1 text-white hover:bg-blue-600"
                    title="Add to palette"
                  >
                    <PlusIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
              <input
                type="color"
                value={
                  primaryColor === "transparent" ? "#FFFFFF" : primaryColor
                }
                onChange={(e) => onPrimaryColorSelect(e.target.value)}
                className="h-8 w-full cursor-pointer rounded bg-gray-700"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">
              Secondary (Right Click)
            </span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div
                  className={`h-8 w-8 rounded border border-gray-600 ${
                    secondaryColor === "transparent" ? "bg-checkerboard" : ""
                  }`}
                  style={{
                    backgroundColor:
                      secondaryColor === "transparent"
                        ? undefined
                        : secondaryColor,
                  }}
                />
                {!isColorInPalette(secondaryColor) && onAddCustomColor && (
                  <button
                    onClick={() => onAddCustomColor(secondaryColor)}
                    className="absolute -right-2 -top-2 rounded-full bg-blue-500 p-1 text-white hover:bg-blue-600"
                    title="Add to palette"
                  >
                    <PlusIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
              <input
                type="color"
                value={
                  secondaryColor === "transparent" ? "#FFFFFF" : secondaryColor
                }
                onChange={(e) => onSecondaryColorSelect(e.target.value)}
                className="h-8 w-full cursor-pointer rounded bg-gray-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-white">Preset Colors</label>
        <div className="grid grid-cols-5 gap-2">
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
                isSelected={primaryColor === color || secondaryColor === color}
                onClick={() => handleColorSelect(color, false)}
                title={`${color}\nLeft click: Set primary\nRight click: Set secondary`}
                isPrimary={primaryColor === color}
              />
              {primaryColor === color && (
                <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-blue-500" />
              )}
              {secondaryColor === color && (
                <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {customColors.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white">Generated Palette</label>
          <div className="grid max-h-40 grid-cols-5 gap-2 overflow-y-auto">
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
                  title={`${color}\nLeft click: Set primary\nRight click: Set secondary`}
                  isPrimary={primaryColor === color}
                />
                {primaryColor === color && (
                  <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-blue-500" />
                )}
                {secondaryColor === color && (
                  <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
