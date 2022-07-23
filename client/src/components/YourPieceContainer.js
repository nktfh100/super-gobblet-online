import { Image, ImageBackground, useWindowDimensions, View } from "react-native";
import { DraxView } from 'react-native-drax';
import socket from "../services/socket";
import { useDraggingStore } from "../store/useDraggingStore";
import { useRoomStore } from "../store/useRoomStore";
import { imageToSoldierType } from "../utils/utils";
import MyAppText from "./MyAppText";

export default function PieceContainer({ playerNum, type, count }) {
    const { height, width } = useWindowDimensions();

    const roomData = useRoomStore((state) => state.room);

    const setDragging = useDraggingStore((state) => state.setDragging);
    const currentlyDragging = useDraggingStore((state) => state.dragging);

    let imgHeight_ = 111;
    switch (type) {
        case '0':
            imgHeight_ = 111 * 0.82;
            break;
        case '1':
            imgHeight_ = 111 * 0.95;
            break;
        default:
            break;
    }
    return (
        <ImageBackground style={{ height: width * 0.38, width: (width * 0.38) * 0.7, alignItems: "center", justifyContent: 'center', position: "relative" }} resizeMode="contain" source={require('../../assets/images/your_piece_card.png')}>
            <DraxView
                style={{
                    justifyContent: 'center',
                    alignItems: "center",
                }}
                onDragStart={() => {
                    setDragging(type);
                }}
                onDragEnd={() => {
                    setDragging(undefined);
                }}
                payload={type}
                draggingStyle={{ opacity: currentlyDragging == type ? 0.4 : 1 }}
                draggable={count > 0 && roomData.turn == socket.id}
                longPressDelay={0}>
                <Image style={{ width: imgHeight_ * 0.7, height: "85%", opacity: count > 0 ? 1 : 0.3 }} resizeMode='contain' source={imageToSoldierType(playerNum, type)} />
            </DraxView>
            <View style={{ position: "absolute", right: 0, top: 0 }}>
                <MyAppText style={{ width: 28, height: 28, lineHeight: 28, fontSize: 21, backgroundColor: "white", borderWidth: 2.5, borderColor: "#1e1c21", textAlign: "center", borderRadius: 50 }}>{count}</MyAppText>
            </View>
        </ImageBackground>
    );
}
