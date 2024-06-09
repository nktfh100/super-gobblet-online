import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import socket from "../services/socket";
import { useSoundsStore } from "../store/useSoundsStore";
import { useUsernameStore } from "../store/useUsernameStore";
import useCooldown from '../hooks/useCooldown';

export default function LobbyScreen() {
    const { height, width } = useWindowDimensions();

    const [cooledDown, setCooledDown] = useCooldown(1000);
    const startCooldown = () => setCooledDown(false);

    const navigation = useNavigation();

    const username = useUsernameStore((state) => state.username);

    const playSound = useSoundsStore((state) => state.playSound);

    const btnWidth = width * 0.9;

    return (
        <ScreenContainer containerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: (width * 0.8), height: (width * 0.8) * 0.41, marginBottom: 20 }}>
                <Image source={require("../../assets/images/lobby.png")} style={styles.image} />
            </View>
            <TouchableOpacity onPress={() => { if (cooledDown) { startCooldown(); navigation.navigate("quickPlay"); playSound("button"); } }} style={[styles.btnContainer, { width: btnWidth, height: btnWidth * 0.36 }]}>
                <Image source={require("../../assets/images/quick_play_btn.png")} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate("enterCode"); playSound("button"); }} style={[styles.btnContainer, { width: btnWidth, height: btnWidth * 0.36 }]}>
                <Image source={require("../../assets/images/join_game_btn.png")} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { if (cooledDown) { socket.emit("create-room", username); playSound("button"); } }} style={[styles.btnContainer, { width: btnWidth, height: btnWidth * 0.36 }]}>
                <Image source={require("../../assets/images/create_game_btn.png")} style={styles.image} />
            </TouchableOpacity>
        </ScreenContainer>
    );
}
const styles = StyleSheet.create({
    image: {
        flex: 1, width: null, height: null, resizeMode: 'contain'
    },
    btnContainer: {
        marginVertical: 10
    }
});