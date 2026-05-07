const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/room');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

var upload = multer({ storage: storage });

const { asyncHandler, authUser } = require('../auth/checkAuth');

const roomController = require('../controllers/room.controller');

router.post('/upload-images', upload.array('images'), asyncHandler(roomController.uploadImages));
router.post('/create', authUser, asyncHandler(roomController.createRoom));
router.get('/all', asyncHandler(roomController.getRooms));
router.put('/update/:id', asyncHandler(roomController.updateRoom));
router.delete('/delete/:id', asyncHandler(roomController.deleteRoom));
router.get('/detail/:id', asyncHandler(roomController.getRoomById));
router.get('/search', asyncHandler(roomController.searchRoom));

module.exports = router;
