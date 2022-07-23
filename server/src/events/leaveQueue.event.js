const QuickPlay = require("../models/quickPlay.model");
const logger = require("../utils/logger");

async function leaveQueue(io, socket) {
    const queuePos = await QuickPlay.findOne({playerId: socket.id});
    if(queuePos) {
        await queuePos.delete();
    }
    socket.data.quickPlay = false;
    if(socket.data.username) {
        logger.info(`${socket.data.username} left the quick play queue`);
    }
}

module.exports = leaveQueue;