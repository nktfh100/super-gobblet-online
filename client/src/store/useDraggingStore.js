import create from 'zustand';

const useDraggingStore = create((set) => ({
  dragging: undefined,
  setDragging: (dragging_) => set((state) => ({ dragging: dragging_ })),
}));

export { useDraggingStore }