import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  toggleSidebar: () => void;
  openModal: () => void;
  closeModal: () => void;
}

/**
 * Zustand store for UI state
 * Manages client-side UI interactions (modals, sidebar, etc.)
 */
export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isModalOpen: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
