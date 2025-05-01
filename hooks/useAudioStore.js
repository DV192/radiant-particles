import { create } from "zustand";

const useAudioStore = create((set) => ({
  isMuted: true,
  setIsMuted: (isMuted) => set({ isMuted }),
}))

export default useAudioStore