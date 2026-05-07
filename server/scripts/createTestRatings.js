const mongoose = require('mongoose');

const Room = require('../src/models/room.model');

async function createTestRatings() {
    try {
    await mongoose.connect('mongodb://127.0.0.1:27017/qlkhachsan');

    console.log('Connected to MongoDB (hardcoded URI)');


        // Room ID for "The Peak Suite at Landmark Plus" from hotel.rooms.json
        const roomId = '68d6401343e41d8ccd954d07';

        const room = await Room.findById(roomId);
        if (!room) {
            console.error('Room not found!');
            return;
        }

        console.log(`Found room: ${room.roomName}`);

        // 2 test ratings
        const testRatings = [
            {
                userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // Dummy user ID 1
                rating: 5,
                comment: 'Phòng rất đẹp, view tuyệt vời, dịch vụ xuất sắc! Highly recommend.',
                createdAt: new Date()
            },
            {
                userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'), // Dummy user ID 2
                rating: 4,
                comment: 'Phòng sạch sẽ, tiện nghi đầy đủ. Giá cả hợp lý, sẽ quay lại.',
                createdAt: new Date()
            }
        ];

        // Add ratings if not already existing or update
        room.ratings = room.ratings || [];
        testRatings.forEach(rating => {
            // Check if similar rating exists (simple check)
            const exists = room.ratings.some(r => 
                r.userId.toString() === rating.userId.toString() && 
                r.rating === rating.rating &&
                r.comment === rating.comment
            );
            if (!exists) {
                room.ratings.push(rating);
            }
        });

        await room.save();
        console.log('✅ Added 2 test ratings successfully!');
        console.log('Ratings:', room.ratings.slice(-2)); // Last 2

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

createTestRatings();

