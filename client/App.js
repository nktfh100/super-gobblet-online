import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect, useCallback } from 'react';
import * as Font from 'expo-font';
import HomeScreen from './src/screens/HomeScreen';
import { I18nManager } from "react-native";
import LobbyScreen from './src/screens/LobbyScreen';
import NameScreen from './src/screens/NameScreen';
import { useUsernameStore } from "./src/store/useUsernameStore.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import socket from './src/services/socket';
import EnterCodeScreen from './src/screens/EnterCodeScreen';
import RoomLobbyScreen from './src/screens/RoomLobbyScreen';
import { navigationRef } from './src/utils/RootNavigation';
import GameScreen from './src/screens/GameScreen';
import { showErrorAlert } from './src/utils/utils';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRoomStore } from './src/store/useRoomStore';
import { useSoundsStore } from './src/store/useSoundsStore';
import { Audio } from 'expo-av';
import { setupAds } from './src/services/ads';

// Socket events
import createRoom from './src/events/createRoom';
import joinRoom from './src/events/joinRoom';
import playerJoined from './src/events/playerJoined';
import playerLeft from './src/events/playerLeft';
import gameEnded from './src/events/gameEnded';
import gameStarted from './src/events/gameStarted';
import turnPlayed from './src/events/turnPlayed';
import newGame from './src/events/newGame';
import playAgain from './src/events/playAgain';
import turnError from './src/events/turnError';
import QuickPlayScreen from './src/screens/QuickPlayScreen';

const Stack = createNativeStackNavigator();

function App() {

  try {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    I18nManager.swapLeftAndRightInRTL(false);
  } catch (e) {
    console.log(e);
  }

  const setUsername = useUsernameStore((state) => state.setUsername);
  const lastCellUpdated = useRoomStore((state) => state.lastCellUpdated);

  const setSound = useSoundsStore((state) => state.setSound);
  const setMuteSounds = useSoundsStore((state) => state.setMuteSounds);

  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState("home");

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

        await Font.loadAsync({
          'GochiHand': require('./assets/GochiHand-Regular.ttf'),
        });

        const savedUsername = await AsyncStorage.getItem("username");

        if (!savedUsername) {
          setInitialRouteName("setName");
        } else {
          setUsername(savedUsername);
        }

        const muteSounds = await AsyncStorage.getItem("mute");
        if (muteSounds === 'true') {
          setMuteSounds(muteSounds);
        }

        // Load sounds
        const buttonSound = await Audio.Sound.createAsync(require('./assets/sounds/button_click.mp3'));
        setSound({ "button": buttonSound.sound });

        const eatSound = await Audio.Sound.createAsync(require('./assets/sounds/eat.mp3'));
        setSound({ "eat": eatSound.sound });

        const wonSound = await Audio.Sound.createAsync(require('./assets/sounds/won_music.mp3'));
        setSound({ "won": wonSound.sound });

        const lostSound = await Audio.Sound.createAsync(require('./assets/sounds/lost_music.mp3'));
        setSound({ "lost": lostSound.sound });

        const pickupSound = await Audio.Sound.createAsync(require('./assets/sounds/pickup_soldier.mp3'));
        setSound({ "pickup": pickupSound.sound });

        const placeSound = await Audio.Sound.createAsync(require('./assets/sounds/place_soldier.mp3'));
        setSound({ "place": placeSound.sound });

        const returnSound = await Audio.Sound.createAsync(require('./assets/sounds/return_soldier.mp3'));
        setSound({ "return": returnSound.sound });

        setupAds();

      } catch (e) {
        console.warn(e);
        showErrorAlert(e.message);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });


    socket.on("player-joined", (...args) => {
      playerJoined(...args);
    });

    socket.on("game-ended", (...args) => {
      gameEnded(...args);
    });

    socket.on("player-left", (...args) => {
      playerLeft(...args);
    });

    socket.on("join-room", (...args) => {
      joinRoom(...args);
    });

    socket.on("create-room", (...args) => {
      createRoom(...args);
    });

    socket.on("game-started", (...args) => {
      gameStarted(...args);
    });

    socket.on("turn-played", (...args) => {
      turnPlayed(...args);
    });

    socket.on("new-game", (...args) => {
      newGame(...args);
    });

    socket.on("play-again", (...args) => {
      playAgain(...args);
    });

    socket.on("error", (error) => {
      console.log("error", error);
      showErrorAlert(error);
    });

    socket.on("turn-error", (...args) => {
      turnError(...args);
    });

    return () => {
      socket.off('connect_error');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      socket.off('username');
      socket.off('game-ended');
      socket.off('player-joined');
      socket.off('join-room');
      socket.off('create-room');
      socket.off('player-left');
      socket.off('game-started');
      socket.off('turn-played');
      socket.off('new-game');
      socket.off('play-again');
      socket.off('turn-error');
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    if (lastCellUpdated) {
      setTimeout(() => {
        useRoomStore.setState({ lastCellUpdated: null });
      }, 1000);
    }
  }, [lastCellUpdated]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      onLayout={onLayoutRootView}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={1 == 1 ? initialRouteName : "game"}>
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="lobbyMenu" component={LobbyScreen} />
        <Stack.Screen name="setName" component={NameScreen} />
        <Stack.Screen name="enterCode" component={EnterCodeScreen} />
        <Stack.Screen name="roomLobby" component={RoomLobbyScreen} />
        <Stack.Screen name="quickPlay" component={QuickPlayScreen} />
        <Stack.Screen name="game" component={GameScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default function App_() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <App />
      </NavigationContainer >
    </GestureHandlerRootView>
  );
}
