# Pixel Art Editor Technical Documentation

## Overview

The Pixel Art Editor is a web-based application designed for creating and editing pixel art. It is built using React and TypeScript, leveraging modern web technologies to provide a seamless and interactive user experience.

## Components

### Editor

The `Editor` component is the main container for the pixel art editor. It manages the state and interactions between various sub-components such as the canvas, toolbar, color picker, and layers panel.

#### State Management

- `selectedTool`: The currently selected drawing tool (e.g., pencil, eraser).
- `primaryColor`: The primary color used for drawing.
- `secondaryColor`: The secondary color used for drawing.
- `canvasSize`: The dimensions of the canvas.
- `importedColors`: A list of colors imported from the image or added by user
- `canUndo` and `canRedo`: Flags indicating whether undo and redo actions are available.
- `bucketTolerance`: The tolerance level for the bucket fill tool.
- `brushSize`: The size of the brush.
- `showGrid`: A flag indicating whether the grid is visible on the canvas.

#### Methods

- `handleUndo`: Triggers the undo action.
- `handleRedo`: Triggers the redo action.
- `handleClearCanvas`: Clears the canvas and resets its size.
- `handleImageImport`: Imports an image onto the canvas.
- `handleGeneratePalette`: Generates a color palette from the canvas.
- `handleAddCustomColor`: Adds a custom color to the palette.

### Canvas

The `Canvas` component is responsible for rendering the drawing area and handling user interactions such as drawing, panning, and selecting.

#### Props

- `width` and `height`: The dimensions of the canvas.
- `primaryColor` and `secondaryColor`: The colors used for drawing.
- `selectedTool`: The currently selected drawing tool.
- `bucketTolerance`: The tolerance level for the bucket fill tool.
- `brushSize`: The size of the brush.
- `showGrid`: A flag indicating whether the grid is visible on the canvas.
- `onColorPick`: Callback to handle color picking.
- `onToolSelect`: Callback to handle tool selection.

#### Methods

- `clearCanvas`: Clears the canvas.
- `importImage`: Imports an image onto the canvas.
- `undo`: Undoes the last action.
- `redo`: Redoes the last undone action.

### Toolbar

The `Toolbar` component provides a set of tools for drawing and editing pixel art. It includes options for selecting tools, undoing and redoing actions, and more.

### ColorPicker

The `ColorPicker` component allows users to select primary and secondary colors for drawing. It also supports adding custom colors to the palette.

### LayersPanel

The `LayersPanel` component manages the different layers of the canvas, allowing users to add, remove, and reorder layers.

### TopMenuBar

The `TopMenuBar` component provides options for clearing the canvas, importing images, generating color palettes, and adjusting tool settings.

## Usage

To use the Pixel Art Editor, simply import the `Editor` component and include it in your application. The editor will handle all interactions and state management internally.
