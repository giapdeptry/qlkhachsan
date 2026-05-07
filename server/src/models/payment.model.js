const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomBookingSchema = new Schema({
    roomId: { type: String, required: true, ref: 'Room' },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    numberOfAdults: { type: Number, required: true },
    numberOfChildren: { type: Number, required: true },
    price: { type: Number, required: true },
});

const modelPayment = new Schema(
    {
        userId: { type: String, required: true, ref: 'user' },
        rooms: [roomBookingSchema],
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        totalPrice: { type: Number, required: true },
        nameCoupon: { type: String, default: '' },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
        paymentMethod: { type: String, required: true, enum: ['cash', 'momo', 'vnpay'], default: 'cash' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('payment', modelPayment);
