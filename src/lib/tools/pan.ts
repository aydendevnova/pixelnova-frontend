import { ToolContext } from "@/types/editor";
import { HandIcon } from "lucide-react";
import { BaseTool } from "@/lib/utils/baseTool";

class PanToolImpl extends BaseTool {
  id = "pan" as const;
  name = "Pan";
  icon = HandIcon;
  shortcut = "h";
  cursor = "grab";

  onMouseDown(e: React.MouseEvent): void {
    const target = e.target as HTMLElement;
    target.style.cursor = "grabbing";

    // Simulate the isPanning state that Canvas uses
    const event = new CustomEvent("startPanning");
    target.dispatchEvent(event);
  }

  onMouseMove(e: React.MouseEvent): void {
    if (e.buttons === 1) {
      // Left mouse button
      // Simulate the pan event that Canvas's handlePan uses
      const event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        view: window,
        movementX: e.movementX,
        movementY: e.movementY,
        screenX: e.screenX,
        screenY: e.screenY,
        clientX: e.clientX,
        clientY: e.clientY,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
        button: e.button,
        buttons: e.buttons,
      });
      e.target.dispatchEvent(event);
    }
  }

  onMouseUp(e: React.MouseEvent): void {
    const target = e.target as HTMLElement;
    target.style.cursor = "grab";

    // End the panning state
    const event = new CustomEvent("endPanning");
    target.dispatchEvent(event);
  }
}

export const PanTool = new PanToolImpl();
