# Editor Component Documentation

The `Editor` component is the main component for the Pixel Art Editor application. It integrates various sub-components to provide a comprehensive pixel art editing experience.

## Components

### TopMenuBar

The `TopMenuBar` component provides options for clearing the canvas, importing images, generating color palettes, and adjusting tool settings.

#### Props

- `onClearCanvas`: Callback to clear the canvas.
- `onImportImage`: Callback to import an image onto the canvas.
- `onGeneratePalette`: Callback to generate a color palette from the canvas.
- `selectedTool`: The currently selected drawing tool.
- `bucketTolerance`: The tolerance level for the bucket fill tool.
- `onBucketToleranceChange`: Callback to change the bucket tolerance.
- `brushSize`: The size of the brush.
- `onBrushSizeChange`: Callback to change the brush size.
- `showGrid`: A flag indicating whether the grid is visible on the canvas.
- `onToggleGrid`: Callback to toggle the grid visibility.

### Toolbar

The `Toolbar` component provides a set of tools for drawing and editing pixel art. It includes options for selecting tools, undoing and redoing actions, and more.

#### Props

- `selectedTool`: The currently selected drawing tool.
- `onToolSelect`: Callback to handle tool selection.
- `canUndo`: A flag indicating whether undo is possible.
- `canRedo`: A flag indicating whether redo is possible.
- `onUndo`: Callback to handle undo action.
- `onRedo`: Callback to handle redo action.

### Canvas

The `Canvas` component is responsible for rendering the drawing area and handling user interactions such as drawing, panning, and selecting.

#### Props

- `width` and `height`: The dimensions of the canvas.
- `primaryColor` and `secondaryColor`: The colors used for drawing.
- `selectedTool`: The currently selected drawing tool.
- `bucketTolerance`: The tolerance level for the bucket fill tool.
- `brushSize`: The size of the brush.
- `showGrid`: A flag indicating whether the grid is visible on the canvas.
- `onHistoryChange`: Callback to update the undo and redo state.
- `onColorPick`: Callback to handle color picking.
- `onToolSelect`: Callback to handle tool selection.
- `layers`: An array of layers, each containing an `id`, `name`, `visible` flag, and `imageData`.
- `selectedLayerId`: The ID of the currently selected layer.

### ColorPicker

The `ColorPicker` component allows users to select primary and secondary colors for drawing. It also supports adding custom colors to the palette.

#### Props

- `primaryColor`: The primary color used for drawing.
- `secondaryColor`: The secondary color used for drawing.
- `onPrimaryColorSelect`: Callback to handle primary color selection.
- `onSecondaryColorSelect`: Callback to handle secondary color selection.
- `customColors`: An array of custom colors.
- `onAddCustomColor`: Callback to add a custom color to the palette.

### LayersPanel

The `LayersPanel` component manages the different layers of the canvas, allowing users to add, remove, and reorder layers.

#### Layer System

The layer system in the `Editor` component allows for complex image compositions by stacking multiple layers on top of each other. Each layer can be independently edited, moved, and toggled for visibility. The layers are rendered from bottom to top, with the topmost layer being the most visible. This system supports operations such as:

- **Adding Layers**: Users can add new layers to create separate elements of their artwork.
- **Removing Layers**: Unwanted layers can be removed without affecting other layers.
- **Reordering Layers**: Layers can be reordered to change the stacking order, affecting which elements appear on top.
- **Visibility Toggle**: Each layer can be toggled on or off, allowing users to focus on specific parts of their artwork.
- **Opacity Control**: Layers can have different opacity levels, enabling blending effects.

#### Technical Implementation

In the code, each layer is represented by an object containing an `id`, `name`, `visible` flag, and `imageData`. The `Canvas` component uses these layers to render the drawing area. The `render` function iterates over the layers, drawing each visible layer onto the canvas. The `drawPixel` and `floodFill` functions are updated to modify only the selected layer's `imageData`. The `saveToHistory` function captures the state of all layers, allowing for undo and redo operations. The `undo` and `redo` functions restore the layers' states from the history.

## State Management

The `Editor` component manages various states to handle the functionality of the editor:

- `selectedTool`: The currently selected drawing tool.
- `primaryColor`: The primary color used for drawing.
- `secondaryColor`: The secondary color used for drawing.
- `canvasSize`: The dimensions of the canvas.
- `customColors`: An array of custom colors.
- `canUndo`: A flag indicating whether undo is possible.
- `canRedo`: A flag indicating whether redo is possible.
- `bucketTolerance`: The tolerance level for the bucket fill tool.
- `brushSize`: The size of the brush.
- `showGrid`: A flag indicating whether the grid is visible on the canvas.

## Methods

### handleHistoryChange

Updates the undo and redo state.

### handleUndo

Triggers the undo action.

### handleRedo

Triggers the redo action.

### handleClearCanvas

Clears the canvas and resets its size.

### handleImageImport

Imports an image onto the canvas.

### handleGeneratePalette

Generates a color palette from the canvas.

### handleAddCustomColor

Adds a custom color to the palette.

## Usage

To use the Pixel Art Editor, simply import the `Editor` component and include it in your application. The editor will handle all interactions and state management internally.
