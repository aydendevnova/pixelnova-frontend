import { Command } from "@/types/editor";

class CommandManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command) {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // Clear redo stack when new command is executed
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.undoStack.push(command);
    }
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}

// Create and export a singleton instance
export const commandManager = new CommandManager();

// Command implementations
export class DrawCommand implements Command {
  constructor(
    private layerId: string,
    private oldImageData: ImageData | null,
    private newImageData: ImageData,
  ) {}

  execute() {
    // Update layer with new image data
    const layer = document.querySelector(`[data-layer-id="${this.layerId}"]`);
    if (layer) {
      const canvas = layer as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.putImageData(this.newImageData, 0, 0);
      }
    }
  }

  undo() {
    // Restore old image data
    const layer = document.querySelector(`[data-layer-id="${this.layerId}"]`);
    if (layer && this.oldImageData) {
      const canvas = layer as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.putImageData(this.oldImageData, 0, 0);
      }
    }
  }
}

export class AddLayerCommand implements Command {
  constructor(
    private layerId: string,
    private layerName: string,
    private index: number,
  ) {}

  execute() {
    // Add new layer logic
  }

  undo() {
    // Remove layer logic
  }
}

export class DeleteLayerCommand implements Command {
  constructor(
    private layerId: string,
    private layerData: {
      name: string;
      imageData: ImageData | null;
      visible: boolean;
      index: number;
    },
  ) {}

  execute() {
    // Delete layer logic
  }

  undo() {
    // Restore layer logic
  }
}

export class MoveLayerCommand implements Command {
  constructor(
    private layerId: string,
    private oldIndex: number,
    private newIndex: number,
  ) {}

  execute() {
    // Move layer to new position logic
  }

  undo() {
    // Move layer back to old position logic
  }
}
