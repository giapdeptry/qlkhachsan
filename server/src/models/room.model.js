const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
    {
        roomName: {
            type: String, // Tên phòng, ví dụ: "Phòng Deluxe", "Phòng VIP"
            required: true,
        },
        roomNumber: {
            type: String, // Số phòng, ví dụ: "101", "A202"
            required: true,
        },
        roomType: {
            type: String, // Loại phòng: "Standard", "Deluxe", "VIP"
            required: true,
        },
        pricePerNight: {
            type: Number, // Giá theo đêm
            required: true,
        },
        maxAdults: {
            type: Number, // Số người lớn tối đa
            default: 2,
        },
        maxChildren: {
            type: Number, // Số trẻ em tối đa
            default: 0,
        },
        amenities: [
            {
                type: String, // Danh sách tiện nghi: "WiFi", "TV", "Mini Bar"
            },
        ],
        images: [
            {
                type: String, // URL hình ảnh
            },
        ],
        description: {
            type: String,
        },
        discount: {
            type: Number,
            default: 0,
        },
        // Thông tin thêm
        floor: {
            type: Number, // tầng mấy
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Room', RoomSchema);
