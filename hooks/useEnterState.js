import { create } from "zustand";

const useEnterState = create((set) => ({
  hasEntered: false,
  setHasEntered: (value) => set({ hasEntered: value }),
}));

export default useEnterState
