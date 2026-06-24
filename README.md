# QA Dashboard Automation Platform

Hệ thống hiển thị báo cáo chất lượng QA cho Shopee E-commerce dựa trên tài liệu kiến trúc.

## Triển khai nhanh
1. Đẩy toàn bộ thư mục này lên GitHub của bạn.
2. Kết nối GitHub với Render dưới dạng **Web Service**.
3. Cấu hình Build Command: `cd backend && npm install`
4. Cấu hình Start Command: `cd backend && npm start`
5. Cấu hình các biến môi trường (`Advanced` -> `Environment Variables`):
   - `SPREADSHEET_ID`
   - `GSHEETS_CLIENT_EMAIL`
   - `GSHEETS_PRIVATE_KEY`
