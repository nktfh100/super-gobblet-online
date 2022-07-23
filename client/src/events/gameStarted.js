import { useRoomStore } from "../store/useRoomStore.js";
import { navigate } from "../utils/RootNavigation.js";

export default function gameStarted(playerTurnId) {
    let roomStore = useRoomStore.getState();
    if (!roomStore.room) {
        return;
    }
    let newRoom = JSON.parse(JSON.stringify(roomStore.room));
    newRoom.running = true;
    newRoom.turn = playerTurnId;
    newRoom.turnStartedAt = new Date();
    useRoomStore.setState({ room: newRoom });
    navigate("game");
}