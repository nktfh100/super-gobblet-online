import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import socket from "../services/socket";
import MyAppText from "../components/MyAppText";
import { useRoomStore } from "../store/useRoomStore";
import { useSoundsStore } from "../store/useSoundsStore";

export default function RoomLobbyScreen() {

    const roomData = useRoomStore((state) => state.room);
    const playSound = useSoundsStore((state) => state.playSound);

    const [isHost, setIsHost] = useState(false);
    const [playerMe, setPlayerMe] = useState(undefined);
    const [otherPlayer, setOtherPlayer] = useState(undefined);

    useEffect(() => {
        setIsHost(socket.id == roomData.host);
        setPlayerMe(roomData.players.find(p => p.socketId == socket.id));
        setOtherPlayer(roomData.players.find(p => p.socketId != socket.id));
    }, [roomData]);

    if (!playerMe) {
        return (<ScreenContainer showHeader={true} />);
    }

    return (
        <ScreenContainer showHeader={true} containerStyle={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <MyAppText style={[styles.textHeader, { paddingHorizontal: 10 }]}>Room code: {roomData ? roomData.code : ""}</MyAppText>
                <MyAppText style={[styles.text, { marginTop: 40, marginBottom: 10 }]}>{isHost ? playerMe.username : otherPlayer ? otherPlayer.username : ""}</MyAppText>
                <MyAppText style={[styles.text, { marginBottom: 10 }]}>vs</MyAppText>
                <MyAppText style={[styles.text]}>{!isHost ? playerMe.username || "" : otherPlayer ? otherPlayer ? otherPlayer.username : "" : "Waiting for your friends..."}</MyAppText>
            </View>
            {isHost ?
                <View style={{ opacity: !!otherPlayer ? 1 : 0.4, justifyContent: "center", alignItems: "center", paddingBottom: 100 }}>
                    <TouchableOpacity disabled={otherPlayer == undefined} onPress={() => {
                        if (otherPlayer) {
                            socket.emit("start-game");
                            playSound("button");
                        }
                    }}>
                        <Image style={{ width: 85, height: 85 }} source={require("../../assets/images/next_btn.png")} />
                    </TouchableOpacity>
                </View> : null}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    textHeader: {
        textAlign: "center",
        fontSize: 50
    },
    text: {
        textAlign: "center",
        fontSize: 45
    }
});