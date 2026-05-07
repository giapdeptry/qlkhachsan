# Hướng dẫn sử dụng hệ thống đánh giá phòng

## Frontend (Client)
```
cd client
npm install
npm run dev
# http://localhost:5174
```

## Backend (Server)
```
cd server
npm install
npm run dev
# Port 3001
```

## Test đánh giá phòng
1. **Tạo payment completed:**
   - Book room → Payment cash → Admin set status `completed`
2. **OrderHistory:** Login → Lịch sử → **"Xem & Đánh giá"**
3. **DetailRoom:** Auto-scroll rating → **Viết đánh giá** → Gửi ✅

## Debug
Server console logs khi submit:
```
=== RATING CREATE DEBUG ===
Room found OK
SKIP PAYMENT VALIDATION
Rating saved successfully
```

**Lỗi thường gặp:**
- No completed payment → Admin update payment.status = 'completed'
- Syntax error → Check server/src/services/rating.service.js

**Feature:**
- ✅ Hiển thị ratings + average
- ✅ Submit/update/delete (user own)
- ✅ From OrderHistory seamless
- ✅ Real-time UI

Enjoy! 👑
