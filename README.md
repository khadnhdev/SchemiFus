# Chemistry Fusion

Ứng dụng mô phỏng phản ứng hóa học tương tác cho học sinh trung học.

## Mô tả

Chemistry Fusion là ứng dụng web giúp học sinh khám phá phản ứng hóa học một cách trực quan. Người dùng có thể chọn nguyên tố, điều chỉnh điều kiện phản ứng và xem kết quả ngay lập tức.

## Tính năng

- Chọn từ danh sách đầy đủ các nguyên tố hóa học
- Điều chỉnh nhiệt độ, áp suất và chất xúc tác
- Xem phương trình phản ứng và giải thích
- Lưu phản ứng vào sổ tay để tham khảo sau
- Hệ thống điểm thưởng tương tác

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:
   ```
   npm install
   ```
3. Tạo file `.env` với nội dung:
   ```
   PORT=30333
   GEMINI_API_KEY=your_api_key
   ```
4. Chạy ứng dụng:
   ```
   npm start
   ```
5. Truy cập ứng dụng tại `http://localhost:30333`

## Sử dụng

1. Chọn các nguyên tố (tối đa 3)
2. Đặt điều kiện phản ứng
3. Nhấn "Tiến hành Phản ứng"
4. Xem kết quả và lưu vào sổ tay nếu muốn

## Công nghệ

- Node.js và Express
- Bootstrap cho giao diện
- Gemini AI API cho phân tích phản ứng
- LocalStorage lưu trữ dữ liệu người dùng
