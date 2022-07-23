const Room = require("../models/room.model");

async function startGame(io, socket) {
    if (!socket.data.roomId) { return; }
    const room = await Room.findById(socket.data.roomId);

    if (socket.id != room.host) {
        return socket.emit('error', "You can't do that!");
    }

    if (room.running) {
        return socket.emit('error', "Game is already running!");
    }

    room.running = true;
    room.turnStartedAt = new Date();
    room.turn = room.players[Math.random() > 0.5 ? 0 : 1].socketId;
    await room.save();

    io.to(room.id).emit('game-started', room.turn);
}

module.exports = startGame;
