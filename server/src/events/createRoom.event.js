const Room = require("../models/room.model");
const logger = require("../utils/logger");
const { makeRoomCode, validateUsername } = require("../utils/utils");

async function createRoom(io, socket, username) {
    socket.data.username = validateUsername(username);

    const room = await Room.create({
        code: makeRoomCode(),
        host: socket.id,
        turn: socket.id,
        players: [
            {
                socketId: socket.id,
                username: socket.data.username,
            }
        ],
    });
    socket.join(room.id);
    socket.data.roomId = room.id;
    socket.emit('create-room', room);
    logger.info(`${socket.data.username} created room ${room.code}`);
    return room.code;
}

module.exports = createRoom;
