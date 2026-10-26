# Bảng Phân Công Nhiệm Vụ 2 Chiều (Team Assignment)

> **Học phần:** Phát triển ứng dụng Web cơ bản – CSE122  
> **Dự án:** BTL-09 – MenuMind (Thực đơn thông minh & Điều phối đơn hàng F&B)  
> **Nhóm thực hiện:** Nhóm 09 (Lớp 67KTPM2 – Đại học Thủy Lợi)  
> **Giảng viên hướng dẫn & chấm điểm:** ThS. Kiều Tuấn Dũng – ThS. Tạ Chí Hiếu  

---

## 1. Phân Công Trách Nhiệm 2 Chiều (Vertical Slice + Trục Chéo)

Nhóm áp dụng mô hình phân chia công việc cân bằng theo tỷ lệ vàng **6 – 5 – 6**, kết hợp giữa Lát cắt dọc (phụ trách trọn gói UI & Logic) và Trục trách nhiệm chéo toàn hệ thống:

| STT | Thành viên | Vai trò | Lát cắt dọc (Vertical Slice - Theo Role) | Trục trách nhiệm chéo (Cross-Responsibility - Toàn hệ thống) |
| :---: | :--- | :---: | :--- | :--- |
| **SV1** | **Trương Việt Hoàng** | Thành viên | **Khối Khách hàng (6 màn):** S01 – S06<br>⭐ Phụ trách **AI-1: Taste Recommender** | **Trục chéo 1 — Hệ thống Thiết kế & A11y:**<br>• Xây dựng Design System, biến `:root` trong `css/common.css`<br>• Khung điều hướng & Role Switcher<br>• Tiêu chuẩn tiếp cận (Tab `:focus-visible`, Esc, `alt`, `label`) |
| **SV2** | **Đặng Xuân Dương** | Thành viên | **Khối Vận hành Bếp & Sảnh (5 màn):** S07 – S11<br>⭐ Phụ trách **AI-2: Kitchen Load Predictor** | **Trục chéo 2 — Kiến trúc Dữ liệu & Bảo mật:**<br>• Xử lý dữ liệu `localStorage` trong `js/database.js`<br>• Tạo bộ dữ liệu mẫu JSON 24 món (`assets/data/app-data.json`)<br>• Viết hàm chống tấn công XSS `escapeHTML()` trong `js/api.js` |
| **SV3** | **Nguyễn Hoàng Hải** | **Trưởng nhóm (Leader)** | **Khối Quản trị & Báo cáo (6 màn):** S12 – S17<br>⭐ Phụ trách **AI-3: Feedback Theme Extractor** | **Trục chéo 3 — Responsive QA, Git & Triển khai:**<br>• Kiểm thử Responsive đa thiết bị (320px điện thoại, 768px tablet, desktop)<br>• Quản lý kiến trúc Git, hợp nhất nhánh (`dev` $\rightarrow$ `main`)<br>• Triển khai thực tế (Live Deploy GitHub Pages) & Tổng duyệt QA |

---

## 2. Chi Tiết Lát Cắt Dọc Của Từng Thành Viên

### 👤 SV1 — Trương Việt Hoàng: Khối Mặt tiền — Hành trình Thực khách (6 màn)
* **Logic nghiệp vụ:** Toàn bộ trải nghiệm của thực khách từ lúc bước vào quán quét QR bàn, khám phá thực đơn, nhận tư vấn AI cho đến khi gửi đơn và theo dõi trạng thái món.
* **Danh sách màn hình (6 màn):**
  1. `index.html` — Trang chủ giới thiệu & Chọn bàn bắt đầu
  2. `pages/login.html` — Cổng đăng nhập nhân viên theo vai trò
  3. `pages/diner-menu.html` — Thực đơn thông minh, tìm kiếm & lọc món
  4. `pages/diner-dish-detail.html` — Chi tiết món ăn, chọn khẩu phần & ghi chú
  5. `pages/diner-table-order.html` — Giỏ món bàn ăn, kiểm tra tiền & gửi đơn
  6. `pages/diner-order-status.html` — Theo dõi tiến độ ra món & gửi đánh giá sao
* **Tính năng AI sở hữu:** **AI-1 — Taste Recommender** (Gợi ý món ăn theo sở thích và chế độ ăn của khách).

---

### 👨‍🍳 SV2 — Đặng Xuân Dương: Khối Vận hành — Điều phối Bếp & Sảnh (5 màn)
* **Logic nghiệp vụ:** Toàn bộ công việc thực thi đơn hàng tại quán (Bếp nhận đơn nấu gì, bàn nào đang chờ lâu cần ưu tiên, bàn nào yêu cầu thanh toán).
* **Danh sách màn hình (5 màn):**
  1. `pages/kitchen-board.html` — Bảng Kanban điều phối món (Chờ $\rightarrow$ Nấu $\rightarrow$ Xong)
  2. `pages/kitchen-order-detail.html` — Chi tiết từng đơn cần nấu, tick xong từng món
  3. `pages/kitchen-wait-time-alerts.html` — Cảnh báo đơn trễ thời gian chờ & dự báo quá tải
  4. `pages/admin-table-management.html` — Quản lý trạng thái bàn (Trống / Có khách) & in QR bàn
  5. `pages/manager-payment-requests.html` — Danh sách bàn yêu cầu thanh toán & xác nhận thu tiền
* **Tính năng AI sở hữu:** **AI-2 — Kitchen Load Predictor** (Dự báo tải bếp và cảnh báo rủi ro trễ món).

---

### 💼 SV3 — Nguyễn Hoàng Hải (Leader): Khối Quản trị — Quản lý & Chủ nhà hàng (6 màn)
* **Logic nghiệp vụ:** Bộ não chiến lược của nhà hàng (kiểm soát menu, phân tích doanh thu lời lỗ, xử lý phản hồi khách, quản trị tài khoản nhân sự và cài đặt hệ thống).
* **Danh sách màn hình (6 màn):**
  1. `pages/manager-menu-management.html` — CRUD thực đơn, đổi giá, bật/tắt trạng thái hết hàng
  2. `pages/manager-sales-insights.html` — Báo cáo doanh số, biểu đồ bán chạy & xuất CSV
  3. `pages/manager-feedback-center.html` — Trung tâm tiếp nhận và xử lý đánh giá của khách
  4. `pages/admin-user-management.html` — Phân quyền tài khoản nhân viên (cấp quyền, khóa tài khoản)
  5. `pages/admin-settings.html` — Cấu hình thông tin quán, giờ trễ, chế độ Sáng/Tối
  6. `pages/404.html` — Màn hình báo lỗi và phục hồi điều hướng hệ thống
* **Tính năng AI sở hữu:** **AI-3 — Feedback Theme Extractor** (Trợ lý AI phân tích cảm xúc và gom nhóm chủ đề nhận xét).
