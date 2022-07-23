import { useRoomStore } from "../store/useRoomStore.js";

export default function newGame(playerTurnId) {
    let roomStore = useRoomStore.getState();
    if (!roomStore.room) {
        return;
    }
    let newRoom = JSON.parse(JSON.stringify(roomStore.room));
    newRoom.running = true;
    newRoom.turn = playerTurnId;
    newRoom.turnStartedAt = new Date();
    newRoom.ended = false;
    for (let i = 0; i < newRoom.players.length; i++) {
        newRoom.players[i].pieces.small = 2;
        newRoom.players[i].pieces.medium = 2;
        newRoom.players[i].pieces.large = 2;
        newRoom.players[i].playAgain = false;
    }
    newRoom.board = [[{ value: '' }, { value: '' }, { value: '' }], [{ value: '' }, { value: '' }, { value: '' }], [{ value: '' }, { value: '' }, { value: '' }]];
    useRoomStore.setState({ room: newRoom });
}