import { useRoomStore } from "../store/useRoomStore.js";

export default function playAgain(playerId) {
    let roomStore = useRoomStore.getState();
    if (!roomStore.room) {
        return;
    }
    let newRoom = JSON.parse(JSON.stringify(roomStore.room));
    newRoom.players.find((p) => p.socketId == playerId).playAgain = true;
    useRoomStore.setState({ room: newRoom });
}