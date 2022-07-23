import { useRoomStore } from "../store/useRoomStore.js";
import { useSoundsStore } from "../store/useSoundsStore.js";

export default function turnPlayed(newTurn, newBoard, newPlayers, cellX, cellY) {
    let roomStore = useRoomStore.getState();
    if (!roomStore.room) {
        return;
    }
    
    const oldCellData = cellX != undefined && cellY != undefined ? roomStore.room.board[cellY][cellX].value : "";
    
    let newRoom = JSON.parse(JSON.stringify(roomStore.room));
    
    newRoom.turn = newTurn;
    newRoom.board = newBoard;
    newRoom.players = newPlayers;
    newRoom.turnStartedAt = new Date();
    
    useRoomStore.setState({ room: newRoom, lastCellUpdated: { x: cellX, y: cellY } });
    
    if(cellX != undefined && cellY != undefined) {
        const playSound = useSoundsStore.getState().playSound;
        if (oldCellData != "") {
            playSound("eat");
        } else {
            playSound("place");
        }
    }
}