import create from "zustand";

export type AppState = {
  soundEnabled: boolean;
  toggleSound: () => void;
};

export const useAppState = create<AppState>((set) => ({
  soundEnabled: false,
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));
