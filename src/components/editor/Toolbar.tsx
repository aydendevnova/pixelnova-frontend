"use client";

import { Undo2, Redo2 } from "lucide-react";
import { getAllTools } from "@/lib/tools";
import { ToolType } from "@/types/editor";

interface ToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export default function Toolbar({
  selectedTool,
  onToolSelect,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: ToolbarProps) {
  const tools = getAllTools();

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
            title={`${tool.name} (${tool.shortcut})`}
          >
            <Icon className="mx-auto h-6 w-6" />
          </button>
        );
      })}
    </div>
  );
}
