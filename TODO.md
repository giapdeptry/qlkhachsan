# TODO - Fix lỗi không upload dữ liệu đơn hàng từ database

## ✅ Step 1: [COMPLETED] Diagnosis
- Đọc toàn bộ files liên quan (PaymentRequest, controller, service, model, OrderManager)
- Xác định nguyên nhân: database/hotel.payments.json TRỐNG

## ⏳ Step 2: Tạo test data cho database/hotel.payments.json
- [ ] Đọc hiện trạng database files (payments.json, rooms.json, users.json)
- [ ] Tạo 5 payment records mẫu với room/user reference đúng
- [ ] Save vào database/hotel.payments.json

## ⏳ Step 3: Fix UI Empty State
- [ ] Update OrderManager.jsx → Hiển thị message khi không có data
- [ ] Test F5 reload → data hiển thị OK

## ⏳ Step 4: Test & Verify
- [ ] Reload OrderManager → Thấy data
- [ ] Test OrderHistory (user side)
- [ ] Check API logs server

## ⏳ Step 5: Production data sync
- [ ] Hướng dẫn tạo real data flow (từ payment tạo → lưu DB)

