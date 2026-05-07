const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelPreviewRoom = new Schema(
    {
        userId: { type: String, require: true, ref: 'user' },
        roomId: { type: String, require: true, ref: 'room' },
        rating: { type: Number, require: true },
        content: { type: String, require: true },
        createdAt: { type: Date, require: true },
        updatedAt: { type: Date, require: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('previewRoom', modelPreviewRoom);
