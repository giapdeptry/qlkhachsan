const express = require('express');
const router = express.Router();

const { asyncHandler, authUser } = require('../auth/checkAuth');
const ratingController = require('../controllers/rating.controller');

router.post('/create', authUser, asyncHandler(ratingController.createRating));
router.get('/room/:roomId', asyncHandler(ratingController.getRatingsByRoomId));
router.get('/stats/:roomId', asyncHandler(ratingController.getRoomStats));
router.put('/update/:roomId/:ratingId', authUser, asyncHandler(ratingController.updateRating));
router.delete('/delete/:roomId/:ratingId', authUser, asyncHandler(ratingController.deleteRating));

module.exports = router;
