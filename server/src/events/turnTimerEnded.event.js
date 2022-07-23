const Room = require("../models/room.model");
const { getTimePassed } = require("../utils/utils");

async function turnTimerEnded(io, socket) {
    if (!socket.data.roomId) { return; }

    const room = await Room.findById(socket.data.roomId);
    if (!room) { return };

    if (!room.running || room.ended) {
        return;
    }

    if (getTimePassed(room.turnStartedAt) < 60) {
        return;
    }

    room.turn = room.players.find((p) => p.socketId != room.turn).socketId;
    room.turnStartedAt = new Date();

    await room.save();

    io.to(room.id).emit('turn-played', room.turn, room.board, room.players);
}

module.exports = turnTimerEnded;
