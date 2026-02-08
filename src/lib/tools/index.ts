import { Tool, ToolType } from "@/types/editor";
import { PencilTool } from "@/lib/tools/pencil";
import { EraserTool } from "@/lib/tools/eraser";
import { BucketTool } from "@/lib/tools/bucket";
import { SelectTool } from "@/lib/tools/select";
import { EyedropperTool } from "@/lib/tools/eyedropper";
import { PanTool } from "@/lib/tools/pan";
import { LineTool } from "@/lib/tools/line";
import { SquareTool } from "@/lib/tools/square";
import { CircleTool } from "./circle";

const tools: Record<ToolType, Tool> = {
  pencil: PencilTool,
  line: LineTool,
  square: SquareTool,
  circle: CircleTool,
  eraser: EraserTool,
  bucket: BucketTool,
  select: SelectTool,
  eyedropper: EyedropperTool,
  pan: PanTool,
};

export const getToolById = (id: ToolType): Tool => {
  return tools[id];
};

export const getAllTools = (): Tool[] => {
  return Object.values(tools);
};
