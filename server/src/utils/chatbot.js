const Groq = require('groq-sdk');

// Load env once here.
require('dotenv').config();

// Do not crash the whole server if GROQ_API_KEY is missing.
// We will validate lazily when the chatbot is called.
let groq = null;

function getGroqClient() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || String(apiKey).trim() === '') {
        throw new Error('[ENV] Missing required environment variable: GROQ_API_KEY');
    }
    if (!groq) {
        groq = new Groq({ apiKey });
    }
    return groq;
}



const Room = require('../models/room.model');
const Payment = require('../models/payment.model');

// Lấy lịch đã đặt của 1 phòng
async function getBookedDates(roomId) {
    try {
        const roomIdStr = String(roomId); // Convert ObjectId to string for comparison
        const payments = await Payment.find({
            'rooms.roomId': roomIdStr,
            status: { $in: ['pending', 'confirmed', 'completed'] }, // bỏ cancelled
        });

        let bookedDates = [];
        payments.forEach((p) => {
            p.rooms.forEach((r) => {
                if (String(r.roomId) === roomIdStr) {
                    // Ensure dates are valid
                    if (r.checkInDate && r.checkOutDate) {
                        bookedDates.push({
                            checkIn: new Date(r.checkInDate),
                            checkOut: new Date(r.checkOutDate),
                        });
                    }
                }
            });
        });

        return bookedDates;
    } catch (error) {
        console.error('[CHATBOT] getBookedDates Error:', error.message);
        return []; // Return empty array on error
    }
}

// AI tư vấn khách sạn
async function askHotelAssistant(question) {
    try {
        // Validate GROQ API Key
        try {
            getGroqClient();
        } catch (envError) {
            console.error('[CHATBOT] Environment Error:', envError.message);
            return '❌ Lỗi cấu hình hệ thống. Vui lòng liên hệ quản trị viên.';
        }

        // Fetch rooms data
        let rooms;
        try {
            rooms = await Room.find({});
            if (!rooms || rooms.length === 0) {
                console.warn('[CHATBOT] No rooms found in database');
                return '⚠️ Hiện tại không có phòng nào trong hệ thống. Vui lòng liên hệ lễ tân.';
            }
        } catch (dbError) {
            console.error('[CHATBOT] Database Error:', dbError.message);
            return '❌ Không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau.';
        }

        // Build room data
        let roomData = '';
        try {
            for (const room of rooms) {
                const bookedDates = await getBookedDates(room._id.toString());
                const bookedText =
                    bookedDates.length > 0
                        ? bookedDates
                              .map(
                                  (d) =>
                                      `Đã đặt từ ${d.checkIn.toLocaleDateString(
                                          'vi-VN',
                                      )} đến ${d.checkOut.toLocaleDateString('vi-VN')}`,
                              )
                              .join(', ')
                        : 'Chưa có đặt trước';

                roomData += `
            Tên phòng: ${room.roomName}
            Loại: ${room.roomType}
            Giá: ${room.pricePerNight.toLocaleString('vi-VN')}đ ${room.discount > 0 ? `(Giảm ${room.discount}%)` : ''}
            Sức chứa: ${room.maxAdults} NL + ${room.maxChildren} TE
            Tiện nghi: ${room.amenities?.join(', ') || 'Không có'}
            Tầng: ${room.floor || 'Không rõ'}
            Tình trạng đặt: ${bookedText}
            ----------------------------------------\n`;
            }
        } catch (roomError) {
            console.error('[CHATBOT] Room Processing Error:', roomError.message);
            return '❌ Lỗi khi xử lý dữ liệu phòng. Vui lòng thử lại.';
        }

        // Call Groq API
        const prompt = `
            Bạn là nhân viên khách sạn thân thiện. 
            Dưới đây là danh sách phòng và tình trạng đặt:

            ${roomData}

            Khách hỏi: "${question}"

            Nhiệm vụ:
            - Đề xuất phòng phù hợp (ưu tiên phòng trống, giảm giá, nhiều tiện nghi).
            - Báo rõ ngày nào đã có khách đặt để khách tránh trùng lịch.
            - Nếu còn phòng trống, gợi ý thêm dịch vụ như ăn sáng, spa, xe đưa đón.
            - Trả lời tự nhiên, ngắn gọn, thân thiện.
            `;

        let completion;
        try {
            const groqClient = getGroqClient();
            completion = await groqClient.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'Bạn là nhân viên khách sạn thân thiện, luôn trả lời tự nhiên, dễ hiểu.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 700,
            });
        } catch (groqError) {
            console.error('[CHATBOT] Groq API Error:', groqError.message);
            if (groqError.message.includes('401') || groqError.message.includes('401 Unauthorized')) {
                return '❌ Lỗi xác thực API. Vui lòng kiểm tra cấu hình.';
            }
            if (groqError.message.includes('rate')) {
                return '⏱️ Hệ thống đang tải cao. Vui lòng thử lại sau.';
            }
            if (groqError.message.includes('timeout')) {
                return '⏱️ Kết nối chậm. Vui lòng thử lại.';
            }
            return '❌ Lỗi từ AI Assistant. Vui lòng liên hệ lễ tân.';
        }

        // Extract response
        if (!completion?.choices?.[0]?.message?.content) {
            console.error('[CHATBOT] Invalid Groq Response:', completion);
            return '❌ Phản hồi từ AI không hợp lệ. Vui lòng thử lại.';
        }

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('[CHATBOT] Unexpected Error:', error);
        return '❌ Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ lễ tân.';
    }
}

module.exports = { askHotelAssistant };
