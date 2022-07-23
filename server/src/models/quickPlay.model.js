const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.plugin');

const quickPlaySchema = mongoose.Schema(
    {
        playerId: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 11,
        }
    },
    {
        timestamps: true,
    }
);

quickPlaySchema.plugin(toJSON);

const QuickPlay = mongoose.model('QuickPlay', quickPlaySchema);

module.exports = QuickPlay;
