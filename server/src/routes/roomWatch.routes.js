const express = require('express');
const router = express.Router();

const { asyncHandler, authUser } = require('../auth/checkAuth');

const roomWatchController = require('../controllers/roomWatch.controller');

router.post('/create', authUser, asyncHandler(roomWatchController.createRoomWatch));
router.get('/get', authUser, asyncHandler(roomWatchController.getRoomWatch));

module.exports = router;
