const Room = require("../models/room.model");
const logger = require("../utils/logger");
const { validateUsername } = require("../utils/utils");

async function joinRoom(io, socket, username, roomCode) {
    socket.data.username = validateUsername(username);
    
    const room = await Room.findOne({ code: roomCode });
    if (!room) {
        socket.emit('join-room', { error: "Room not found" });
        return;
    }

    if (room.players.length >= 2) {
        socket.emit('join-room', { error: "Room is full" });
        return;
    }

    room.players.push({
        socketId: socket.id,
        username: socket.data.username
    });

    await room.save();

    const playerJoined = room.players.find(p => p.socketId == socket.id);

    socket.data.roomId = room.id;
    socket.join(room.id);
    socket.emit('join-room', room);
    socket.to(room.id).emit('player-joined', playerJoined);
    logger.info(`${socket.data.username} joined room ${room.code}`);
}

module.exports = joinRoom;