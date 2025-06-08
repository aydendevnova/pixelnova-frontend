import { create } from "zustand";

interface ModalStore {
  // Resize Canvas Modal
  isResizeCanvasOpen: boolean;
  setResizeCanvasOpen: (open: boolean) => void;

  // Clear Canvas Warning Modal
  isClearCanvasWarningOpen: boolean;
  setClearCanvasWarningOpen: (open: boolean) => void;

  // Import Image Modal
  isImportImageOpen: boolean;
  setImportImageOpen: (open: boolean) => void;

  // Export Modal
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;

  // Convert to Pixel Art Modal
  isConvertToPixelArtOpen: boolean;
  setConvertToPixelArtOpen: (open: boolean) => void;

  // AI Pixel Art Modal
  isAIPixelArtOpen: boolean;
  setAIPixelArtOpen: (open: boolean) => void;

  // AI Colorizer Modal
  isSmartColorizerOpen: boolean;
  setSmartColorizerOpen: (open: boolean) => void;

  // Skin Colors Modal
  isSkinColorsOpen: boolean;
  setSkinColorsOpen: (open: boolean) => void;

  // Helper to check if any modal is open
  canHandleKeyboardShortcuts: () => boolean;
}

export const useModal = create<ModalStore>((set, get) => ({
  // Resize Canvas Modal
  isResizeCanvasOpen: false,
  setResizeCanvasOpen: (open) => set({ isResizeCanvasOpen: open }),

  // Clear Canvas Warning Modal
  isClearCanvasWarningOpen: false,
  setClearCanvasWarningOpen: (open) => set({ isClearCanvasWarningOpen: open }),

  // Import Image Modal
  isImportImageOpen: false,
  setImportImageOpen: (open) => set({ isImportImageOpen: open }),

  // Export Modal
  isExportModalOpen: false,
  setIsExportModalOpen: (open) => set({ isExportModalOpen: open }),

  // Convert to Pixel Art Modal
  isConvertToPixelArtOpen: false,
  setConvertToPixelArtOpen: (open) => set({ isConvertToPixelArtOpen: open }),

  // AI Pixel Art Modal
  isAIPixelArtOpen: false,
  setAIPixelArtOpen: (open) => set({ isAIPixelArtOpen: open }),

  // Colorizer Modal
  isSmartColorizerOpen: false,
  setSmartColorizerOpen: (open) => set({ isSmartColorizerOpen: open }),

  // Skin Colors Modal
  isSkinColorsOpen: false,
  setSkinColorsOpen: (open) => set({ isSkinColorsOpen: open }),

  // Returns true if no modals are open
  canHandleKeyboardShortcuts: () => {
    const state = get();
    return !(
      state.isResizeCanvasOpen ||
      state.isClearCanvasWarningOpen ||
      state.isImportImageOpen ||
      state.isExportModalOpen ||
      state.isConvertToPixelArtOpen ||
      state.isAIPixelArtOpen ||
      state.isSmartColorizerOpen ||
      state.isSkinColorsOpen
    );
  },
}));
