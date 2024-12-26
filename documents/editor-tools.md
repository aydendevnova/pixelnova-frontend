# Pixel Art Editor System Architecture Overview

## Tools Architecture

The editor implements a modular tool system based around a common `Tool` interface, located in the `types/editor.ts` file. Each tool is self-contained and follows a consistent pattern:

### Core Tool Interface

Each tool implements the `Tool` interface with standard properties:

- **id**: Unique identifier
- **name**: Display name
- **icon**: Visual representation
- **shortcut**: Keyboard shortcut
- **cursor**: Custom cursor style
- **Mouse event handlers**: (`onMouseDown`, `onMouseMove`, `onMouseUp`)

### Tool Context

Tools receive a standardized `ToolContext` object containing:

- **Canvas references**
- **Viewport state**
- **Color information**
- **Brush settings**
- **Layer information**
- **Selection state**
- **Callback functions**

### Individual Tools

The system includes several specialized tools:

- **Pencil**: Freehand drawing with interpolation
- **Eraser**: Transparency manipulation
- **Bucket**: Flood fill with tolerance
- **Eyedropper**: Color sampling across layers
- **Selection**: Region selection and manipulation

## Coordinate System Improvements

The new coordinate system (`utils/coordinates.ts`) provides three main functions:

### `getCanvasCoordinates`

- Converts mouse events to canvas coordinates
- Accounts for viewport translation and scaling
- Handles pixel-perfect alignment

### `screenToCanvasCoordinates`

- Converts absolute screen positions to canvas space
- Used for external coordinate mapping

### `canvasToScreenCoordinates`

- Converts canvas coordinates back to screen space
- Essential for UI overlay positioning
