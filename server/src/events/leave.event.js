const QuickPlay = require("../models/quickPlay.model");
const Room = require("../models/room.model");

async function leave(io, socket) {

    if (socket.data.quickPlay) {
        const quickPlay_ = await QuickPlay.findOne({ playerId: socket.id });
        if (quickPlay_) {
            await quickPlay_.delete();
        }
        socket.data.quickPlay = false;
    }

    if (!socket.data.roomId) { return; }
    const room = await Room.findById(socket.data.roomId);

    if (!room) { return; }

    const player = room.players.find(p => p.socketId === socket.id);
    if (!player) { return; }

    if (room.host == socket.id || room.running) {
        if (room.players.length > 1) {
            room.winner = room.players.find(p => p.socketId !== socket.id).socketId;
        }
        room.ended = true;
    }
    room.players = room.players.filter((p) => p.socketId != socket.id);

    room.players.length == 0 || room.host == socket.id ? await room.remove() : await room.save();

    socket.to(room.id).emit('player-left', player.socketId);
    if (room.running) {
        socket.to(room.id).emit('game-ended', room.winner);
    }
    socket.data.roomId = null;

}

module.exports = leave;