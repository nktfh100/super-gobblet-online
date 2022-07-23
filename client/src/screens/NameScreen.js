import { useEffect, useState } from "react";
import { Image, ImageBackground, TextInput, TouchableOpacity } from "react-native";
import NotebookBackground from "../components/NotebookBackground";
import ScreenContainer from "../components/ScreenContainer";
import { useUsernameStore } from "../store/useUsernameStore";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSoundsStore } from "../store/useSoundsStore";
import { useCooldown } from "use-cooldown";
import { useWindowDimensions } from 'react-native';

export default function NameScreen() {
    const { height, width } = useWindowDimensions();

    const usernameStore = useUsernameStore((state) => state);

    const [inputUsername, setInputUsername] = useState(usernameStore.username);
    const [usernameOk, setUsernameOk] = useState(false);

    const [cooledDown, setCooledDown] = useCooldown(1000);
    const startCooldown = () => setCooledDown(false);

    const navigation = useNavigation();

    const playSound = useSoundsStore((state) => state.playSound);

    useEffect(() => {
        if (inputUsername && inputUsername.length >= 2 && inputUsername.length <= 11) {
            setUsernameOk(true);
        } else {
            setUsernameOk(false);
        }
    }, [inputUsername]);

    const handleUsernameChange = (newUsername) => {
        if (newUsername.length <= 11) {
            setInputUsername(newUsername);
        }
    }

    const handleNextButton = () => {
        if (usernameOk && cooledDown) {
            startCooldown();
            AsyncStorage.setItem('username', inputUsername);
            usernameStore.setUsername(inputUsername);
            navigation.navigate("home");
            playSound("button");
        }
    }

    const usernameBoxWidth = width * 0.72;

    return (
        <ScreenContainer showHeader={false} containerStyle={{ flex: 1 }}>
            <NotebookBackground hasHeader={false}>
                <ImageBackground source={require("../../assets/images/username_box.png")} resizeMode="cover" style={{ width: usernameBoxWidth, height: usernameBoxWidth * 0.7, marginLeft: width * 0.3, marginTop: 40, justifyContent: "center", alignItems: "center" }}>
                    <TextInput onSubmitEditing={handleNextButton} placeholder="name" autoFocus={true} maxLength={11} style={{ fontSize: 55, height: "100%", fontFamily: "GochiHand", textAlign: "center" }} onChangeText={handleUsernameChange} value={inputUsername} />
                </ImageBackground>
                <TouchableOpacity disabled={!usernameOk} onPress={handleNextButton} style={{ marginTop: 15, marginLeft: width * 0.7 }}>
                    <Image source={require("../../assets/images/next_btn.png")} style={{ width: 85, height: 85, opacity: usernameOk ? 1 : 0.4 }} />
                </TouchableOpacity>
            </NotebookBackground>
        </ScreenContainer>
    );
}