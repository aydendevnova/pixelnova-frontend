"use client";

import { PencilIcon } from "@heroicons/react/24/outline";
import {
  EraserIcon,
  PaintBucketIcon,
  TextSelect,
  Undo2,
  Redo2,
  Pipette,
} from "lucide-react";

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
}

const tools: Tool[] = [
  { id: "pencil", name: "Pencil", icon: PencilIcon, shortcut: "B" },
  { id: "eraser", name: "Eraser", icon: EraserIcon, shortcut: "E" },
  { id: "bucket", name: "Fill", icon: PaintBucketIcon, shortcut: "G" },
  { id: "select", name: "Select", icon: TextSelect, shortcut: "M" },
  { id: "eyedropper", name: "Color Picker", icon: Pipette, shortcut: "I" },
];

export default function Toolbar({
  selectedTool,
  onToolSelect,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-2 p-2">
      {/* History controls */}
      <div className="mb-2 flex flex-col gap-2">
        <button
          className={`rounded-lg p-2 transition-colors ${
            canUndo ? "text-gray-400 hover:bg-gray-700" : "text-gray-600"
          }`}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="mx-auto h-6 w-6" />
        </button>
        <button
          className={`rounded-lg p-2 transition-colors ${
            canRedo ? "text-gray-400 hover:bg-gray-700" : "text-gray-600"
          }`}
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="mx-auto h-6 w-6" />
        </button>
      </div>

      {/* Drawing tools */}
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            className={`rounded-lg p-2 transition-colors ${
              selectedTool === tool.id
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => onToolSelect(tool.id)}
            title={tool.name}
          >
            <Icon className="mx-auto h-6 w-6" />
          </button>
        );
      })}
    </div>
  );
}
