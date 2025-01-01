"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { getAllTools } from "@/lib/tools";
import { ToolType } from "@/types/editor";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
}

export default function Toolbar({ selectedTool, onToolSelect }: ToolbarProps) {
  const tools = getAllTools();
  const [showTools, setShowTools] = useState(true);

  return (
    <div className="absolute bottom-0 left-0 top-4 z-20">
      <TooltipProvider>
        <div className="flex max-h-[calc(100vh-10rem)] flex-col gap-3 rounded-lg bg-gray-900 p-3 shadow-lg backdrop-blur">
          <div className="flex max-h-full flex-col gap-2 overflow-y-auto">
            {/* Toggle button - always visible */}
            <div className="flex-shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-12 w-12 rounded-lg text-gray-900 hover:bg-gray-700",
                    )}
                    onClick={() => setShowTools(!showTools)}
                  >
                    {showTools ? (
                      <ChevronUp
                        className="text-white"
                        style={{ width: "24px", height: "24px" }}
                      />
                    ) : (
                      <ChevronDown
                        className="text-white"
                        style={{ width: "24px", height: "24px" }}
                      />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-white text-gray-900">
                  <p>Toggle Tools</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {showTools && (
              <>
                <Separator className="flex-shrink-0 bg-gray-700" />

                {/* Drawing tools */}
                <div className="flex flex-col gap-2">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              selectedTool === tool.id ? "default" : "ghost"
                            }
                            size="icon"
                            className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-lg",
                              selectedTool === tool.id
                                ? "bg-white text-gray-900 hover:bg-gray-200"
                                : "text-white hover:bg-gray-700/50 hover:text-gray-200",
                            )}
                            onClick={() => onToolSelect(tool.id)}
                          >
                            <Icon
                              style={{ width: "24px", height: "24px" }}
                              className={cn(
                                selectedTool === tool.id
                                  ? "text-gray-900"
                                  : "text-white",
                              )}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-white text-gray-900"
                        >
                          <p>
                            {tool.name} ({tool.shortcut})
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
