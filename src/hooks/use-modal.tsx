import { create } from "zustand";

interface ModalStore {
  // Image Conversion Modal
  isImageConversionOpen: boolean;
  setImageConversionOpen: (open: boolean) => void;

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
}

export const useModal = create<ModalStore>((set) => ({
  // Image Conversion Modal
  isImageConversionOpen: false,
  setImageConversionOpen: (open) => set({ isImageConversionOpen: open }),

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
}));
