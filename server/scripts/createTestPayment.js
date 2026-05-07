const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// Import models
const User = require('../src/models/users.model');
const Room = require('../src/models/room.model');
const Payment = require('../src/models/payment.model');

async function createTestPayment() {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.CONNECT_DB);
        console.log('✅ Kết nối MongoDB thành công');

        // Tìm user "Văn Giáp Nguyễn"
        const user = await User.findOne({ fullName: 'Văn Giáp Nguyễn' });
        if (!user) {
            console.log('❌ Không tìm thấy user "Văn Giáp Nguyễn"');
            console.log('Danh sách users hiện tại:');
            const allUsers = await User.find().select('fullName email');
            console.log(allUsers);
            return;
        }
        console.log('✅ Tìm thấy user:', user.fullName);

        // Tìm room "The Peak Suite at Landmark Plus"
        let room = await Room.findOne({ roomName: 'The Peak Suite at Landmark Plus' });

        // Nếu không tìm thấy, lấy phòng đầu tiên
        if (!room) {
            console.log('⚠️ Không tìm thấy phòng "The Peak Suite at Landmark Plus"');
            room = await Room.findOne();
            if (!room) {
                console.log('❌ Không có phòng nào trong database');
                return;
            }
            console.log('📍 Sử dụng phòng:', room.roomName);
        } else {
            console.log('✅ Tìm thấy phòng:', room.roomName);
        }

        // Tính ngày check-in và check-out (hôm nay và ngày mai)
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate());
        const checkOutDate = new Date();
        checkOutDate.setDate(checkOutDate.getDate() + 2);

        // Tạo payment
        const payment = new Payment({
            userId: user._id,
            rooms: [
                {
                    roomId: room._id,
                    checkInDate,
                    checkOutDate,
                    numberOfAdults: 2,
                    numberOfChildren: 0,
                    price: room.pricePerNight * 2,
                }
            ],
            fullName: user.fullName,
            email: user.email || 'test@example.com',
            phone: user.phone || '0123456789',
            totalPrice: room.pricePerNight * 2,
            nameCoupon: 'NONE',
            status: 'completed',
            paymentMethod: 'cash'
        });

        await payment.save();
        console.log('✅ Tạo payment test thành công!');
        console.log('📊 Chi tiết:');
        console.log('   - User:', user.fullName);
        console.log('   - Room:', room.roomName);
        console.log('   - Check-in:', checkInDate.toLocaleDateString('vi-VN'));
        console.log('   - Check-out:', checkOutDate.toLocaleDateString('vi-VN'));
        console.log('   - Giá:', room.pricePerNight * 2, 'đ');
        console.log('   - Status: completed');
        console.log('\n🎉 Bây giờ bạn có thể đánh giá phòng này!');

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Ngắt kết nối MongoDB');
    }
}

createTestPayment();
