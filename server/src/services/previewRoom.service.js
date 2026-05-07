const modelPreviewRoom = require('../models/previewRoom.model');

class PreviewRoomService {
    async createPreviewRoom(userId, roomId, rating, content) {
        const previewRoom = await modelPreviewRoom.create({ userId, roomId, rating, content });
        return previewRoom;
    }

    async getPreviewRoom(id) {
        const previewRoom = await modelPreviewRoom.find({ roomId: id }).populate('userId');
        return previewRoom;
    }
}

module.exports = new PreviewRoomService();
