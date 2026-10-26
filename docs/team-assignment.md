 Phân công 2 chiều (Vertical Slice + Trục chéo)** cho 3 thành viên:
| Thành viên | Trách nhiệm dọc (Vertical Slice - Theo Role) | Trách nhiệm chéo (Cross-Responsibility - Toàn hệ thống) |
| :--- | :--- | :--- |
| Hoàng | khối mặt tiền | **Trục chéo 1**: Kiểm thử Responsive đa thiết bị (320px, 768px, 1024px+), Thanh điều hướng chung (Navigation / Role Switcher), Khả năng tiếp cận (A11y) |
| Dương | khối vận hành | **Trục chéo 2**: xử lý dữ liệu ( backend) , Dữ liệu mẫu JSON (15–25 bản ghi), Triển khai (Deploy) & QA |
| Hải | khối quản trị | **Trục chéo 3**: Hệ thống thiết kế (`css/style.css`, biến `:root`), Quản lý hợp nhất nhánh Git (`dev` $\rightarrow$ `main`) |




👤 SV1 — Khối Mặt tiền: Hành trình Thực khách (6 màn)
Logic nghiệp vụ: Toàn bộ trải nghiệm của một người khách bước vào quán từ lúc quét QR, xem menu đến khi gửi đơn.
Danh sách màn hình (6 màn):
index.html — Trang chủ giới thiệu & Chọn bàn bắt đầu
pages/login.html — Cổng đăng nhập nhân viên
pages/diner-menu.html — Thực đơn tìm kiếm/lọc món
pages/diner-dish-detail.html — Xem chi tiết món, chọn topping/ghi chú
pages/diner-table-order.html — Giỏ món bàn ăn, xem lại tiền & gửi đơn
pages/diner-order-status.html — Khách theo dõi tiến độ món ra & gửi phản hồi

Tính năng AI phụ trách: AI-1 — Taste Recommender (Gợi ý món ăn theo khẩu vị thực khách).
Trách nhiệm chéo toàn hệ thống: Hệ thống thiết kế (Design System, biến :root màu sắc/font chữ, Header/Navbar chung, thanh Role Switcher, Accessibility Tab/Esc).


👨‍🍳 SV2 — Khối Vận hành: Điều phối Bếp & Phục vụ (5 màn)
Logic nghiệp vụ: Toàn bộ công việc thực thi đơn hàng tại quán (Bếp nấu gì, bàn nào đang ngồi, bàn nào yêu cầu thanh toán bill).
Danh sách màn hình (5 màn):
pages/kitchen-board.html — Bảng Kanban điều phối món (Chờ 
→
→ Nấu 
→
→ Xong)
pages/kitchen-order-detail.html — Chi tiết từng đơn cần nấu, tick xong từng món
pages/kitchen-wait-time-alerts.html — Cảnh báo đơn trễ thời gian chờ
pages/admin-table-management.html — Quản lý trạng thái bàn (Trống / Có khách) & in QR bàn
pages/manager-payment-requests.html — Danh sách bàn yêu cầu thanh toán & xác nhận thu tiền

Tính năng AI phụ trách: AI-2 — Kitchen Load Predictor (Dự báo quá tải bếp và cảnh báo thời gian chờ).
Trách nhiệm chéo toàn hệ thống: Kiến trúc dữ liệu localStorage (js/database.js), file dữ liệu mẫu 24 món (assets/data/app-data.json), viết hàm dùng chung escapeHTML() chống XSS.


💼 SV3 — Khối Quản trị: Quản lý & Chủ nhà hàng (6 màn)
Logic nghiệp vụ: Bộ não chiến lược của nhà hàng (quản lý món bán, xem doanh thu lời lỗ, xem đánh giá của khách, quản lý tài khoản nhân viên và cấu hình quán).
Danh sách màn hình (6 màn):
pages/manager-menu-management.html — CRUD quản lý món ăn, đổi giá, bật/tắt hết hàng
pages/manager-sales-insights.html — Báo cáo doanh số bán chạy, biểu đồ & xuất CSV
pages/manager-feedback-center.html — Trung tâm tiếp nhận và xử lý đánh giá của khách
pages/admin-user-management.html — Quản lý tài khoản nhân viên (cấp quyền, vô hiệu hóa)
pages/admin-settings.html — Cài đặt thông tin nhà hàng, hotline, chế độ Sáng/Tối
pages/404.html — Màn hình báo lỗi và phục hồi điều hướng hệ thống

Tính năng AI phụ trách: AI-3 — Feedback Theme Extractor (Trợ lý AI phân tích và gom nhóm chủ đề phản hồi của khách).
Trách nhiệm chéo toàn hệ thống: Kiểm thử Responsive đa thiết bị (320px điện thoại, 768px tablet, desktop), quản lý merge Git (dev 
→
→ main), Deploy website lên mạng & QA.

