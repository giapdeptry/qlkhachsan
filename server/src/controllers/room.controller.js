const RoomService = require('../services/room.service');

const { OK } = require('../core/success.response');

class RoomController {
    async uploadImages(req, res) {
        const images = req.files;
        const data = await RoomService.uploadImages(images);
        return new OK({ message: 'Upload images successfully', metadata: data }).send(res);
    }

    async createRoom(req, res) {
        const {
            roomName,
            roomNumber,
            roomType,
            pricePerNight,
            maxAdults,
            maxChildren,
            amenities,
            images,
            description,
            status,
            floor,
            discount,
        } = req.body;
        const room = await RoomService.createRoom(
            roomName,
            roomNumber,
            roomType,
            pricePerNight,
            maxAdults,
            maxChildren,
            amenities,
            images,
            description,
            status,
            floor,
            discount,
        );
        return new OK({ message: 'Create room successfully', metadata: room }).send(res);
    }

    async updateRoom(req, res) {
        const { id } = req.params;
        const data = req.body;
        const room = await RoomService.updateRoom(id, data);
        return new OK({ message: 'Update room successfully', metadata: room }).send(res);
    }

    async deleteRoom(req, res) {
        const { id } = req.params;
        const room = await RoomService.deleteRoom(id);
        return new OK({ message: 'Delete room successfully', metadata: room }).send(res);
    }

    async getRooms(req, res) {
        const rooms = await RoomService.getRooms();
        const roomsWithDiscount = rooms.map((room) => {
            if (room.discount) {
                room.originalPrice = room.pricePerNight;
                room.pricePerNight = room.pricePerNight * (1 - room.discount / 100);
            }
            return room;
        });
        return new OK({ message: 'Get rooms successfully', metadata: roomsWithDiscount }).send(res);
    }

    async getRoomById(req, res) {
        const { id } = req.params;
        const room = await RoomService.getRoomById(id);
        return new OK({ message: 'Get room by id successfully', metadata: room }).send(res);
    }

    async searchRoom(req, res) {
        const { checkIn, checkOut, adults, children } = req.query;
        const room = await RoomService.searchRoom(checkIn, checkOut, adults, children);
        return new OK({ message: 'Search room successfully', metadata: room }).send(res);
    }
}

module.exports = new RoomController();
