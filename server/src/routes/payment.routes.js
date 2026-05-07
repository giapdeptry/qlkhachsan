const express = require('express');
const router = express.Router();

const { asyncHandler, authUser } = require('../auth/checkAuth');

const paymentController = require('../controllers/payment.controller');

router.post('/create', authUser, asyncHandler(paymentController.createPayment));
router.get('/success/:id', authUser, asyncHandler(paymentController.getPaymentById));
router.get('/momo', asyncHandler(paymentController.momoCallback));
router.get('/vnpay', asyncHandler(paymentController.vnpayCallback));

router.get('/user/payments', authUser, asyncHandler(paymentController.getPaymentsUser));
router.put('/user/cancel/:id', authUser, asyncHandler(paymentController.cancelPaymentUser));

router.get('/admin/payments', authUser, asyncHandler(paymentController.getAllPayment));
router.put('/admin/update-status/:id', authUser, asyncHandler(paymentController.updatePaymentStatus));

module.exports = router;
