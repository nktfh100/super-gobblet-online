import { useRoomStore } from "../store/useRoomStore.js";

export default function playerJoined(userData) {
    let roomStore = useRoomStore.getState();
    if (!roomStore.room) {
        return;
    }
    let newRoom = JSON.parse(JSON.stringify(roomStore.room)); // Have to copy the object or it wont cause a rerender
    newRoom.players.push(userData);
    useRoomStore.setState({ room: newRoom });
}