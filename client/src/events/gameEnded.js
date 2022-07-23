import { useRoomStore } from "../store/useRoomStore.js";

export default function gameEnded(winnerId) {
    let roomStore = useRoomStore.getState();
    if (!roomStore.room) {
        return;
    }
    let newRoom = JSON.parse(JSON.stringify(roomStore.room));
    newRoom.ended = true;
    newRoom.winner = winnerId;
    newRoom.turnStartedAt = null;
    
    useRoomStore.setState({ room: newRoom });
}