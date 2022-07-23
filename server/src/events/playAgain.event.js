const Room = require("../models/room.model");

async function playAgain(io, socket) {
    if (!socket.data.roomId) { return; }
    const room = await Room.findById(socket.data.roomId);
    if (!room) { socket.data.roomId = null; return };

    if (!room.ended) {
        return socket.emit('error', "The game has not ended yet!");
    }
    room.players.find((p) => p.socketId == socket.id).playAgain = true;
    let playAgain = room.players.length > 1 && room.players.find((p) => p.socketId != socket.id).playAgain;
    if (playAgain) {
        room.ended = false;
        room.running = true;
        room.turnStartedAt = new Date();
        room.turn = room.players[Math.random() > 0.5 ? 0 : 1].socketId;
        for (let i = 0; i < room.players.length; i++) {
            room.players[i].pieces.small = 2;
            room.players[i].pieces.medium = 2;
            room.players[i].pieces.large = 2;
            room.players[i].playAgain = false;
        }
        room.board = [[{ value: '' }, { value: '' }, { value: '' }], [{ value: '' }, { value: '' }, { value: '' }], [{ value: '' }, { value: '' }, { value: '' }]];
    }
    await room.save();

    if (playAgain) {
        io.to(room.id).emit('new-game', room.turn);
    } else {
        io.to(room.id).emit('play-again', socket.id);
    }

}

module.exports = playAgain;
