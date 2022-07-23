import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand'

const useUsernameStore = create((set) => ({
  username: undefined,
  setUsername: (username) => { set((state) => ({ username })); AsyncStorage.setItem("username", username) },
}));

export { useUsernameStore }