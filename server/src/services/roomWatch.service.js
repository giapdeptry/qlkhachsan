const RoomWatch = require('../models/roomWatch.model');
const Room = require('../models/room.model');

const { BadRequestError } = require('../core/error.response');

class RoomWatchService {
    async createRoomWatch(userId, roomId) {
        const roomWatch = await RoomWatch.findOne({ userId, roomId });
        if (roomWatch) {
            throw new BadRequestError('Phòng đã được theo dõi');
        }
        const newRoomWatch = await RoomWatch.create({ userId, roomId });
        return newRoomWatch;
    }

    async getRoomWatch(userId) {
        const roomWatch = await RoomWatch.find({ userId }).populate('roomId');
        return roomWatch;
    }
}

module.exports = new RoomWatchService();
