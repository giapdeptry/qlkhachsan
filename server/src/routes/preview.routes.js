const express = require('express');
const router = express.Router();

const { asyncHandler, authUser } = require('../auth/checkAuth');

const previewRoomController = require('../controllers/previewRoom.controller');

router.post('/create', authUser, asyncHandler(previewRoomController.createPreviewRoom));
router.get('/room/:id', asyncHandler(previewRoomController.getPreviewRoom));

module.exports = router;
