const Room = require("../models/room.model");
const logger = require("../utils/logger");

async function turn(io, socket, soldierType, y, x) {
    if (!socket.data.roomId) { return; }

    try {

        soldierType = parseInt(soldierType);
        x = parseInt(x);
        y = parseInt(y);

        const room = await Room.findById(socket.data.roomId);
        if (!room.running || room.ended) {
            return;
        }

        if (socket.id != room.turn) {
            return socket.emit('turn-error', true, "It's not your turn!");
        }

        const playerNum = socket.id == room.players[0].socketId ? 0 : 1;

        let pieceType = 'small';
        switch (soldierType) {
            case 1:
                pieceType = 'medium'
                break;
            case 2:
                pieceType = 'large'
                break;
            default:
                soldierType = 0;
                break;
        }

        if (room.players[playerNum].pieces[pieceType] <= 0) {
            return socket.emit('turn-error');
        }

        let targetCell = room.board[y][x].value;

        if (targetCell != "") {
            let cellSoldierType = parseInt(targetCell.substring(1, 2));
            if (cellSoldierType >= soldierType) {
                return socket.emit('turn-error', true, "You can't place that solider there!");
            }
        }
        room.board[y][x].value = playerNum + "" + soldierType;
        room.turn = room.players.find((p) => p.socketId != socket.id).socketId;
        room.players[playerNum].pieces[pieceType]--;
        room.turnStartedAt = new Date();

        // Check for if the player won

        let didWin = false;
        // ###
        // xxx
        // ###
        for (let y_ = 0; y_ < room.board.length; y_++) {
            didWin = true;
            for (let x_ = 0; x_ < room.board[y_].length; x_++) {
                let cell_ = room.board[y_][x_].value;
                if (cell_ == "" || cell_.substring(0, 1) != String(playerNum)) {
                    didWin = false;
                    break;
                }
            }
            if (didWin) {
                break;
            }
        }

        // #X#
        // #X#
        // #X#
        if (!didWin) {
            for (let c_ = 0; c_ < room.board.length; c_++) {
                didWin = true;
                for (let y_ = 0; y_ < room.board.length; y_++) {
                    let cell_ = room.board[y_][c_].value;
                    if (cell_ == "" || cell_.substring(0, 1) != String(playerNum)) {
                        didWin = false;
                        break;
                    }
                }
                if (didWin) {
                    break;
                }
            }
        }

        // ##X
        // #X#
        // X##
        if (!didWin) {
            for (let i_ = 0; i_ < 2; i_++) {
                didWin = true;
                let cellTop = room.board[0][i_ == 0 ? 0 : 2].value;
                let cellMiddle = room.board[1][1].value;
                let cellBottom = room.board[2][i_ == 0 ? 2 : 0].value;
                if (cellTop == "" || cellMiddle == "" || cellBottom == "") {
                    didWin = false;
                    continue;
                }
                if (cellTop.substring(0, 1) != String(playerNum) || cellMiddle.substring(0, 1) != String(playerNum) || cellBottom.substring(0, 1) != String(playerNum)) {
                    didWin = false;
                }
                if (didWin) {
                    break;
                }
            }
        }

        if (didWin) {
            room.ended = true;
            room.winner = socket.id;
            room.turnStartedAt = null;
        }

        // Check if the other player has no more pieces left meanings its a draw
        let isDraw = false;
        let otherPlayer_ = room.players.find((p) => p.socketId != socket.id);
        if (!didWin && otherPlayer_.pieces.small <= 0 && otherPlayer_.pieces.medium <= 0 && otherPlayer_.pieces.large <= 0) {
            isDraw = true;
            room.ended = true;
            room.turnStartedAt = null;
        }

        await room.save();

        socket.to(room.id).emit('turn-played', room.turn, room.board, room.players, x, y);
        if (didWin || isDraw) {
            io.to(room.id).emit('game-ended', room.winner);
            logger.info(`Game ended for room ${room.code}`)
        }
    } catch (error) {
        return socket.emit('turn-error', error.message);
    }
}

module.exports = turn;
