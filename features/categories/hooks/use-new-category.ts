import { create } from "zustand";

type NewCategoryState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewCategory = create<NewCategoryState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }), // Explicit immediate return
  onClose: () => set({ isOpen: false }), // Explicit immediate return
}));
