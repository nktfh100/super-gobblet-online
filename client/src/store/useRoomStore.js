import create from 'zustand';

const useRoomStore = create((set) => ({
  room: null,
  oldRoom: null, // For client prediction
  lastCellUpdated: null,
  setRoomData: (roomData) => set((state) => ({ room: { ...state.room, ...roomData } })),
  setOldRoomData: (roomData) => set((state) => ({ oldRoom: { ...state.oldRoom, ...roomData } })),
  setLastCellUpdated: (cellData) => set((state) => ({ lastCellUpdated: cellData })),
}));

export { useRoomStore }