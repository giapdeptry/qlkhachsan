const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomBookingSchema = new Schema({
    roomId: { type: String, required: true, ref: 'room' },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    numberOfAdults: { type: Number, required: true },
    numberOfChildren: { type: Number, required: true },
    price: { type: Number, required: true },
});

const cartSchema = new Schema(
    {
        userId: { type: String, required: true, ref: 'user' },
        fullName: { type: String },
        email: { type: String },
        phone: { type: String },
        rooms: [roomBookingSchema], // danh sách nhiều phòng, mỗi phòng có checkIn/out riêng
        totalPrice: { type: Number, required: true },
        nameCoupon: { type: String },
    },
    { timestamps: true },
);

module.exports = mongoose.model('cart', cartSchema);
