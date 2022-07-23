import { useNavigation } from "@react-navigation/native";
import { Image, ImageBackground, Modal, TouchableOpacity, View } from "react-native";
import { Dimensions } from 'react-native';
import socket from "../services/socket";
import { useRoomStore } from "../store/useRoomStore";
import { useSoundsStore } from "../store/useSoundsStore";
import { showAd } from "../services/ads";
import MyAppText from "./MyAppText";
import { useCooldown } from "use-cooldown";

export default function MyModal({ visible, type, backgroundImg, onCloseRequest, text }) {
    const navigation = useNavigation();

    const [cooledDown, setCooledDown] = useCooldown(3000);
    const startCooldown = () => setCooledDown(false);

    const roomData = useRoomStore((state) => state.room);
    const setRoomData = useRoomStore((state) => state.setRoomData);
    const playSound = useSoundsStore((state) => state.playSound);

    const windowWidth = Dimensions.get('window').width;

    const imageLeft = type == 0 || type == 2 ? require('../../assets/images/back_btn.png') : require('../../assets/images/v_btn.png')
    const imageRight = type == 0 ? require('../../assets/images/play_again_btn.png') : require('../../assets/images/x_btn.png')

    const leaveFunc = () => {
        if (cooledDown) {
            startCooldown();
            socket.emit('leave');
            navigation.navigate("lobbyMenu");
            playSound("button");
            showAd();
        }
    }

    const playAgainFunc = () => {
        if (cooledDown) {
            startCooldown();
            socket.emit("play-again");
            let newRoomData = JSON.parse(JSON.stringify(roomData));

            newRoomData.players.find((p) => type == 0 ? p.socketId == socket.id : p.socketId != socket.id).playAgain = true;

            setRoomData(newRoomData);
            playSound("button");
        }
    }

    const onPressLeft = type != 1 ? leaveFunc :
        () => {
            if (roomData && roomData.players && !roomData.players.find((p) => p.socketId != socket.id).left) {
                playAgainFunc();
            } else {
                leaveFunc();
            }
        };

    const onPressRight = type == 0 ? () => {
        if (roomData && roomData.players && !roomData.players.find((p) => p.socketId != socket.id).left) {
            playAgainFunc();
        } else {
            leaveFunc();
        }
    } : leaveFunc;

    const iconSizeLeft = type == 1 ? 55 : 78;
    const iconSizeRight = type == 1 ? 45 : 78;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCloseRequest}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.55)" }}>
                <ImageBackground source={backgroundImg} resizeMode="contain" style={{ width: windowWidth * 0.98, height: windowWidth * 0.98, justifyContent: text ? "center" : "flex-end", alignItems: "center" }}>
                    {text ? <MyAppText style={{ fontSize: 50, width: "73%", textAlign: "center", color: type == 1 ? "#ce1414" : "#0066ff" }}>{text}</MyAppText> : null}
                    <View style={{ marginTop: text ? 20 : 0, marginBottom: text ? 0 : 62, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%" }}>
                        <TouchableOpacity onPress={onPressLeft}><Image style={{ width: iconSizeLeft, height: iconSizeLeft }} resizeMode="contain" source={imageLeft} /></TouchableOpacity>
                        {type != 2 ?
                            <TouchableOpacity onPress={onPressRight}><Image style={{ width: iconSizeRight, height: iconSizeRight }} resizeMode="contain" source={imageRight} /></TouchableOpacity>
                            : null}
                    </View>
                </ImageBackground>
            </View>
        </Modal>
    );
}