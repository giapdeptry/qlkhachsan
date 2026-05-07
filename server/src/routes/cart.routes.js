const express = require('express');
const router = express.Router();

const { asyncHandler, authUser } = require('../auth/checkAuth');

const cartController = require('../controllers/cart.controller');

router.post('/create', authUser, asyncHandler(cartController.createCart));
router.get('/get', authUser, asyncHandler(cartController.getCart));
router.post('/update', authUser, asyncHandler(cartController.updateCart));
router.delete('/delete/:idRoom', authUser, asyncHandler(cartController.deleteCartRoom));

module.exports = router;
