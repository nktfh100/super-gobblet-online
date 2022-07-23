const QuickPlay = require("../models/quickPlay.model");
const logger = require("../utils/logger");
const { validateUsername } = require("../utils/utils");

async function quickPlay(io, socket, username) {
    socket.data.username = validateUsername(username);
    socket.data.quickPlay = true;

    logger.info(`${socket.data.username} entered the quick play queue`);

    let i = 0;
    while (i < 100) {
        i++;

        const matchFound = await QuickPlay.findOne().sort({ created_at: -1 });

        if (matchFound) {
            const sockets = await io.in(matchFound.playerId).fetchSockets();
            if (sockets.length == 0) {
                // The other player is not connected for some reason
                await matchFound.delete();
                continue;
            }
            const otherPlayerSocket = sockets[0];
            if(otherPlayerSocket.id == socket.id) {
                await matchFound.delete();
                continue;
            }

            await matchFound.delete();
            socket.data.quickPlay = false;
            otherPlayerSocket.data.quickPlay = false;
            const code = await require("./createRoom.event")(io, otherPlayerSocket, otherPlayerSocket.data.username);
            await require("./joinRoom.event")(io, socket, socket.data.username, code);
            return;
        } else {
            await QuickPlay.create({
                playerId: socket.id,
                username: socket.data.username
            });
            return;
        }
    }
}

module.exports = quickPlay;