import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import NotebookBackground from "../components/NotebookBackground";
import ScreenContainer from "../components/ScreenContainer";
import socket from "../services/socket";
import { useSoundsStore } from "../store/useSoundsStore";
import { useUsernameStore } from "../store/useUsernameStore";
import { useCooldown } from 'use-cooldown';

export default function EnterCodeScreen() {
    const { height, width } = useWindowDimensions();

    const navigation = useNavigation();

    const [cooledDown, setCooledDown] = useCooldown(1000);
    const startCooldown = () => setCooledDown(false);

    const [inputCode, setInputCode] = useState('');
    const [codeOk, setCodeOk] = useState(false);

    const username = useUsernameStore((state) => state.username);
    const playSound = useSoundsStore((state) => state.playSound);

    useEffect(() => {
        if (inputCode && inputCode.length == 6) {
            setCodeOk(true);
        } else {
            setCodeOk(false);
        }
    }, [inputCode]);

    const handleCodeChange = (newCode) => {
        if (newCode.length <= 6) {
            setInputCode(newCode);
        }
    }

    const handleNextButton = () => {
        if (codeOk && cooledDown) {
            startCooldown();
            socket.emit("join-room", username, inputCode);
            playSound("button");
        }
    }

    const codeBoxWidth = width * 0.72;

    return (
        <ScreenContainer containerStyle={{ flex: 1 }}>
            <NotebookBackground hasHeader={true}>
                <ImageBackground source={require("../../assets/images/code_box.png")} resizeMode="cover" style={{ width: codeBoxWidth, height: codeBoxWidth * 0.7, marginLeft: width * 0.3, marginTop: 40, justifyContent: "center", alignItems: "center" }}>
                    <TextInput keyboardType='numeric' onSubmitEditing={handleNextButton} placeholder="123456" autoFocus={true} maxLength={6} style={{ fontSize: 55, height: "100%", fontFamily: "GochiHand", textAlign: "center" }} onChangeText={handleCodeChange} value={inputCode} />
                </ImageBackground>
                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: width * 0.4, width: "78%", marginTop: 15 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate("lobbyMenu"); playSound("button"); }}>
                        <Image source={require("../../assets/images/back_btn_white.png")} style={{ width: 85, height: 85 }} />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!codeOk} onPress={handleNextButton} style={{ marginLeft: 50 }}>
                        <Image source={require("../../assets/images/next_btn.png")} style={{ width: 85, height: 85, opacity: codeOk ? 1 : 0.4 }} />
                    </TouchableOpacity>
                </View>
            </NotebookBackground>
        </ScreenContainer>
    );
}