"use client";

import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ChevronUpIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleLayerNameEdit = (layer: Layer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
  };

  const handleLayerNameSave = () => {
    setEditingLayerId(null);
  };

  const LayersList = () => (
    <div className="overflow-y-auto">
      <div className="h-full max-h-[300px] pr-4 text-white">
        <div className="flex flex-col gap-2">
          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg border p-2 transition-colors",
                selectedLayerId === layer.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-800 bg-gray-900/50 hover:border-gray-700",
              )}
              onClick={() => onLayerSelect(layer.id)}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-white hover:bg-gray-700 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerVisibilityToggle(layer.id);
                }}
              >
                {layer.visible ? (
                  <EyeIcon className="h-4 w-4" />
                ) : (
                  <EyeSlashIcon className="h-4 w-4" />
                )}
              </Button>

              {editingLayerId === layer.id ? (
                <Input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={handleLayerNameSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLayerNameSave();
                    }
                  }}
                  className="flex-1 bg-gray-800 text-white"
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

              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {/* <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  if (index > 0) {
                    onLayerReorder(index, index - 1);
                  }
                }}
                disabled={index === 0}
              >
                <ChevronUpIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  if (index < layers.length - 1) {
                    onLayerReorder(index, index + 1);
                  }
                }}
                disabled={index === layers.length - 1}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </Button> */}
                {layers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-white hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(layer.id);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const content = (
    <Card className="border-gray-800 bg-gray-900/90 text-white backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-gray-800 hover:text-white"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronUpIcon
              className={cn(
                "h-5 w-5 transition-transform",
                !isCollapsed && "rotate-180",
              )}
            />
          </Button>
          <CardTitle className="text-base font-medium text-white">
            Layers
          </CardTitle>
        </div>
        <Button
          onClick={onAddLayer}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-gray-700 hover:text-white"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          <LayersList />
        </CardContent>
      )}
    </Card>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full border-gray-800 bg-gray-900/90 text-white backdrop-blur"
          >
            <PlusIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[400px] bg-gray-900/90 text-white backdrop-blur"
        >
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return <div className="fixed bottom-4 right-4 z-50 w-[300px]">{content}</div>;
}
