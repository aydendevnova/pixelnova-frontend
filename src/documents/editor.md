# Pixel Art Editor Technical Documentation

## Overview

Welcome to our pixel art editor! This documentation aims to help developers understand the system architecture and key components of our pixel art editor implementation.

## Core Architecture

The editor is built using:

- **React 18+ with TypeScript**
- **HTML5 Canvas** for rendering
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Shadcn UI** for component library

### State Management

We use **Zustand** stores split by concern:

```typescript
// Example store structure
interface EditorStore {
  // Canvas State
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  showGrid: boolean;

  // Active Tool State
  currentTool: ToolType;
  primaryColor: string;
  secondaryColor: string;
  brushSize: number;

  // Layer State
  layers: Layer[];
  activeLayerIndex: number;
}
```

### Canvas System

The editor implements a layered canvas approach:

1. **Main Canvas (`<PixelCanvas />`):**

   - Handles the primary drawing surface
   - Manages viewport transformations
   - Implements pixel-perfect rendering

2. **Preview Layer:**

   - Shows tool previews and temporary effects
   - Updates on mouse movement
   - Clears between operations

3. **Grid Layer:**
   - Optional overlay for pixel grid
   - Toggleable visibility
   - Scales with zoom level

### Key Features

#### Viewport Management

```typescript
// Core viewport transformation
function transformCoordinates(x: number, y: number) {
  return {
    x: Math.floor((x - pan.x) / zoom),
    y: Math.floor((y - pan.y) / zoom),
  };
}
```

#### Layer System

- Layers are stored as ImageData objects
- Operations:
  - Add/Remove layers
  - Reorder layers
  - Toggle visibility
  - Adjust opacity

#### Tools

Each tool extends a base Tool class:

```typescript
interface Tool {
  onMouseDown(e: MouseEvent): void;
  onMouseMove(e: MouseEvent): void;
  onMouseUp(e: MouseEvent): void;
  preview(ctx: CanvasRenderingContext2D): void;
}
```

**Available tools:**

- **Pencil:** Single pixel drawing
- **Fill:** Flood fill algorithm
- **Eraser:** Transparency restoration
- **Selection:** Rectangle/Free-form selection

### Performance Considerations

1. **Render Optimization:**

   - Use `requestAnimationFrame` for smooth updates
   - Implement dirty region tracking
   - Cache static elements

2. **Memory Management:**
   - Reuse ImageData objects when possible
   - Clean up unused canvas contexts
   - Implement proper disposal of large resources

### Common Debugging Tips

1. Check canvas transformation matrix if drawing offset occurs
2. Verify layer composite operations for unexpected transparency
3. Monitor performance with React DevTools profiler

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access editor at `http://localhost:3000/editor`

### Key Files

```
src/
  components/
    Editor/
      PixelCanvas.tsx  # Main canvas component
      ToolBar.tsx      # Tool selection interface
      LayerPanel.tsx   # Layer management
  stores/
    editorStore.ts     # Main editor state
    historyStore.ts    # Undo/redo functionality
  tools/
    BaseTool.ts        # Tool interface
    PencilTool.ts      # Pencil implementation
    // ... other tools
```

## Contributing

1. Create a feature branch
2. Implement changes
3. Add tests
4. Submit PR with detailed description
