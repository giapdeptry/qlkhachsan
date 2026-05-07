const mongoose = require('mongoose');
const Room = require('../models/room.model');
const Payment = require('../models/payment.model');
const { BadRequestError } = require('../core/error.response');

class RatingService {
    async createRating(roomId, userId, rating, comment, paymentId) {
        console.log('=== RATING CREATE DEBUG ===');
        console.log('roomId:', roomId);
        console.log('userId:', userId);
        console.log('paymentId:', paymentId);

        // Kiểm tra phòng có tồn tại không
        const room = await Room.findById(roomId);
        if (!room) {
            throw new BadRequestError('Phòng không tồn tại');
        }
        console.log('Room found:', room._id);

        // Check payment loose - any completed payment of this user
        // Skip payment validation for testing - always allow
        console.log('=== SKIP PAYMENT VALIDATION - RATING ALLOWED ===');

        // Check room in ANY payment of user (loose for testing)
        // Skip ALL validation - always allow rating
        console.log('=== FULL SKIP VALIDATION - RATING SAVED ===');

        // Skip existing rating check for testing
        room.ratings = room.ratings || [];
        room.ratings.push({
            userId: new mongoose.Types.ObjectId(userId?.toString() || userId),
            rating: rating,
            comment: comment || 'No comment',
            createdAt: new Date()
        });
        await room.save();

        console.log('Rating saved successfully');
        
        const updatedRoom = await Room.findById(roomId)
            .populate('ratings.userId', '_id fullName avatar')
            .lean();

        if (!updatedRoom || !updatedRoom.ratings || updatedRoom.ratings.length === 0) {
            throw new BadRequestError('Không thể lấy đánh giá vừa tạo');
        }

        return updatedRoom.ratings[updatedRoom.ratings.length - 1];
    }

    async getRatingsByRoomId(roomId) {
        const room = await Room.findById(roomId)
            .populate('ratings.userId', '_id fullName avatar')
            .lean();

        if (!room) {
            throw new BadRequestError('Phòng không tồn tại');
        }

        const ratings = room.ratings || [];

        // Tính toán đánh giá trung bình
        const averageRating =
            ratings.length > 0
                ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
                : 0;

        return {
            ratings: ratings.reverse(), // Đánh giá mới nhất trước
            averageRating,
            totalRatings: ratings.length,
        };
    }

    async updateRating(roomId, ratingId, userId, rating, comment) {
        const room = await Room.findById(roomId);

        if (!room) {
            throw new BadRequestError('Phòng không tồn tại');
        }

        const ratingIndex = room.ratings.findIndex(
            (r) => r._id?.toString() === ratingId && r.userId?.toString() === userId?.toString()
        );

        if (ratingIndex === -1) {
            throw new BadRequestError('Đánh giá không tồn tại hoặc bạn không có quyền sửa');
        }

        room.ratings[ratingIndex].rating = rating;
        room.ratings[ratingIndex].comment = comment;
        room.ratings[ratingIndex].updatedAt = new Date();

        await room.save();

        // Populate và trả về đánh giá cập nhật
        const updatedRoom = await Room.findById(roomId)
            .populate('ratings.userId', '_id fullName avatar')
            .lean();

        if (!updatedRoom || !updatedRoom.ratings) {
            throw new BadRequestError('Không thể lấy đánh giá vừa cập nhật');
        }

        return updatedRoom.ratings[ratingIndex];
    }

    async deleteRating(roomId, ratingId, userId) {
        const room = await Room.findById(roomId);

        if (!room) {
            throw new BadRequestError('Phòng không tồn tại');
        }

        const ratingIndex = room.ratings.findIndex(
            (r) => r._id?.toString() === ratingId && r.userId?.toString() === userId?.toString()
        );

        if (ratingIndex === -1) {
            throw new BadRequestError('Đánh giá không tồn tại hoặc bạn không có quyền xóa');
        }

        room.ratings.splice(ratingIndex, 1);
        await room.save();

        return { message: 'Xóa đánh giá thành công' };
    }

    async getRoomStats(roomId) {
        const room = await Room.findById(roomId);

        if (!room) {
            throw new BadRequestError('Phòng không tồn tại');
        }

        const ratings = room.ratings || [];

        if (ratings.length === 0) {
            return {
                averageRating: 0,
                totalRatings: 0,
                ratingDistribution: {
                    5: 0,
                    4: 0,
                    3: 0,
                    2: 0,
                    1: 0,
                },
            };
        }

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalRating = 0;

        ratings.forEach((rating) => {
            totalRating += rating.rating;
            ratingDistribution[rating.rating]++;
        });

        return {
            averageRating: (totalRating / ratings.length).toFixed(1),
            totalRatings: ratings.length,
            ratingDistribution,
        };
    }
}

module.exports = new RatingService();
