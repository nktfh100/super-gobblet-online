import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';

const useSoundsStore = create((set, get) => ({
  sounds: {},
  muteSounds: false,
  setSound: (sounds_) => set((state) => ({ sounds: { ...state.sounds, ...sounds_ } })),
  playSound: async (soundName) => {
    let sounds_ = get().sounds;
    if (sounds_[soundName] && !get().muteSounds) {
      await sounds_[soundName].replayAsync();
    }
  },
  setMuteSounds: (value) => { set((state) => ({ muteSounds: value })); AsyncStorage.setItem("mute", String(value)) },
}));

export { useSoundsStore }