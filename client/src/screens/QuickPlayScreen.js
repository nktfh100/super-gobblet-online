import { useEffect } from "react";
import { Image, TouchableOpacity } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { useUsernameStore } from "../store/useUsernameStore";
import { useNavigation } from "@react-navigation/native";
import socket from "../services/socket";
import MyAppText from "../components/MyAppText";
import { useSoundsStore } from "../store/useSoundsStore";

export default function QuickPlayScreen() {

    const navigation = useNavigation();

    const username = useUsernameStore((state) => state.username);
    const playSound = useSoundsStore((state) => state.playSound);

    useEffect(() => {
        socket.emit("quick-play", username);

        return () => {
            socket.emit("leave-queue");
        }
    }, []);

    const handleBackPress = () => {
        navigation.navigate("lobbyMenu");
        playSound("button");
    }

    return (
        <ScreenContainer showHeader={true} containerStyle={{ flex: 1, alignItems: "center" }}>
            <MyAppText style={{ fontSize: 40, marginTop: 210 }}>Looking for players</MyAppText>
            <Image style={{ height: 18, resizeMode: "contain", marginTop: 25 }} source={require("../../assets/images/loading.gif")} />
            <TouchableOpacity style={{ marginTop: 40 }} onPress={handleBackPress}>
                <Image style={{ width: 70, height: 70 }} source={require("../../assets/images/back_btn.png")} />
            </TouchableOpacity>
        </ScreenContainer>
    );
}
