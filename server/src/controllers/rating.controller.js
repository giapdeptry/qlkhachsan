const RatingService = require('../services/rating.service');
const { OK } = require('../core/success.response');

class RatingController {
    async createRating(req, res) {
        const { roomId, rating, comment, paymentId } = req.body;
        const userId = req.user._id;

        const newRating = await RatingService.createRating(
            roomId,
            userId,
            rating,
            comment,
            paymentId
        );

        return new OK({
            message: 'Thêm đánh giá thành công',
            metadata: newRating,
        }).send(res);
    }

    async getRatingsByRoomId(req, res) {
        const { roomId } = req.params;

        const result = await RatingService.getRatingsByRoomId(roomId);

        return new OK({
            message: 'Lấy đánh giá thành công',
            metadata: result,
        }).send(res);
    }

    async updateRating(req, res) {
        const { roomId, ratingId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        const updatedRating = await RatingService.updateRating(
            roomId,
            ratingId,
            userId,
            rating,
            comment
        );

        return new OK({
            message: 'Cập nhật đánh giá thành công',
            metadata: updatedRating,
        }).send(res);
    }

    async deleteRating(req, res) {
        const { roomId, ratingId } = req.params;
        const userId = req.user._id;

        const result = await RatingService.deleteRating(roomId, ratingId, userId);

        return new OK({
            message: result.message,
            metadata: result,
        }).send(res);
    }

    async getRoomStats(req, res) {
        const { roomId } = req.params;

        const stats = await RatingService.getRoomStats(roomId);

        return new OK({
            message: 'Lấy thống kê đánh giá thành công',
            metadata: stats,
        }).send(res);
    }
}

module.exports = new RatingController();
