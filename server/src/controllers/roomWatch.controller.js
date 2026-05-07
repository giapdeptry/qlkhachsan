const RoomWatchService = require('../services/roomWatch.service');

const { OK } = require('../core/success.response');

class RoomWatchController {
    async createRoomWatch(req, res) {
        const { id } = req.user;
        const { roomId } = req.body;
        const roomWatch = await RoomWatchService.createRoomWatch(id, roomId);
        return new OK({ message: 'Create room watch successfully', metadata: roomWatch }).send(res);
    }

    async getRoomWatch(req, res) {
        const { id } = req.user;
        const roomWatch = await RoomWatchService.getRoomWatch(id);
        return new OK({ message: 'Get room watch successfully', metadata: roomWatch }).send(res);
    }
}

module.exports = new RoomWatchController();
