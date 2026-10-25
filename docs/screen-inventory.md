# Bảng kiểm kê 16 màn hình

> Cột Task/Branch/OBS là kế hoạch truy vết. Nhóm phải thay `PENDING` bằng liên kết/chứng cứ thật trước khi nộp.

| ID | Role | User Goal | User Task | Screen | File | CRUD | States | AI | Assignee | Task / Branch | OBS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S01 | Chung | Bắt đầu đúng bàn | Chọn bàn | Giới thiệu & chọn bàn | `index.html` | R/U table session | normal, disabled, selected | Không | SV1 | TASK-01 / `feature/home-table` | PENDING |
| S02 | Chung | Vào đúng khu vực | Chọn vai trò | Đăng nhập nhân viên | `pages/login.html` | R | normal | Không | SV1 | TASK-02 / `feature/role-login` | PENDING |
| S03 | Khách | Tìm món phù hợp | Tìm/lọc/sắp xếp/thêm món | Thực đơn | `pages/diner-menu.html` | R/C cart | loading, normal, empty, AI failure | Taste Recommender | SV1 | TASK-03 / `feature/diner-menu` | PENDING |
| S04 | Khách | Hiểu và tùy chỉnh món | Chọn số lượng/ghi chú | Chi tiết món | `pages/diner-dish-detail.html` | C/R/U cart | normal, validation, success | Không | SV1 | TASK-04 / `feature/dish-detail` | PENDING |
| S05 | Khách | Kiểm tra trước khi gửi | Sửa/xóa/gửi đơn | Giỏ món | `pages/diner-table-order.html` | C/R/U/D | normal, empty, disabled, success | Không | SV1 | TASK-05 / `feature/table-order` | PENDING |
| S06 | Khách | Biết tiến độ và phản hồi | Theo dõi/gửi đánh giá | Theo dõi đơn | `pages/diner-order-status.html` | R/C feedback | loading, pending, served, success | Không | SV1 | TASK-06 / `feature/order-status` | PENDING |
| S07 | Bếp | Điều phối đơn | Nhận/chuyển trạng thái | Bảng đơn bếp | `pages/kitchen-board.html` | R/U order | loading, normal, empty, error, success | Không | SV2 | TASK-07 / `feature/kitchen-board` | PENDING |
| S08 | Bếp | Kiểm tra đơn kỹ | Tick món/đổi trạng thái/ưu tiên | Chi tiết đơn | `pages/kitchen-order-detail.html` | C/R/U | normal, pending, completed, cancelled | Không | SV2 | TASK-08 / `feature/kitchen-detail` | PENDING |
| S09 | Bếp | Xử lý đơn trễ | Lọc ngưỡng/ưu tiên/dự báo | Cảnh báo chờ | `pages/kitchen-wait-time-alerts.html` | C/R/U | normal, empty, loading, AI failure | Load Predictor | SV2 | TASK-09 / `feature/wait-alerts` | PENDING |
| S10 | Quản lý | Duy trì menu | Tạo/tìm/lọc/ẩn món | Quản lý thực đơn | `pages/manager-menu-management.html` | C/R/U/Archive | normal, empty, validation, success | Không | SV3 | TASK-10 / `feature/menu-management` | PENDING |
| S11 | Quản lý | Đọc hiệu suất | Lọc/xem/xuất CSV | Thống kê bán hàng | `pages/manager-sales-insights.html` | R/Export | normal, success | Không | SV3 | TASK-11 / `feature/sales-insights` | PENDING |
| S12 | Quản lý | Biến phản hồi thành hành động | Đọc/trả lời/nhóm chủ đề | Trung tâm phản hồi | `pages/manager-feedback-center.html` | R/U | normal, loading, success, AI failure | Theme Extractor | SV3 | TASK-12 / `feature/feedback-center` | PENDING |
| S13 | Quản trị | Quản lý chỗ ngồi | Tạo bàn/đổi trạng thái | Quản lý bàn | `pages/admin-table-management.html` | C/R/U | normal, validation, success | Không | SV3 | TASK-13 / `feature/table-admin` | PENDING |
| S14 | Quản trị | Kiểm soát truy cập | Tạo/tìm/lọc/vô hiệu | Quản lý tài khoản | `pages/admin-user-management.html` | C/R/U/Disable | normal, validation, success | Không | SV3 | TASK-14 / `feature/user-admin` | PENDING |
| S15 | Quản trị | Cấu hình hệ thống | Sửa/lưu/reset | Cài đặt | `pages/admin-settings.html` | R/U/D reset | normal, validation, success, danger | Không | SV3 | TASK-15 / `feature/settings` | PENDING |
| S16 | Chung | Phục hồi khi sai URL | Tìm món/quay lại | 404 | `pages/404.html` | R | error, recovery | Không | SV1 | TASK-16 / `feature/not-found` | PENDING |

