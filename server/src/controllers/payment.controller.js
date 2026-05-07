const PaymentService = require('../services/payment.service');
const { OK } = require('../core/success.response');

class PaymentController {
    async createPayment(req, res) {
        const { id } = req.user;
        const { paymentMethod } = req.body;
        const payment = await PaymentService.createPayment(paymentMethod, id);
        return new OK({ message: 'Create payment successfully', metadata: payment }).send(res);
    }

    async getPaymentById(req, res) {
        const { id } = req.params;
        const payment = await PaymentService.getPaymentById(id);
        return new OK({ message: 'Get payment by id successfully', metadata: payment }).send(res);
    }

    async momoCallback(req, res) {
        const { orderInfo, resultCode } = req.query;
        const id = orderInfo.split(' ')[4];
        const payment = await PaymentService.momoCallback(id, resultCode);
        res.redirect(`${process.env.URL_CLIENT}/payment-success/${payment._id}`);
    }

    async vnpayCallback(req, res) {
        const { vnp_ResponseCode, vnp_OrderInfo } = req.query;
        const payment = await PaymentService.vnpayCallback(vnp_ResponseCode, vnp_OrderInfo);
        res.redirect(`${process.env.URL_CLIENT}/payment-success/${payment._id}`);
    }

    async getAllPayment(req, res) {
        const payments = await PaymentService.getAllPayment();
        return new OK({ message: 'Get all payment successfully', metadata: payments }).send(res);
    }

    async updatePaymentStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        const payment = await PaymentService.updatePaymentStatus(id, status);
        return new OK({ message: 'Update payment status successfully', metadata: payment }).send(res);
    }

    async getPaymentsUser(req, res) {
        const { id } = req.user;
        const payments = await PaymentService.getPaymentsUser(id);
        return new OK({ message: 'Get payments user successfully', metadata: payments }).send(res);
    }

    async cancelPaymentUser(req, res) {
        const { id } = req.params;
        const payment = await PaymentService.cancelPaymentUser(id);
        return new OK({ message: 'Cancel payment user successfully', metadata: payment }).send(res);
    }
}

module.exports = new PaymentController();
