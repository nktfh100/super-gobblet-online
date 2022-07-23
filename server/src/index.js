const express = require('express');
const http = require('http');
const helmet = require("helmet");
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const logger = require("./utils/logger");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

require('dotenv').config();

app.use(helmet());

app.use(xss())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(mongoSanitize());

app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
    res.send("Api is up");
});

const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URL).then(() => {
    logger.info('Connected to MongoDB');

    server.listen(port, () => {
        logger.info(`Listening on port ${port}`);
    });

    io.on('connection', (socket) => {
        // logger.info("socket connected " + socket.id)
        socket.on('create-room', (...args) => {
            require('./events/createRoom.event.js')(io, socket, ...args);
        });

        socket.on('join-room', (...args) => {
            require('./events/joinRoom.event.js')(io, socket, ...args);
        });

        socket.on('start-game', (...args) => {
            require('./events/startGame.event.js')(io, socket, ...args);  
        });

        socket.on('quick-play', (...args) => {
            require('./events/quickPlay.event.js')(io, socket, ...args);  
        });

        socket.on('turn', (...args) => {
            require('./events/turn.event.js')(io, socket, ...args);  
        });

        socket.on('play-again', (...args) => {
            require('./events/playAgain.event.js')(io, socket, ...args);  
        });

        socket.on('turn-timer-ended', (...args) => {
            require('./events/turnTimerEnded.event')(io, socket, ...args);
        });

        socket.on('leave', (...args) => {
            require('./events/leave.event.js')(io, socket, ...args);
        });

        socket.on('leave-queue', (...args) => {
            require('./events/leaveQueue.event.js')(io, socket, ...args);
        });

        socket.on('disconnect', (...args) => {
            // logger.info('user disconnected ' + socket.data.username);
            require('./events/leave.event.js')(io, socket, ...args);
        });
    });
});
