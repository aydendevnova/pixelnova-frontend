# Web-based Pixel Art Editor

A professional-grade pixel art creation environment with a focus on performance and usability.

## Features

### Drawing Tools

- Pencil tool for freehand drawing
- Eraser tool for removing pixels
- Color picker tool to sample colors from the canvas
- Selection tool to select, move and manipulate regions

### Canvas Interactions

- Left click to draw with primary color
- Right click to draw with secondary color
- Middle mouse button (or spacebar + left click) for canvas panning
- Zoom in/out functionality
- Multiple layers support

### Selection Features

- Click and drag to create selections
- Move selected regions by dragging
- Selections preserve transparency
- Original selection area is cleared when moving content

### History Management

- Undo/redo functionality through history tracking
- Changes are saved after each drawing operation

## Technical Details

- Built with React using TypeScript
- Uses HTML5 Canvas for rendering
- Optimized canvas operations with willReadFrequently context flag
- Efficient coordinate tracking and bounds calculation
- Separate canvases for drawing and selection preview
- State management for tools, colors, and selection data
