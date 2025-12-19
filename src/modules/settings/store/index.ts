import { create } from 'zustand';

interface ISettingsDrawerStore {
  isOpen: boolean;
  canMoveColumns: boolean;
  open: () => void;
  close: () => void;
  toggleColumnMovement: () => void;
}

const useSettingsDrawer = create<ISettingsDrawerStore>(set => ({
  isOpen: false,
  canMoveColumns: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleColumnMovement: () =>
    set(state => ({ canMoveColumns: !state.canMoveColumns })),
}));

export default useSettingsDrawer;
