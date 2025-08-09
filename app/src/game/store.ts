import { create } from 'zustand';

interface State {
  hp: number;
  setHp: (hp: number) => void;
}

export const useStore = create<State>((set) => ({
  hp: 100,
  setHp: (hp) => set({ hp })
}));
