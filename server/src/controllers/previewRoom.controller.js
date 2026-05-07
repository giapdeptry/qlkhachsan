const PreviewRoomService = require('../services/previewRoom.service');

const { OK } = require('../core/success.response');

class PreviewRoomController {
    async createPreviewRoom(req, res) {
        const { id } = req.user;
        const { roomId, rating, content } = req.body;
        const previewRoom = await PreviewRoomService.createPreviewRoom(id, roomId, rating, content);
        new OK({ message: 'Create preview room successfully', metadata: previewRoom }).send(res);
    }

    async getPreviewRoom(req, res) {
        const { id } = req.params;
        const previewRoom = await PreviewRoomService.getPreviewRoom(id);
        new OK({ message: 'Get preview room successfully', metadata: previewRoom }).send(res);
    }
}

module.exports = new PreviewRoomController();
