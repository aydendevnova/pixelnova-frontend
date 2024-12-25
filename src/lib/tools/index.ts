import { Tool, ToolType } from "@/types/editor";
import { PencilTool } from "@/lib/tools/pencil";
import { EraserTool } from "@/lib/tools/eraser";
import { BucketTool } from "@/lib/tools/bucket";
import { SelectTool } from "@/lib/tools/select";
import { EyedropperTool } from "@/lib/tools/eyedropper";

const tools: Record<ToolType, Tool> = {
  pencil: PencilTool,
  eraser: EraserTool,
  bucket: BucketTool,
  select: SelectTool,
  eyedropper: EyedropperTool,
};

export const getToolById = (id: ToolType): Tool => {
  return tools[id];
};

export const getAllTools = (): Tool[] => {
  return Object.values(tools);
};
