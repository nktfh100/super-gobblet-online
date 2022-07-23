const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.plugin');

const playerSchema = new mongoose.Schema({
    _id: false,
    socketId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 11,
    },
    playAgain: {
        type: Boolean,
        default: false,
    },
    pieces: {
        small: {
            type: Number,
            default: 2,
            min: 0,
            required: true,
        },
        medium: {
            type: Number,
            default: 2,
            min: 0,
            required: true,
        },
        large: {
            type: Number,
            default: 2,
            min: 0,
            required: true,
        },
    }
});

const boardCellSchema = new mongoose.Schema({
    _id: false,
    type: Object,
    value: {
        type: String,
        default: '',
    }
});


const roomSchema = mongoose.Schema(
    {
        players: [playerSchema],
        code: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 6,
            unique: true,
        },
        host: {
            type: String,
            required: true,
        },
        running: {
            type: Boolean,
            default: false,
        },
        ended: {
            type: Boolean,
            default: false,
        },
        winner: {
            type: String,
            default: null,
        },
        turn: {
            type: String,
            default: '',
        },
        turnStartedAt: {
            type: Date,
            default: null,
        },
        board: {
            type: [[boardCellSchema]],
            default: [
                [{ value: '' }, { value: '' }, { value: '' }],
                [{ value: '' }, { value: '' }, { value: '' }],
                [{ value: '' }, { value: '' }, { value: '' }],
            ],
        }
    },
    {
        timestamps: true,
    }
);

roomSchema.plugin(toJSON);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
