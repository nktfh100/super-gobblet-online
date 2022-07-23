import { useRoomStore } from "../store/useRoomStore.js";
import { showErrorAlert } from "../utils/utils.js";
import { navigate } from "../utils/RootNavigation";

export default function joinRoom(data) {
    if (data.error) {
        console.log(data.error);
        showErrorAlert(data.error);
        return;
    }
    useRoomStore.setState({ room: data });
    navigate("roomLobby");
}