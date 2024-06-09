import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import socket from '../services/socket';
import { showErrorAlert } from '../utils/utils';
import { useSoundsStore } from "../store/useSoundsStore";
import { showAd } from '../services/ads';
import useCooldown from '../hooks/useCooldown';

export default function HomeScreen() {
    const { height, width } = useWindowDimensions();

    const navigation = useNavigation();

    const [cooledDown, setCooledDown] = useCooldown(1000);
    const startCooldown = () => setCooledDown(false);

    const playSound = useSoundsStore((state) => state.playSound);

    const handlePlayPress = async () => {
        if(cooledDown) {
            startCooldown();
            showAd();
            playSound("button");
            return socket.connected ? navigation.navigate("lobbyMenu") : showErrorAlert("You are not connected to the server. Please try again later.");
        }
    }

    return (
        <ScreenContainer containerStyle={{ flex: 1, marginTop: 40, alignItems: "center" }} headerProps={{ editBtn: true }} >
            <View style={{ width: width * 0.9, height: (width * 0.9) * 0.5 }}>
                <Image source={require("../../assets/images/logo.png")} style={styles.image} />
            </View>

            <TouchableOpacity onPress={handlePlayPress} style={{ width: "100%", height: 160, marginTop: 10 }}>
                <Image source={require("../../assets/images/play_btn.png")} style={styles.image} />
            </TouchableOpacity>
        </ScreenContainer>
    );
}


const styles = StyleSheet.create({
    image: {
        flex: 1, width: null, height: null, resizeMode: 'contain'
    }
});