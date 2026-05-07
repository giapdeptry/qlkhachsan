const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomWatchSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // tham chiếu tới user nếu có
            required: true,
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room', // tham chiếu tới room nếu có
            required: true,
        },
    },
    {
        timestamps: true, // có createdAt, updatedAt
    },
);

const RoomWatch = mongoose.model('roomWatch', roomWatchSchema);

module.exports = RoomWatch;
