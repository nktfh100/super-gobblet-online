import { useWindowDimensions, View } from "react-native";
import { useRoomStore } from "../store/useRoomStore";
import MyAppText from "./MyAppText";

export default function UsernameBox({ username, playerNum }) {
    const { height, width } = useWindowDimensions();

    const room = useRoomStore((state) => state.room);

    const isPlayerTurn = room && room.players && room.players[playerNum].socketId == room.turn;
    let backgroundColor = playerNum == 0 ? "#73d9ff" : "#ea6886";
    return (
        <View style={{ justifyContent: "center", width: width * 0.4, borderRadius: 19, backgroundColor: backgroundColor, borderColor: "#1E1C21", borderWidth: isPlayerTurn ? 4 : 3.2, borderStyle: isPlayerTurn ? "solid" : "dashed" }}>
            <MyAppText style={{ fontSize: 24, paddingVertical: 2, textAlign: "center" }}>{username}</MyAppText>
        </View>
    );
}