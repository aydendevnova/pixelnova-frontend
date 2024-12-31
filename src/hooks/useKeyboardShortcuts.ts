import { useEffect } from "react";
import { ToolType } from "@/types/editor";

interface UseKeyboardShortcutsProps {
  onToolSelect: (tool: ToolType) => void;
  onSpacePressed: (pressed: boolean) => void;
  onEscapePressed: () => void;
  onDeletePressed: () => void;
}

export function useKeyboardShortcuts({
  onToolSelect,
  onSpacePressed,
  onEscapePressed,
  onDeletePressed,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tool shortcuts (Aseprite-like)
      switch (e.key.toLowerCase()) {
        case "b": // Brush
          onToolSelect("pencil");
          break;
        case "i": // Eye dropper
          onToolSelect("eyedropper");
          break;
        case "g": // Paint bucket
          onToolSelect("bucket");
          break;
        case "m": // Selection
          onToolSelect("select");
          break;
        case "e": // Eraser
          onToolSelect("eraser");
          break;
      }

      if (e.code === "Space" && !e.repeat) {
        onSpacePressed(true);
      } else if (e.code === "Escape") {
        onEscapePressed();
      } else if (e.code === "Delete" || e.code === "Backspace") {
        onDeletePressed();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        onSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onToolSelect, onSpacePressed, onEscapePressed, onDeletePressed]);
}
