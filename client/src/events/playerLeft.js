import { useRoomStore } from "../store/useRoomStore.js";
import { navigate } from "../utils/RootNavigation.js";

export default function playerLeft(playerId) {
    let roomStore = useRoomStore.getState();
    if (!roomStore.room) {
        return;
    }
    let newRoom = JSON.parse(JSON.stringify(roomStore.room));
    if (!newRoom.running) {
        newRoom.players = newRoom.players.filter(p => p.socketId != playerId);
        if (newRoom.host == playerId) {
            navigate("lobbyMenu");
            useRoomStore.setState({ room: undefined, oldRoom: undefined });
            return;
        }
    } else {
        newRoom.players.find(p => p.socketId == playerId).left = true;
    }
    useRoomStore.setState({ room: newRoom });
}