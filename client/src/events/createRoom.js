import { useRoomStore } from "../store/useRoomStore";
import { navigate } from "../utils/RootNavigation";

export default function createRoom(roomData) {
    useRoomStore.setState({ room: roomData });
    navigate("roomLobby");
}