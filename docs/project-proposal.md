# Đề xuất sản phẩm MenuMind

## Ngữ cảnh và vấn đề

Nhà hàng có menu dài khiến khách khó quyết định. Trong giờ cao điểm, cùng một đơn đi qua khách, bếp và phục vụ nhưng trạng thái dễ lệch nhau. Quản lý lại thiếu một nơi tập trung để thấy món bán chạy, thời gian chờ và chủ đề phản hồi.

MenuMind xử lý bốn vấn đề:

- P1: Menu khó khám phá → tìm kiếm, danh mục, sắp xếp và chi tiết món.
- P2: Khách không biết món hợp khẩu vị → Taste Recommender có giải thích và quyền kiểm soát.
- P3: Trạng thái đơn lệch giữa các vai trò → một vòng đời đơn lưu trong `localStorage`.
- P4: Thiếu insight → thống kê bán hàng và Feedback Theme Extractor.

## Vai trò và mục tiêu

1. Thực khách muốn chọn món nhanh, tùy chỉnh, gửi đơn và biết còn chờ bao lâu.
2. Nhân viên bếp muốn nhìn ưu tiên, cập nhật tiến độ và dự báo tải.
3. Quản lý muốn điều chỉnh menu, đọc hiệu suất và biến phản hồi thành hành động.
4. Quản trị viên muốn kiểm soát bàn, tài khoản và cấu hình dùng chung.

## Sitemap và user flow

```text
Trang chủ / chọn bàn
├── Thực đơn → Chi tiết món → Giỏ món → Theo dõi đơn → Phản hồi
└── Đăng nhập nhân viên
    ├── Bếp: Bảng đơn → Chi tiết → Cảnh báo chờ
    ├── Quản lý: Thực đơn → Doanh thu → Phản hồi
    └── Quản trị: Bàn → Tài khoản → Cài đặt
```

Luồng nghiệp vụ đầu-cuối:

```text
Khách chọn bàn → thêm món → gửi đơn
→ đơn xuất hiện ở bảng bếp → bếp chuyển trạng thái
→ khách xem tiến độ → gửi phản hồi
→ quản lý phân tích chủ đề → lưu insight
```

## Thực thể và vòng đời

| Thực thể | Vòng đời chính |
|---|---|
| menuItems | tạo → mở bán → cập nhật → tạm ẩn |
| orders | mới nhận → đang nấu → chờ phục vụ → đã phục vụ / đã hủy |
| orderItems | thêm → đổi số lượng/ghi chú → bỏ món |
| tables | sẵn sàng → đang dùng / đã đặt → đang dọn → sẵn sàng |
| feedback | mới → phân loại → đã phản hồi |
| staff | tạo → hoạt động → vô hiệu hóa / kích hoạt lại |

## Hệ thống thiết kế

- Màu mực `#102A2B`: thông tin vận hành.
- Xanh lá `#176B5B`: hành động chính và trạng thái ổn định.
- Xanh non `#D9E7A6`: vùng AI và nhịp bếp.
- Cam quýt `#F1A33A`: món ăn, ưu tiên và cảnh báo nhẹ.
- Đỏ gạch `#B94A3D`: lỗi, hủy và thao tác nguy hiểm.
- Font: Manrope cho tiêu đề, Be Vietnam Pro cho nội dung.

Thiết kế tránh chia mọi nội dung thành card giống nhau. Trang chủ dùng “service pulse” hình đĩa; bảng bếp ưu tiên mật độ và nhịp; màn quản trị dùng bảng/card responsive theo bản chất dữ liệu.

