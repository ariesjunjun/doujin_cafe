import { create } from "zustand";

type PaginationStore = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export const usePaginationStore = create<PaginationStore>((set) => ({
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
}));
