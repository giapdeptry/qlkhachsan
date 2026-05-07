const Room = require('../models/room.model');
const Payment = require('../models/payment.model');
const RoomWatch = require('../models/roomWatch.model');
const mongoose = require('mongoose');

const { BadRequestError } = require('../core/error.response');

class RoomService {
    async uploadImages(images) {
        return images.map((image) => image.filename);
    }

    async createRoom(
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
    ) {
        const data = await Room.create({
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
        });
        return data;
    }

    async updateRoom(id, data) {
        const room = await Room.findOne({ _id: id });
        if (!room) {
            throw new BadRequestError('Phòng không tồn tại');
        }
        room.set(data);
        await room.save();
        return room;
    }

    async getRooms() {
        const data = await Room.find().lean();
        return data;
    }

    async deleteRoom(id) {
        const room = await Room.findOne({ _id: id });
        if (!room) {
            throw new BadRequestError('Phòng không tồn tại');
        }
        await room.deleteOne();
        return room;
    }

    async getRoomById(id) {
        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('ID phòng không hợp lệ');
        }

        try {
            const room = await Room.findOne({ _id: new mongoose.Types.ObjectId(id) });
            const payment = await Payment.find({ roomId: id });
            
            if (!room) {
                throw new BadRequestError('Phòng không tồn tại');
            }
            
            return { room, payment };
        } catch (error) {
            if (error.message && error.message.includes('không hợp lệ')) {
                throw error;
            }
            if (error.message && error.message.includes('không tồn tại')) {
                throw error;
            }
            throw new BadRequestError('Lỗi khi lấy thông tin phòng: ' + error.message);
        }
    }

    async searchRoom(checkIn, checkOut, adults, children) {
        // Validate input parameters
        if (!checkIn || !checkOut || !adults || !children) {
            throw new BadRequestError('Thiếu thông tin tìm kiếm phòng');
        }

        // Convert string dates to Date objects and validate
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Check if dates are valid
        if (isNaN(checkInDate.getTime())) {
            throw new BadRequestError('Ngày check-in không hợp lệ');
        }

        if (isNaN(checkOutDate.getTime())) {
            throw new BadRequestError('Ngày check-out không hợp lệ');
        }

        // Validate dates
        if (checkInDate >= checkOutDate) {
            throw new BadRequestError('Ngày check-out phải sau ngày check-in');
        }

        if (checkInDate < new Date()) {
            throw new BadRequestError('Ngày check-in không thể trong quá khứ');
        }

        // Validate numeric parameters
        const numAdults = parseInt(adults);
        const numChildren = parseInt(children);

        if (isNaN(numAdults) || numAdults <= 0) {
            throw new BadRequestError('Số người lớn phải là số dương');
        }

        if (isNaN(numChildren) || numChildren < 0) {
            throw new BadRequestError('Số trẻ em phải là số không âm');
        }

        // Get all rooms
        const allRooms = await Room.find({}).lean();

        // Get all payments that might conflict with the requested dates
        const conflictingPayments = await Payment.find({
            status: { $in: ['confirmed', 'completed'] }, // Only check confirmed and completed payments
            rooms: {
                $elemMatch: {
                    checkInDate: { $lt: checkOutDate }, // Check-in before our check-out
                    checkOutDate: { $gt: checkInDate }, // Check-out after our check-in
                },
            },
        });

        // Extract room IDs that are booked during the requested period
        const bookedRoomIds = new Set();
        conflictingPayments.forEach((payment) => {
            payment.rooms.forEach((room) => {
                // Check if this room booking conflicts with our requested dates
                if (room.checkInDate < checkOutDate && room.checkOutDate > checkInDate) {
                    bookedRoomIds.add(room.roomId);
                }
            });
        });

        // Filter rooms based on:
        // 1. Not booked during requested dates
        // 2. Sufficient capacity for adults and children
        const availableRooms = allRooms.filter((room) => {
            // Check if room is not booked
            if (bookedRoomIds.has(room._id.toString())) {
                return false;
            }

            // Check capacity
            if (room.maxAdults < adults) {
                return false;
            }

            if (room.maxChildren < children) {
                return false;
            }

            return true;
        });

        return availableRooms;
    }
}

module.exports = new RoomService();
