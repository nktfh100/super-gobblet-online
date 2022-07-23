import { useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity, View } from "react-native";
import socket from "../services/socket";
import { useRoomStore } from "../store/useRoomStore";
import { useSoundsStore } from "../store/useSoundsStore";


export default function CustomHeader({ editBtn = false }) {
    const navigation = useNavigation();
    const roomStore = useRoomStore((state) => state);
    const playSound = useSoundsStore((state) => state.playSound);
    const muteSounds = useSoundsStore((state) => state.muteSounds);
    const setMuteSounds = useSoundsStore((state) => state.setMuteSounds);

    const handleHomePress = () => {
        if (roomStore.room) {
            socket.emit("leave");
        }
        roomStore.setRoomData(undefined);
        navigation.navigate("home");
        playSound("button");
    }

    const handleNamePress = () => {
        navigation.navigate("setName");
        playSound("button");
    }

    const handleSoundsPress = () => {
        setMuteSounds(!muteSounds);
    }

    return (
        <View style={{ width: "100%", marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TouchableOpacity onPress={() => { editBtn ? handleNamePress() : handleHomePress() }}>
                {
                    editBtn ?
                        <Image style={{ width: 40, resizeMode: "contain", marginLeft: 15 }} source={require("../../assets/images/edit_btn.png")} />
                        :
                        <Image style={{ width: 40, resizeMode: "contain", marginLeft: 15 }} source={require("../../assets/images/home_btn.png")} />
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSoundsPress}>
                <Image style={{ height: 40, width: 40, resizeMode: "contain", marginRight: 15 }} source={muteSounds ? require("../../assets/images/sounds_off_btn.png") : require("../../assets/images/sounds_on_btn.png")} />
            </TouchableOpacity>
        </View>
    );
}