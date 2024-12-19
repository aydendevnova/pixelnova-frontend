"use client";

import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  imageData: ImageData | null;
}

interface LayersPanelProps {
  layers: Layer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  onLayerVisibilityToggle: (layerId: string) => void;
  onAddLayer: () => void;
  onDeleteLayer: (layerId: string) => void;
  onLayerReorder: (fromIndex: number, toIndex: number) => void;
}

export default function LayersPanel({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerVisibilityToggle,
  onAddLayer,
  onDeleteLayer,
  onLayerReorder,
}: LayersPanelProps) {
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleLayerNameEdit = (layer: Layer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
  };

  const handleLayerNameSave = () => {
    setEditingLayerId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">Layers</h3>
        <button
          onClick={onAddLayer}
          className="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
        >
          Add Layer
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`flex items-center gap-2 rounded p-2 ${
              selectedLayerId === layer.id
                ? "bg-blue-500/20"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => onLayerSelect(layer.id)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLayerVisibilityToggle(layer.id);
              }}
              className="text-gray-300 hover:text-white"
            >
              {layer.visible ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </button>

            {editingLayerId === layer.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleLayerNameSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLayerNameSave();
                  }
                }}
                className="flex-1 rounded bg-gray-700 px-2 py-1 text-sm text-white"
                autoFocus
              />
            ) : (
              <span
                className="flex-1 cursor-pointer text-sm text-white"
                onDoubleClick={() => handleLayerNameEdit(layer)}
              >
                {layer.name}
              </span>
            )}

            <div className="flex items-center gap-1">
              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (index > 0) {
                    onLayerReorder(index, index - 1);
                  }
                }}
                className="text-gray-300 hover:text-white disabled:text-gray-600"
                disabled={index === 0}
              >
                <ChevronUpIcon className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (index < layers.length - 1) {
                    onLayerReorder(index, index + 1);
                  }
                }}
                className="text-gray-300 hover:text-white disabled:text-gray-600"
                disabled={index === layers.length - 1}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </button> */}
              {layer.id !== "layer_0" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                  className="text-gray-300 hover:text-red-500"
                  disabled={layers.length <= 1}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              ) : (
                <div className="h-4 w-4" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
