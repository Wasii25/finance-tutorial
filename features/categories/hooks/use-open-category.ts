import { create } from "zustand";

type OpenCategoryState = {
    id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenCategory = create<OpenCategoryState>((set) => ({
    id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }), // Explicit immediate return
  onClose: () => set({ isOpen: false, id: undefined }), // Explicit immediate return
}));
