import { create } from "zustand";

type OpenTransactionState = {
    id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenTransaction = create<OpenTransactionState>((set) => ({
    id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }), // Explicit immediate return
  onClose: () => set({ isOpen: false, id: undefined }), // Explicit immediate return
}));
